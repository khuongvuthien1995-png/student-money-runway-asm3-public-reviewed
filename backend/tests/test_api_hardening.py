"""Offline HTTP contracts and fail-closed financial response boundaries."""

from copy import deepcopy
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from backend.app.config import Settings
from backend.app.errors import RepositoryError
from backend.app.main import create_app
from backend.tests.test_api import USER_A, USER_B, FakeRepository, StubVerifier, auth, canonical_plan


PLAN_PATH = "/api/plans/current"
PURCHASE_PATH = f"{PLAN_PATH}/purchases"
PLAN_FIELDS = {"id", "userId", "planningDate", "availableFundsCents", "safetyBufferCents", "fixedEssentialsCents",
               "flexibleEssentialsCents", "protectedTotalCents", "runwayCents", "shortfallCents", "createdAt", "updatedAt"}
PURCHASE_FIELDS = {"id", "planId", "userId", "name", "amountCents", "createdAt"}


@pytest.fixture
def http_api():
    repository = FakeRepository()
    with TestClient(create_app(settings=Settings(), repository=repository, token_verifier=StubVerifier())) as client:
        yield client, repository


def assert_error(response, status, code):
    assert response.status_code == status
    body = response.json()
    assert set(body) == {"error"}
    assert set(body["error"]) == {"code", "message"}
    assert body["error"]["code"] == code
    assert isinstance(body["error"]["message"], str)
    assert "test-only-private" not in response.text


def proposal(**changes):
    return {"name": "Test Purchase", "amountCents": 16000, "idempotencyKey": str(uuid4()), **changes}


def test_canonical_round_trip_purchase_replay_history_and_two_user_isolation(http_api):
    client, repository = http_api
    for path in (PLAN_PATH, PURCHASE_PATH):
        assert_error(client.get(path, headers=auth()), 404, "PLAN_NOT_FOUND")
    saved = client.put(PLAN_PATH, headers=auth(), json={**canonical_plan(), "userId": str(USER_B), "user_id": str(USER_B)})
    assert saved.status_code == 200
    assert set(saved.json()) == {"plan"} and set(saved.json()["plan"]) == PLAN_FIELDS
    plan_id = saved.json()["plan"]["id"]
    assert saved.json()["plan"]["userId"] == str(USER_A)
    assert client.get(PLAN_PATH, headers=auth()).json() == saved.json()
    assert client.get(PURCHASE_PATH, headers=auth()).json() == {"purchases": []}
    updated = client.put(PLAN_PATH, headers=auth(), json={**canonical_plan(), "safetyBufferCents": 11000})
    assert updated.json()["plan"]["id"] == plan_id
    assert updated.json()["plan"]["runwayCents"] == 20500
    client.put(PLAN_PATH, headers=auth(), json=canonical_plan())
    client.put(PLAN_PATH, headers=auth("user-b"), json=canonical_plan())
    request = proposal(name="  Test Purchase  ")
    confirmed = client.post(PURCHASE_PATH, headers=auth(), json=request)
    assert confirmed.status_code == 201
    result = confirmed.json()
    assert set(result) == {"purchase", "plan", "replayed"}
    assert set(result["purchase"]) == PURCHASE_FIELDS
    assert set(result["plan"]) == PLAN_FIELDS
    assert result["replayed"] is False and result["purchase"]["name"] == "Test Purchase"
    assert result["plan"]["availableFundsCents"] == 79000 and result["plan"]["runwayCents"] == 5500
    replay = client.post(PURCHASE_PATH, headers=auth(), json={**request, "name": "Test Purchase"})
    assert replay.status_code == 200 and replay.json()["replayed"] is True
    assert replay.json()["purchase"] == result["purchase"]
    assert replay.json()["plan"]["availableFundsCents"] == 79000
    for changed in ({**request, "name": "Changed"}, {**request, "amountCents": 16001}):
        assert_error(client.post(PURCHASE_PATH, headers=auth(), json=changed), 409, "IDEMPOTENCY_KEY_REUSED")
    assert_error(client.post(PURCHASE_PATH, headers=auth("user-b"), json=request), 409, "IDEMPOTENCY_KEY_REUSED")
    assert client.get(PURCHASE_PATH, headers=auth()).json() == {"purchases": [result["purchase"]]}
    assert client.get(PURCHASE_PATH, headers=auth("user-b")).json() == {"purchases": []}
    assert client.get(PLAN_PATH, headers=auth("user-b")).json()["plan"]["availableFundsCents"] == 95000
    assert len(repository.plans) == 2 and len(repository.purchases) == 1


