"""Local cryptographic tests; these are not real Supabase sign-in tests."""

import json
import time
from uuid import uuid4

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec

from backend.app.config import Settings
from backend.app.errors import AuthenticationError
from backend.app.security import SupabaseTokenVerifier
from backend.dev import PROJECT_URL, validate_local_settings


@pytest.fixture
def signer_and_verifier():
    key = ec.generate_private_key(ec.SECP256R1())
    jwk = json.loads(jwt.algorithms.ECAlgorithm.to_jwk(key.public_key()))
    jwk.update(kid="local-test-key", alg="ES256", use="sig")
    settings = Settings(supabase_url=PROJECT_URL,
                        supabase_jwks_url=f"{PROJECT_URL}/auth/v1/.well-known/jwks.json",
                        supabase_jwt_issuer=f"{PROJECT_URL}/auth/v1")
    verifier = SupabaseTokenVerifier(settings)
    # Use a local key set for local tests; actual integration tests fetch hosted JWKS.
    verifier._jwks_client.fetch_data = lambda: {"keys": [jwk]}
    claims = {"sub": str(uuid4()), "iss": settings.supabase_jwt_issuer,
              "aud": "authenticated", "exp": int(time.time()) + 60}
    return key, verifier, claims


def test_signed_subject_is_verified(signer_and_verifier):
    key, verifier, claims = signer_and_verifier
    token = jwt.encode(claims, key, algorithm="ES256", headers={"kid": "local-test-key"})
    assert str(verifier.verify(token).id) == claims["sub"]


@pytest.mark.parametrize("change", [
    {"iss": "https://wrong.invalid"}, {"aud": "wrong-audience"},
    {"exp": 1}, {"sub": "invalid-uuid"},
])
def test_signed_invalid_claims_rejected(signer_and_verifier, change):
    key, verifier, claims = signer_and_verifier
    token = jwt.encode({**claims, **change}, key, algorithm="ES256", headers={"kid": "local-test-key"})
    with pytest.raises(AuthenticationError):
        verifier.verify(token)


@pytest.mark.parametrize("missing", ["exp", "sub", "iss", "aud"])
def test_required_claims_rejected_when_missing(signer_and_verifier, missing):
    key, verifier, claims = signer_and_verifier
    del claims[missing]
    token = jwt.encode(claims, key, algorithm="ES256", headers={"kid": "local-test-key"})
    with pytest.raises(AuthenticationError):
        verifier.verify(token)


def test_signature_and_malformed_tokens_rejected(signer_and_verifier):
    _, verifier, claims = signer_and_verifier
    other_key = ec.generate_private_key(ec.SECP256R1())
    forged = jwt.encode(claims, other_key, algorithm="ES256", headers={"kid": "local-test-key"})
    for token in (forged, "not-a-token"):
        with pytest.raises(AuthenticationError):
            verifier.verify(token)


def test_local_startup_rejects_wrong_project_and_nonserver_key():
    errors = validate_local_settings(Settings(supabase_url="https://wrong.invalid",
                                              supabase_secret_key="sb_publishable_local_test"))
    assert any("approved development project" in item for item in errors)
    assert any("server credential" in item for item in errors)


def test_local_launcher_explicitly_loads_file_before_process_settings(tmp_path, monkeypatch):
    import backend.dev as dev
    monkeypatch.setattr(dev, "ROOT", tmp_path)
    monkeypatch.setenv("SUPABASE_URL", "https://stale.invalid")
    monkeypatch.setenv("SUPABASE_SECRET_KEY", "")
    (tmp_path / ".env.local").write_text(f"SUPABASE_URL={PROJECT_URL}\nSUPABASE_SECRET_KEY=\n")
    loaded = dev.load_local_settings()
    assert loaded.supabase_url == PROJECT_URL
    assert not loaded.supabase_secret_key
