"""
@file backend/app/security.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:30:00+11:00
@summary Verifies Supabase bearer tokens before user-scoped API work.
@responsibility Owns authenticated identity derivation and never trusts client user identifiers.
"""

from typing import Protocol
from uuid import UUID

import httpx
import jwt
from jwt import PyJWKClient

from .config import Settings
from .errors import AuthenticationError, ServiceUnavailableError
from .models import AuthenticatedUser


class TokenVerifier(Protocol):
    def verify(self, access_token: str) -> AuthenticatedUser: ...


class SupabaseTokenVerifier:
    def __init__(self, settings: Settings, http_client: httpx.Client | None = None) -> None:
        self._settings = settings
        self._http_client = http_client
        self._jwks_client = (
            PyJWKClient(settings.supabase_jwks_url) if settings.jwks_configured else None
        )

    def verify(self, access_token: str) -> AuthenticatedUser:
        if self._settings.supabase_auth_verification_mode == "legacy_user_endpoint":
            return self._verify_with_user_endpoint(access_token)
        return self._verify_with_jwks(access_token)

    def _verify_with_jwks(self, access_token: str) -> AuthenticatedUser:
        if not self._jwks_client or not self._settings.supabase_jwt_issuer:
            raise ServiceUnavailableError(
                "AUTH_CONFIGURATION_MISSING", "Authentication verification is not configured."
            )
        try:
            signing_key = self._jwks_client.get_signing_key_from_jwt(access_token)
            claims = jwt.decode(
                access_token,
                signing_key.key,
                algorithms=[signing_key.algorithm_name],
                audience=self._settings.supabase_jwt_audience,
                issuer=self._settings.supabase_jwt_issuer,
                options={"require": ["exp", "sub", "iss", "aud"]},
            )
            return AuthenticatedUser(id=UUID(str(claims["sub"])))
        except (jwt.PyJWTError, ValueError, KeyError) as error:
            raise AuthenticationError("INVALID_ACCESS_TOKEN", "Your session is invalid or has expired.") from error

    def _verify_with_user_endpoint(self, access_token: str) -> AuthenticatedUser:
        if not self._settings.supabase_url or not self._settings.supabase_publishable_key:
            raise ServiceUnavailableError(
                "AUTH_CONFIGURATION_MISSING", "Authentication verification is not configured."
            )
        client = self._http_client or httpx.Client(timeout=10.0)
        close_client = self._http_client is None
        try:
            response = client.get(
                f"{self._settings.supabase_url.rstrip('/')}/auth/v1/user",
                headers={
                    "apikey": self._settings.supabase_publishable_key,
                    "Authorization": f"Bearer {access_token}",
                },
            )
            if response.status_code != 200:
                raise AuthenticationError("INVALID_ACCESS_TOKEN", "Your session is invalid or has expired.")
            return AuthenticatedUser(id=UUID(str(response.json()["id"])))
        except httpx.HTTPError as error:
            raise ServiceUnavailableError(
                "AUTH_VERIFICATION_UNAVAILABLE",
                "Authentication verification is temporarily unavailable.",
            ) from error
        except (ValueError, KeyError) as error:
            raise AuthenticationError("INVALID_ACCESS_TOKEN", "Your session is invalid or has expired.") from error
        finally:
            if close_client:
                client.close()
