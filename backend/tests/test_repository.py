"""Exercise the actual Supabase SDK and repository over an offline HTTP transport."""

import json
from uuid import uuid4

import httpx
import pytest
from fastapi.testclient import TestClient
from supabase import ClientOptions, create_client

from backend.app.config import Settings
from backend.app.errors import RepositoryError
from backend.app.main import create_app
from backend.app.repository import SupabaseRepository
from backend.tests.test_api import USER_A, USER_B, StubVerifier, auth


def sdk_repository(handler):
    settings = Settings(supabase_url="https://offline-project.invalid", supabase_secret_key="sb_secret_test_only_backend")
    transport = httpx.Client(transport=httpx.MockTransport(handler))
    sdk = create_client(settings.supabase_url, settings.supabase_secret_key, options=ClientOptions(httpx_client=transport))
    return SupabaseRepository(settings, client=sdk), transport


def test_sdk_empty_maybe_single_is_a_real_no_plan_response():
    requests = []

    def handler(request):
        requests.append(request)
        return httpx.Response(200, json=[])

    repository, transport = sdk_repository(handler)
    with transport, TestClient(create_app(settings=Settings(), repository=repository, token_verifier=StubVerifier())) as client:
        response = client.get("/api/plans/current", headers=auth())
    assert response.status_code == 404
    assert response.json() == {"error": {"code": "PLAN_NOT_FOUND", "message": "No saved financial plan exists for this user."}}
    assert requests[0].url.params["user_id"] == f"eq.{USER_A}"


def test_sdk_scope_filters_and_verified_owner_cannot_be_overridden():
    requests = []

    def handler(request):
        requests.append(request)
        if request.url.path.endswith("/rpc/confirm_purchase"):
            return httpx.Response(200, json=[{"replayed": False}])
        if request.method == "POST":
            return httpx.Response(200, json=[json.loads(request.content)])
        return httpx.Response(200, json=[])

    repository, transport = sdk_repository(handler)
    plan_id, key = uuid4(), uuid4()
    with transport:
        repository.upsert_current_plan(USER_A, {"available_funds_cents": 100, "user_id": str(USER_B)})
        repository.list_purchases(USER_A, plan_id)
        repository.confirm_purchase(USER_A, "Test Purchase", 1, key)
    payload = json.loads(requests[0].content)
    assert payload["user_id"] == str(USER_A)
    assert requests[0].url.params["on_conflict"] == "user_id"
    assert requests[1].url.params["user_id"] == f"eq.{USER_A}"
    assert requests[1].url.params["plan_id"] == f"eq.{plan_id}"
    assert requests[1].url.params["order"] == "created_at.desc"
    assert json.loads(requests[2].content) == {"p_user_id": str(USER_A), "p_name": "Test Purchase", "p_amount_cents": 1, "p_idempotency_key": str(key)}
    assert all(request.headers["apikey"] == "sb_secret_test_only_backend" for request in requests)


@pytest.mark.parametrize("operation", ["read", "write", "history", "rpc"])
def test_provider_transport_errors_never_escape_the_error_envelope(operation):
    def handler(request):
        raise httpx.ConnectError("test-only-private-provider-detail", request=request)

    repository, transport = sdk_repository(handler)
    with transport, pytest.raises(RepositoryError):
        if operation == "read":
            repository.get_current_plan(USER_A)
        elif operation == "write":
            repository.upsert_current_plan(USER_A, {})
        elif operation == "history":
            repository.list_purchases(USER_A, uuid4())
        else:
            repository.confirm_purchase(USER_A, "Purchase", 1, uuid4())


def test_actual_postgrest_rpc_error_keeps_exact_business_semantics():
    def handler(_request):
        return httpx.Response(400, json={"code": "P0001", "message": "PURCHASE_EXCEEDS_RUNWAY", "details": None, "hint": None})

    repository, transport = sdk_repository(handler)
    with transport, TestClient(create_app(settings=Settings(), repository=repository, token_verifier=StubVerifier())) as client:
        response = client.post("/api/plans/current/purchases", headers=auth(), json={"name": "Purchase", "amountCents": 30000, "idempotencyKey": str(uuid4())})
    assert response.status_code == 409
    assert response.json()["error"]["code"] == "PURCHASE_EXCEEDS_RUNWAY"


def test_unrelated_database_error_that_mentions_a_business_code_is_not_a_business_rejection():
    def handler(_request):
        return httpx.Response(400, json={"code": "XX000", "message": "Provider failed while processing PLAN_NOT_FOUND", "details": None, "hint": None})

    repository, transport = sdk_repository(handler)
    with transport, TestClient(create_app(settings=Settings(), repository=repository, token_verifier=StubVerifier())) as client:
        response = client.post("/api/plans/current/purchases", headers=auth(), json={"name": "Purchase", "amountCents": 1, "idempotencyKey": str(uuid4())})
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "DATABASE_OPERATION_FAILED"