@pytest.mark.parametrize("method,path", [("GET", PLAN_PATH), ("PUT", PLAN_PATH), ("GET", PURCHASE_PATH), ("POST", PURCHASE_PATH)])
@pytest.mark.parametrize("authorization", [None, "Basic test-only", "Bearer", "Bearer bad"])
def test_all_financial_operations_require_bearer_authentication(http_api, method, path, authorization):
    client, repository = http_api
    headers = {} if authorization is None else {"Authorization": authorization}
    body = canonical_plan() if method == "PUT" else proposal() if method == "POST" else None
    response = client.request(method, path, headers=headers, json=body)
    assert_error(response, 401, "INVALID_ACCESS_TOKEN" if authorization == "Bearer bad" else "UNAUTHENTICATED")
    assert not repository.plans and not repository.purchases


@pytest.mark.parametrize("field", ["availableFundsCents", "safetyBufferCents", "fixedEssentialsCents", "flexibleEssentialsCents"])
@pytest.mark.parametrize("amount", [-1, 100000001, 1.5, True, "100", None])
def test_plan_cents_invalid_types_and_bounds_are_422_before_any_write(http_api, field, amount):
    client, repository = http_api
    assert_error(client.put(PLAN_PATH, headers=auth(), json={**canonical_plan(), field: amount}), 422, "INVALID_REQUEST")
    assert not repository.plans


@pytest.mark.parametrize("payload", [
    {"name": ""}, {"name": "   "}, {"name": "x" * 121}, {"name": 123},
    {"amountCents": 0}, {"amountCents": -1}, {"amountCents": 100000001}, {"amountCents": 1.1},
    {"amountCents": True}, {"amountCents": "16000"}, {"idempotencyKey": "not-a-uuid"}, {"idempotencyKey": None},
])
def test_invalid_purchase_input_is_422_without_purchase_or_deduction(http_api, payload):
    client, repository = http_api
    client.put(PLAN_PATH, headers=auth(), json=canonical_plan())
    assert_error(client.post(PURCHASE_PATH, headers=auth(), json=proposal(**payload)), 422, "INVALID_REQUEST")
    assert len(repository.purchases) == 0 and repository.plans[USER_A]["available_funds_cents"] == 95000


@pytest.mark.parametrize("planning_date", ["2026-02-30", "0000-01-01", "", None, 0, "2026-10-12T00:00:00Z"])
def test_invalid_date_is_422_without_save(http_api, planning_date):
    client, repository = http_api
    assert_error(client.put(PLAN_PATH, headers=auth(), json={**canonical_plan(), "planningDate": planning_date}), 422, "INVALID_REQUEST")
    assert not repository.plans


@pytest.mark.parametrize("available,fixed,flexible,buffer,protected,runway,shortfall", [
    (95000, 45500, 18000, 10000, 73500, 21500, 0),
    (65000, 45400, 18000, 10000, 73400, 0, 8400),
    (0, 0, 0, 0, 0, 0, 0), (3, 1, 1, 1, 3, 0, 0),
    (100000000, 100000000, 100000000, 100000000, 300000000, 0, 200000000),
])
def test_exact_integer_cents_and_derived_bounds(http_api, available, fixed, flexible, buffer, protected, runway, shortfall):
    client, _ = http_api
    response = client.put(PLAN_PATH, headers=auth(), json={"planningDate": "2026-10-12", "availableFundsCents": available,
        "fixedEssentialsCents": fixed, "flexibleEssentialsCents": flexible, "safetyBufferCents": buffer})
    assert response.status_code == 200
    plan = response.json()["plan"]
    assert (plan["protectedTotalCents"], plan["runwayCents"], plan["shortfallCents"]) == (protected, runway, shortfall)
    assert all(type(plan[field]) is int for field in PLAN_FIELDS if field.endswith("Cents"))


def test_excess_rejection_has_no_mock_effects_and_exact_runway_is_allowed(http_api):
    client, repository = http_api
    client.put(PLAN_PATH, headers=auth(), json=canonical_plan())
    before = deepcopy(repository.plans)
    assert_error(client.post(PURCHASE_PATH, headers=auth(), json=proposal(amountCents=30000)), 409, "PURCHASE_EXCEEDS_RUNWAY")
    assert repository.plans == before and not repository.purchases
    confirmed = client.post(PURCHASE_PATH, headers=auth(), json=proposal(amountCents=21500))
    assert confirmed.status_code == 201 and confirmed.json()["plan"]["runwayCents"] == 0
    assert_error(client.post(PURCHASE_PATH, headers=auth(), json=proposal(amountCents=1)), 409, "PURCHASE_EXCEEDS_RUNWAY")
    assert len(repository.purchases) == 1


