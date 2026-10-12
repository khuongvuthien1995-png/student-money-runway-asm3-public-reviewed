"""
@file backend/app/repository.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:22:38+11:00
@summary Provides the server-only Supabase persistence boundary matching the P1 migration.
@responsibility Owns service-role database transport while callers enforce verified-user ownership.
"""

from typing import Any, Protocol
from uuid import UUID

from supabase import Client, create_client

from .config import Settings
from .errors import RepositoryError, ServiceUnavailableError


class FinancialRepository(Protocol):
    def get_current_plan(self, user_id: UUID) -> dict[str, Any] | None: ...

    def upsert_current_plan(self, user_id: UUID, values: dict[str, Any]) -> dict[str, Any]: ...

    def list_purchases(self, user_id: UUID, plan_id: UUID) -> list[dict[str, Any]]: ...

    def confirm_purchase(
        self, user_id: UUID, name: str, amount_cents: int, idempotency_key: UUID
    ) -> dict[str, Any]: ...


class UnavailableRepository:
    def _raise(self) -> None:
        raise ServiceUnavailableError(
            "DATABASE_CONFIGURATION_MISSING", "Database integration is not configured."
        )

    def get_current_plan(self, user_id: UUID) -> dict[str, Any] | None:
        self._raise()

    def upsert_current_plan(self, user_id: UUID, values: dict[str, Any]) -> dict[str, Any]:
        self._raise()

    def list_purchases(self, user_id: UUID, plan_id: UUID) -> list[dict[str, Any]]:
        self._raise()

    def confirm_purchase(
        self, user_id: UUID, name: str, amount_cents: int, idempotency_key: UUID
    ) -> dict[str, Any]:
        self._raise()


class SupabaseRepository:
    def __init__(self, settings: Settings, client: Client | None = None) -> None:
        if not settings.database_configured:
            raise ServiceUnavailableError(
                "DATABASE_CONFIGURATION_MISSING", "Database integration is not configured."
            )
        self._client = client or create_client(settings.supabase_url or "", settings.supabase_secret_key or "")

    def get_current_plan(self, user_id: UUID) -> dict[str, Any] | None:
        try:
            result = self._client.table("plans").select("*").eq("user_id", str(user_id)).maybe_single().execute()
            return result.data
        except Exception as error:
            raise RepositoryError(str(error)) from error

    def upsert_current_plan(self, user_id: UUID, values: dict[str, Any]) -> dict[str, Any]:
        payload = {"user_id": str(user_id), **values}
        try:
            result = self._client.table("plans").upsert(payload, on_conflict="user_id").execute()
            if not result.data:
                raise RepositoryError("PLAN_WRITE_RETURNED_NO_DATA")
            return result.data[0]
        except RepositoryError:
            raise
        except Exception as error:
            raise RepositoryError(str(error)) from error

    def list_purchases(self, user_id: UUID, plan_id: UUID) -> list[dict[str, Any]]:
        try:
            result = (
                self._client.table("purchases")
                .select("*")
                .eq("user_id", str(user_id))
                .eq("plan_id", str(plan_id))
                .order("created_at", desc=True)
                .execute()
            )
            return result.data or []
        except Exception as error:
            raise RepositoryError(str(error)) from error

    def confirm_purchase(
        self, user_id: UUID, name: str, amount_cents: int, idempotency_key: UUID
    ) -> dict[str, Any]:
        try:
            result = self._client.rpc(
                "confirm_purchase",
                {
                    "p_user_id": str(user_id),
                    "p_name": name,
                    "p_amount_cents": amount_cents,
                    "p_idempotency_key": str(idempotency_key),
                },
            ).execute()
            if not result.data:
                raise RepositoryError("PURCHASE_CONFIRMATION_RETURNED_NO_DATA")
            return result.data[0]
        except RepositoryError:
            raise
        except Exception as error:
            raise RepositoryError(str(error)) from error
