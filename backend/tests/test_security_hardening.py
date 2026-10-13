"""Local JWT signatures and Auth HTTP adapters, never hosted Auth acceptance."""

import httpx
import jwt
import pytest
from uuid import uuid4
from fastapi.testclient import TestClient

from backend.app.config import Settings
from backend.app.errors import AuthenticationError, ServiceUnavailableError
from backend.app.main import create_app
from backend.app.security import SupabaseTokenVerifier
from backend.tests.test_api import FakeRepository, USER_A, canonical_plan
from backend.tests.test_security import signer_and_verifier


def signed_token(signer_and_verifier, **changes):
    key, verifier, claims = signer_and_verifier
    return verifier, jwt.encode({**claims, **changes}, key, algorithm="ES256", headers={"kid": "local-test-key"})


def test_jwks_outage_is_503_not_an_invalid_session(signer_and_verifier, monkeypatch):
    verifier, token = signed_token(signer_and_verifier)

    def offline():
        raise jwt.PyJWKClientConnectionError("test-only-private-provider-detail")

    monkeypatch.setattr(verifier._jwks_client, "fetch_data", offline)
    with TestClient(create_app(settings=Settings(), repository=FakeRepository(), token_verifier=verifier)) as client:
        response = client.get("/api/plans/current", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 503
    assert response.json() == {"error": {"code": "AUTH_VERIFICATION_UNAVAILABLE", "message": "Authentication verification is temporarily unavailable."}}
    assert "test-only-private" not in response.text


@pytest.mark.parametrize("payload", [{"keys": []}, [], {"keys": "broken"}])
def test_bad_key_provider_response_is_retryable(signer_and_verifier, monkeypatch, payload):
    verifier, token = signed_token(signer_and_verifier)
    monkeypatch.setattr(verifier._jwks_client, "fetch_data", lambda: payload)
    with pytest.raises(ServiceUnavailableError):
        verifier.verify(token)


def test_unknown_key_is_invalid_but_does_not_disable_signature_checks(signer_and_verifier):
    key, verifier, claims = signer_and_verifier
    token = jwt.encode(claims, key, algorithm="ES256", headers={"kid": "unknown-local-key"})
    with pytest.raises(AuthenticationError):
        verifier.verify(token)


@pytest.mark.parametrize("algorithm", ["none", "HS256"])
def test_unsigned_or_symmetric_algorithm_confusion_is_rejected(signer_and_verifier, algorithm):
    _, verifier, claims = signer_and_verifier
    token = jwt.encode(claims, None if algorithm == "none" else "test-only-hmac-material-that-is-long-enough", algorithm=algorithm,
                       headers={"kid": "local-test-key"})
    with pytest.raises(AuthenticationError):
        verifier.verify(token)


@pytest.mark.parametrize("changes", [
    {"nbf": 9999999999}, {"exp": None}, {"sub": None}, {"aud": []}, {"sub": 123},
    {"exp": {}}, {"exp": []}, {"nbf": {}}, {"iat": []},
])
def test_invalid_signed_claim_shapes_and_future_not_before_are_rejected(signer_and_verifier, changes):
    verifier, token = signed_token(signer_and_verifier, **changes)
    with pytest.raises(AuthenticationError):
        verifier.verify(token)


def test_unrecognized_verification_mode_fails_closed():
    verifier = SupabaseTokenVerifier(Settings(supabase_auth_verification_mode="typo"))
    with pytest.raises(ServiceUnavailableError) as error:
        verifier.verify("test-only-token")
    assert error.value.code == "AUTH_CONFIGURATION_INVALID"


@pytest.mark.parametrize("token", ["not-a-token", "bad.jwt.segments", "a.b.c.d", "", "e30.e30.!", "Bearer extra text"])
def test_malformed_jwt_is_401_before_provider_configuration_or_network(token):
    # Syntax rejection is local; it must not depend on signing-key service availability.
    verifier = SupabaseTokenVerifier(Settings())
    with pytest.raises(AuthenticationError) as error:
        verifier.verify(token)
    assert error.value.code == "INVALID_ACCESS_TOKEN"


def test_structurally_valid_jwt_cannot_authorize_without_trusted_keys(signer_and_verifier):
    _, token = signed_token(signer_and_verifier)
    verifier = SupabaseTokenVerifier(Settings())
    with pytest.raises(ServiceUnavailableError) as error:
        verifier.verify(token)
    assert error.value.code == "AUTH_CONFIGURATION_MISSING"


def legacy_verifier(handler):
    client = httpx.Client(transport=httpx.MockTransport(handler))
    verifier = SupabaseTokenVerifier(Settings(supabase_url="https://offline-project.invalid",
        supabase_publishable_key="sb_publishable_test_only", supabase_auth_verification_mode="legacy_user_endpoint"), http_client=client)
    return verifier, client


@pytest.mark.parametrize("status", [429, 500, 503])
def test_legacy_auth_outage_is_retryable(status):
    verifier, client = legacy_verifier(lambda _request: httpx.Response(status, json={"message": "test-only-private"}))
    with client, pytest.raises(ServiceUnavailableError):
        verifier.verify("test-only-token")


@pytest.mark.parametrize("status", [401, 403])
def test_legacy_invalid_sessions_remain_401(status):
    verifier, client = legacy_verifier(lambda _request: httpx.Response(status, json={}))
    with client, pytest.raises(AuthenticationError):
        verifier.verify("test-only-token")


@pytest.mark.parametrize("body", [None, [], {}, {"id": "bad-uuid"}])
def test_legacy_invalid_success_body_is_a_safe_provider_error(body):
    verifier, client = legacy_verifier(lambda _request: httpx.Response(200, json=body))
    with client, pytest.raises(ServiceUnavailableError):
        verifier.verify("test-only-token")


def test_legacy_subject_and_headers_are_verified_by_the_provider():
    calls = []

    def handler(request):
        calls.append(request)
        return httpx.Response(200, json={"id": str(USER_A)})

    verifier, client = legacy_verifier(handler)
    with client:
        assert verifier.verify("test-only-token").id == USER_A
    assert str(calls[0].url) == "https://offline-project.invalid/auth/v1/user"
    assert calls[0].headers["Authorization"] == "Bearer test-only-token"
    assert calls[0].headers["apikey"] == "sb_publishable_test_only"


def test_production_jwt_verifier_controls_http_ownership_for_two_locally_signed_subjects(signer_and_verifier):
    key, verifier, claims = signer_and_verifier
    second_id = str(uuid4())
    tokens = [jwt.encode({**claims, "sub": owner}, key, algorithm="ES256", headers={"kid": "local-test-key"})
              for owner in (claims["sub"], second_id)]
    headers = [{"Authorization": f"Bearer {token}"} for token in tokens]
    repository = FakeRepository()
    with TestClient(create_app(settings=Settings(), repository=repository, token_verifier=verifier)) as client:
        saved = client.put("/api/plans/current", headers=headers[0], json={**canonical_plan(), "userId": second_id})
        assert saved.status_code == 200 and saved.json()["plan"]["userId"] == claims["sub"]
        assert client.get("/api/plans/current", headers=headers[1]).status_code == 404
        assert client.get("/api/plans/current/purchases", headers=headers[1]).status_code == 404
        client.put("/api/plans/current", headers=headers[1], json=canonical_plan())
        payload = {"name": "JWT-scoped purchase", "amountCents": 16000, "idempotencyKey": str(uuid4()), "userId": second_id}
        confirmed = client.post("/api/plans/current/purchases", headers=headers[0], json=payload)
        assert confirmed.status_code == 201 and confirmed.json()["purchase"]["userId"] == claims["sub"]
        assert client.get("/api/plans/current/purchases", headers=headers[1]).json() == {"purchases": []}
        assert client.get("/api/plans/current", headers=headers[1]).json()["plan"]["availableFundsCents"] == 95000


def test_untrusted_jku_and_embedded_jwk_do_not_override_configured_keys(signer_and_verifier):
    key, verifier, claims = signer_and_verifier
    token = jwt.encode(claims, key, algorithm="ES256", headers={"kid": "local-test-key",
        "jku": "https://untrusted.invalid/keys", "jwk": {"kty": "oct", "k": "dGVzdA"}})
    assert str(verifier.verify(token).id) == claims["sub"]
    assert verifier._jwks_client.uri.endswith("/auth/v1/.well-known/jwks.json")
