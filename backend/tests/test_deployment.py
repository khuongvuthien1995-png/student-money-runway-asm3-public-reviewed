"""C5 deployment boundaries: local entrypoint/configuration and response privacy."""

import importlib
import os
import subprocess
import sys
from uuid import uuid4

from fastapi.testclient import TestClient
import pytest

from backend.app.config import Settings
from backend.app.main import create_app
from backend.tests.test_api import FakeRepository, StubVerifier, auth, canonical_plan


def assert_private(response):
    assert response.headers.get("cache-control") == "private, no-store"
    assert response.headers.get("cdn-cache-control") == "no-store"
    assert response.headers.get("vercel-cdn-cache-control") == "no-store"


@pytest.mark.parametrize("operation", ["plan", "save", "history", "confirm", "replay", "unauthorized", "missing", "invalid", "conflict", "unknown"])
def test_api_success_and_error_responses_cannot_be_cached(operation):
    with TestClient(create_app(settings=Settings(), repository=FakeRepository(), token_verifier=StubVerifier())) as client:
        client.put("/api/plans/current", headers=auth(), json=canonical_plan())
        payload = {"name": "Cache boundary test", "amountCents": 16000, "idempotencyKey": str(uuid4())}
        if operation == "replay":
            client.post("/api/plans/current/purchases", headers=auth(), json=payload)
        calls = {
            "plan": lambda: client.get("/api/plans/current", headers=auth()),
            "save": lambda: client.put("/api/plans/current", headers=auth(), json=canonical_plan()),
            "history": lambda: client.get("/api/plans/current/purchases", headers=auth()),
            "confirm": lambda: client.post("/api/plans/current/purchases", headers=auth(), json=payload),
            "replay": lambda: client.post("/api/plans/current/purchases", headers=auth(), json=payload),
            "unauthorized": lambda: client.get("/api/plans/current"),
            "missing": lambda: client.get("/api/plans/current", headers=auth("user-b")),
            "invalid": lambda: client.put("/api/plans/current", headers=auth(), json={}),
            "conflict": lambda: client.post("/api/plans/current/purchases", headers=auth(), json={**payload, "amountCents": 30000}),
            "unknown": lambda: client.get("/api/unknown"),
        }
        response = calls[operation]()
    expected = {"confirm": 201, "unauthorized": 401, "missing": 404, "invalid": 422, "conflict": 409, "unknown": 404}
    assert response.status_code == expected.get(operation, 200)
    assert response.headers["content-type"].startswith("application/json")
    assert_private(response)


def test_configuration_error_is_not_cacheable_or_a_successful_financial_response():
    with TestClient(create_app(settings=Settings(), token_verifier=StubVerifier())) as client:
        response = client.get("/api/plans/current", headers=auth())
    assert response.status_code == 503
    assert response.json()["error"]["code"] == "DATABASE_CONFIGURATION_MISSING"
    assert_private(response)


def test_invalid_database_config_does_not_break_public_health_or_create_fake_financial_success():
    settings = Settings(supabase_url="not-a-valid-url", supabase_secret_key="c5-test-only-invalid-key")
    with TestClient(create_app(settings=settings, token_verifier=StubVerifier())) as client:
        assert client.get("/api/health").json() == {"status": "ok"}
        assert client.get("/api/plans/current").status_code == 401
        response = client.get("/api/plans/current", headers=auth())
    assert response.status_code == 503
    assert "c5-test-only" not in response.text and "not-a-valid-url" not in response.text


def test_actual_entrypoint_is_the_existing_backend_app():
    entrypoint = importlib.import_module("api.index")
    main = importlib.import_module("backend.app.main")
    assert entrypoint.app is main.app
    assert set(main.app.openapi()["paths"]) == {"/api/health", "/api/plans/current", "/api/plans/current/purchases"}


def test_cold_import_without_cloud_environment_or_local_dotenv():
    environment = {key: value for key, value in os.environ.items() if not key.startswith(("SUPABASE_", "VITE_", "TEST_USER_"))}
    environment["RUN_SUPABASE_LIVE_TESTS"] = "0"
    code = "from api.index import app; from fastapi.testclient import TestClient; from backend.app.repository import UnavailableRepository; assert isinstance(app.state.container.repository, UnavailableRepository); c=TestClient(app); assert c.get('/api/health').json()=={'status':'ok'}; assert c.get('/api/plans/current').status_code==401; assert c.get('/api/api/health').status_code==404; print('Cold import and safe local HTTP PASS')"
    result = subprocess.run([sys.executable, "-c", code], env=environment, capture_output=True, text=True, timeout=20)
    assert result.returncode == 0, "Cold import failed; raw logs suppressed."
    assert result.stdout.strip() == "Cold import and safe local HTTP PASS"
