"""Deterministic local startup: python -m backend.dev [--check]."""

import argparse
from pathlib import Path
from urllib.parse import urlparse

import jwt
from dotenv import load_dotenv

from backend.app.config import Settings


ROOT = Path(__file__).resolve().parents[1]
PROJECT_URL = "https://mnjmugwkjtihqswssiwa.supabase.co"


def load_local_settings() -> Settings:
    # File configuration takes precedence for this explicit local-only launcher.
    load_dotenv(ROOT / ".env.local", override=True)
    return Settings.from_environment()


def validate_local_settings(settings: Settings) -> list[str]:
    errors = []
    if (settings.supabase_url or "").rstrip("/") != PROJECT_URL:
        errors.append("SUPABASE_URL must identify the approved development project.")
    if not settings.supabase_secret_key:
        errors.append("SUPABASE_SECRET_KEY is missing.")
    elif settings.supabase_secret_key.startswith("sb_publishable_"):
        errors.append("SUPABASE_SECRET_KEY must be a server credential.")
    elif not settings.supabase_secret_key.startswith("sb_secret_"):
        try:
            claims = jwt.decode(settings.supabase_secret_key, options={"verify_signature": False})
            if claims.get("role") != "service_role":
                errors.append("SUPABASE_SECRET_KEY is not a service-role credential.")
        except jwt.PyJWTError:
            errors.append("SUPABASE_SECRET_KEY format is invalid; do not use a CLI session token.")
    if settings.supabase_auth_verification_mode != "jwks":
        errors.append("This development checkpoint requires JWKS verification.")
    if settings.supabase_jwks_url != f"{PROJECT_URL}/auth/v1/.well-known/jwks.json":
        errors.append("SUPABASE_JWKS_URL must match the approved project.")
    if settings.supabase_jwt_issuer != f"{PROJECT_URL}/auth/v1":
        errors.append("SUPABASE_JWT_ISSUER must match the approved project.")
    if settings.supabase_jwt_audience != "authenticated":
        errors.append("SUPABASE_JWT_AUDIENCE must be authenticated.")
    if urlparse(settings.allowed_origin).scheme not in {"http", "https"}:
        errors.append("ALLOWED_ORIGIN must be an HTTP origin.")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    settings = load_local_settings()
    errors = validate_local_settings(settings)
    for message in errors:
        print(message)
    if errors:
        return 1
    print("Local backend configuration validated; credential values suppressed.")
    if not args.check:
        import uvicorn
        try:
            from backend.app.main import create_app
            application = create_app(settings=settings)
        except Exception:
            print("Backend initialization failed; check server credential configuration. Values suppressed.")
            return 1
        uvicorn.run(application, host="127.0.0.1", port=args.port,
                    access_log=False, log_level="warning")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
