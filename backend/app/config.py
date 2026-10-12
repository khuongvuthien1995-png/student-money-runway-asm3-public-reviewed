"""
@file backend/app/config.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:22:38+11:00
@summary Defines non-secret backend configuration loading and validation helpers.
@responsibility Owns environment-derived configuration without logging credentials.
"""

from dataclasses import dataclass
from os import getenv


@dataclass(frozen=True)
class Settings:
    supabase_url: str | None = None
    supabase_secret_key: str | None = None
    supabase_jwks_url: str | None = None
    supabase_jwt_issuer: str | None = None
    supabase_jwt_audience: str = "authenticated"
    supabase_auth_verification_mode: str = "jwks"
    supabase_publishable_key: str | None = None
    allowed_origin: str = "http://localhost:5173"

    @classmethod
    def from_environment(cls) -> "Settings":
        supabase_url = getenv("SUPABASE_URL")
        return cls(
            supabase_url=supabase_url,
            supabase_secret_key=getenv("SUPABASE_SECRET_KEY"),
            supabase_jwks_url=getenv("SUPABASE_JWKS_URL")
            or (f"{supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json" if supabase_url else None),
            supabase_jwt_issuer=getenv("SUPABASE_JWT_ISSUER")
            or (f"{supabase_url.rstrip('/')}/auth/v1" if supabase_url else None),
            supabase_jwt_audience=getenv("SUPABASE_JWT_AUDIENCE", "authenticated"),
            supabase_auth_verification_mode=getenv(
                "SUPABASE_AUTH_VERIFICATION_MODE", "jwks"
            ).lower(),
            supabase_publishable_key=getenv("SUPABASE_PUBLISHABLE_KEY"),
            allowed_origin=getenv("ALLOWED_ORIGIN", "http://localhost:5173"),
        )

    @property
    def database_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_secret_key)

    @property
    def jwks_configured(self) -> bool:
        return bool(self.supabase_jwks_url and self.supabase_jwt_issuer)