@pytest.mark.parametrize("method,path,operation", [
    ("GET", PLAN_PATH, "get_current_plan"), ("PUT", PLAN_PATH, "upsert_current_plan"),
    ("GET", PURCHASE_PATH, "list_purchases"), ("POST", PURCHASE_PATH, "confirm_purchase"),
])
def test_all_database_failures_have_safe_503_envelopes(http_api, monkeypatch, method, path, operation):
    client, repository = http_api
    client.put(PLAN_PATH, headers=auth(), json=canonical_plan())

    def fail(*_args):
        raise RepositoryError("test-only-private-database-password-and-stack")

    monkeypatch.setattr(repository, operation, fail)
    response = client.request(method, path, headers=auth(), json=canonical_plan() if method == "PUT" else proposal() if method == "POST" else None)
    assert_error(response, 503, "DATABASE_OPERATION_FAILED")


@pytest.mark.parametrize("method", ["GET", "PUT"])
@pytest.mark.parametrize("corruption", ["owner", "missing", "float", "negative", "bool"])
def test_bad_or_foreign_plan_rows_are_not_serialized_as_success(http_api, monkeypatch, method, corruption):
    client, repository = http_api
    client.put(PLAN_PATH, headers=auth(), json=canonical_plan())
    row = deepcopy(repository.plans[USER_A])
    if corruption == "owner": row["user_id"] = USER_B
    if corruption == "missing": del row["fixed_essentials_cents"]
    if corruption == "float": row["available_funds_cents"] = 95000.0
    if corruption == "negative": row["available_funds_cents"] = -1
    if corruption == "bool": row["available_funds_cents"] = True
    monkeypatch.setattr(repository, "get_current_plan" if method == "GET" else "upsert_current_plan", lambda *_args: row)
    response = client.request(method, PLAN_PATH, headers=auth(), json=canonical_plan() if method == "PUT" else None)
    assert_error(response, 503, "DATABASE_RESPONSE_INVALID")
    assert "plan" not in response.json()


@pytest.mark.parametrize("corruption", ["owner", "plan", "fraction", "missing"])
def test_foreign_or_bad_history_rows_fail_closed(http_api, monkeypatch, corruption):
    client, repository = http_api
    client.put(PLAN_PATH, headers=auth(), json=canonical_plan())
    client.post(PURCHASE_PATH, headers=auth(), json=proposal())
    row = deepcopy(repository.purchases[0])
    if corruption == "owner": row["user_id"] = USER_B
    if corruption == "plan": row["plan_id"] = uuid4()
    if corruption == "fraction": row["amount_cents"] = 1.5
    if corruption == "missing": del row["name"]
    monkeypatch.setattr(repository, "list_purchases", lambda *_args: [row])
    assert_error(client.get(PURCHASE_PATH, headers=auth()), 503, "DATABASE_RESPONSE_INVALID")


@pytest.mark.parametrize("corruption", ["owner", "payload", "replayed", "missing"])
def test_bad_confirmation_data_is_uncertain_503_not_success(http_api, monkeypatch, corruption):
    client, repository = http_api
    client.put(PLAN_PATH, headers=auth(), json=canonical_plan())
    request = proposal()
    row = repository.confirm_purchase(USER_A, request["name"], request["amountCents"], uuid4())
    if corruption == "owner": row["plan_user_id"] = USER_B
    if corruption == "payload": row["purchase_amount_cents"] = 1
    if corruption == "replayed": row["replayed"] = "false"
    if corruption == "missing": del row["purchase_id"]
    monkeypatch.setattr(repository, "confirm_purchase", lambda *_args: row)
    assert_error(client.post(PURCHASE_PATH, headers=auth(), json=request), 503, "DATABASE_RESPONSE_INVALID")


def test_cors_exact_origin_and_http_operations_are_preserved(http_api):
    client, _ = http_api
    for origin, expected in (("http://localhost:5173", 200), ("https://untrusted.invalid", 400)):
        response = client.options(PLAN_PATH, headers={"Origin": origin, "Access-Control-Request-Method": "PUT", "Access-Control-Request-Headers": "authorization,content-type"})
        assert response.status_code == expected
        assert response.headers.get("access-control-allow-origin") == (origin if expected == 200 else None)
        assert "access-control-allow-credentials" not in response.headers
    assert client.options(PLAN_PATH, headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "DELETE"}).status_code == 400


def test_openapi_success_and_validation_envelopes_match_actual_runtime(http_api):
    client, _ = http_api
    spec = client.get("/openapi.json").json()
    assert set(spec["paths"]) == {"/api/health", PLAN_PATH, PURCHASE_PATH}
    post = spec["paths"][PURCHASE_PATH]["post"]["responses"]
    assert {"200", "201", "401", "404", "409", "422", "503"} <= set(post)
    for status in ("401", "404", "409", "422", "503"):
        assert post[status]["content"]["application/json"]["schema"]["$ref"].endswith("/ErrorResponse")
    assert post["201"]["content"]["application/json"]["schema"]["$ref"].endswith("/PurchaseConfirmationEnvelope")
