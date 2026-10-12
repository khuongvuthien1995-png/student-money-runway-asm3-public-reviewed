"""Mock-backed API contract tests; they do not connect to Supabase."""

from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi.testclient import TestClient

from backend.app.errors import AuthenticationError, RepositoryError
from backend.app.main import create_app
from backend.app.models import AuthenticatedUser


USER_A = UUID("11111111-1111-1111-1111-111111111111")
USER_B = UUID("22222222-2222-2222-2222-222222222222")


class StubVerifier:
    def verify(self, token: str) -> AuthenticatedUser:
        if token == "user-a":
            return AuthenticatedUser(id=USER_A)
        if token == "user-b":
            return AuthenticatedUser(id=USER_B)
        raise AuthenticationError("INVALID_ACCESS_TOKEN", "Your session is invalid or has expired.")


class FakeRepository:
    def __init__(self) -> None:
        self.plans: dict[UUID, dict] = {}
        self.purchases: list[dict] = []
        self.keys: dict[UUID, dict] = {}

    def get_current_plan(self, user_id: UUID):
        return self.plans.get(user_id)

    def upsert_current_plan(self, user_id: UUID, values: dict):
        current = self.plans.get(user_id)
        now = datetime.now(timezone.utc)
        row = {
            "id": current["id"] if current else uuid4(),
            "user_id": user_id,
            "created_at": current["created_at"] if current else now,
            "updated_at": now,
            **values,
        }
        self.plans[user_id] = row
        return row

    def list_purchases(self, user_id: UUID, plan_id: UUID):
        return [row for row in self.purchases if row["user_id"] == user_id and row["plan_id"] == plan_id]

    def confirm_purchase(self, user_id: UUID, name: str, amount_cents: int, idempotency_key: UUID):
        existing = self.keys.get(idempotency_key)
        if existing:
            if existing["user_id"] != user_id or existing["name"] != name or existing["amount_cents"] != amount_cents:
                raise RepositoryError("IDEMPOTENCY_KEY_REUSED")
            plan = self.plans[user_id]
            return self._rpc_row(existing, plan, replayed=True)
        plan = self.plans.get(user_id)
        if not plan:
            raise RepositoryError("PLAN_NOT_FOUND")
        protected = plan["fixed_essentials_cents"] + plan["flexible_essentials_cents"] + plan["safety_buffer_cents"]
        if amount_cents > max(0, plan["available_funds_cents"] - protected):
            raise RepositoryError("PURCHASE_EXCEEDS_RUNWAY")
        purchase = {
            "id": uuid4(), "plan_id": plan["id"], "user_id": user_id, "name": name,
            "amount_cents": amount_cents, "created_at": datetime.now(timezone.utc),
        }
        self.keys[idempotency_key] = purchase
        self.purchases.append(purchase)
        plan["available_funds_cents"] -= amount_cents
        plan["updated_at"] = datetime.now(timezone.utc)
        return self._rpc_row(purchase, plan, replayed=False)

    @staticmethod
    def _rpc_row(purchase: dict, plan: dict, replayed: bool) -> dict:
        return {
            "purchase_id": purchase["id"], "purchase_name": purchase["name"],
            "purchase_amount_cents": purchase["amount_cents"], "purchase_created_at": purchase["created_at"],
            "plan_id": plan["id"], "plan_user_id": plan["user_id"], "planning_date": plan["planning_date"],
            "available_funds_cents": plan["available_funds_cents"], "safety_buffer_cents": plan["safety_buffer_cents"],
            "fixed_essentials_cents": plan["fixed_essentials_cents"], "flexible_essentials_cents": plan["flexible_essentials_cents"],
            "plan_created_at": plan["created_at"], "plan_updated_at": plan["updated_at"], "replayed": replayed,
        }


def client_and_repository():
    repository = FakeRepository()
    app = create_app(repository=repository, token_verifier=StubVerifier())
    return TestClient(app), repository


def auth(token: str = "user-a"):
    return {"Authorization": f"Bearer {token}"}


def canonical_plan():
    return {
        "planningDate": "2026-10-12", "availableFundsCents": 95000, "safetyBufferCents": 10000,
        "fixedEssentialsCents": 45500, "flexibleEssentialsCents": 18000,
    }


def test_health_and_openapi_are_available():
    client, _ = client_and_repository()
    assert client.get("/api/health").json() == {"status": "ok"}
    paths = client.get("/openapi.json").json()["paths"]
    assert "/api/plans/current" in paths
    assert "/api/plans/current/purchases" in paths


def test_plan_save_and_canonical_purchase_confirmation_are_authoritative():
    client, _ = client_and_repository()
    saved = client.put("/api/plans/current", headers=auth(), json=canonical_plan())
    assert saved.status_code == 200
    assert saved.json()["plan"]["protectedTotalCents"] == 73500
    assert saved.json()["plan"]["runwayCents"] == 21500

    key = str(uuid4())
    confirmed = client.post(
        "/api/plans/current/purchases", headers=auth(),
        json={"name": "Monthly public transport pass", "amountCents": 16000, "idempotencyKey": key},
    )
    assert confirmed.status_code == 201
    assert confirmed.json()["plan"]["availableFundsCents"] == 79000
    assert confirmed.json()["plan"]["runwayCents"] == 5500

    replay = client.post(
        "/api/plans/current/purchases", headers=auth(),
        json={"name": "Monthly public transport pass", "amountCents": 16000, "idempotencyKey": key},
    )
    assert replay.status_code == 200
    assert replay.json()["replayed"] is True
    assert replay.json()["plan"]["availableFundsCents"] == 79000


def test_excess_purchase_and_missing_or_invalid_auth_are_rejected():
    client, _ = client_and_repository()
    assert client.get("/api/plans/current").status_code == 401
    assert client.get("/api/plans/current", headers=auth("bad")).status_code == 401
    assert client.get("/api/plans/current", headers=auth("user-b")).status_code == 404
    client.put("/api/plans/current", headers=auth(), json=canonical_plan())
    rejected = client.post(
        "/api/plans/current/purchases", headers=auth(),
        json={"name": "Too expensive", "amountCents": 30000, "idempotencyKey": str(uuid4())},
    )
    assert rejected.status_code == 409
    assert rejected.json()["error"]["code"] == "PURCHASE_EXCEEDS_RUNWAY"


def test_request_validation_rejects_invalid_cents_before_repository_access():
    client, _ = client_and_repository()
    invalid = client.put("/api/plans/current", headers=auth(), json={**canonical_plan(), "availableFundsCents": -1})
    assert invalid.status_code == 422
    assert invalid.json()["error"]["code"] == "INVALID_REQUEST"
    decimal_cents = client.put(
        "/api/plans/current", headers=auth(), json={**canonical_plan(), "availableFundsCents": 95000.5}
    )
    assert decimal_cents.status_code == 422
    invalid_purchase = client.post(
        "/api/plans/current/purchases", headers=auth(),
        json={"name": "Purchase", "amountCents": 0, "idempotencyKey": str(uuid4())},
    )
    assert invalid_purchase.status_code == 422
    assert invalid_purchase.json()["error"]["code"] == "INVALID_REQUEST"


def test_database_transport_failure_is_a_safe_retryable_error():
    class FailingRepository(FakeRepository):
        def get_current_plan(self, user_id: UUID):
            raise RepositoryError("provider transport failure")

    app = create_app(repository=FailingRepository(), token_verifier=StubVerifier())
    response = TestClient(app).get("/api/plans/current", headers=auth())
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "DATABASE_OPERATION_FAILED"
