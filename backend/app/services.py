"""
@file backend/app/services.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:30:00+11:00
@summary Converts the P1 database contract into typed plan and purchase application operations.
@responsibility Owns derived financial responses and maps RPC outcomes without owning HTTP transport.
@hardening C3 (2026-10-13): fails closed on invalid/foreign rows and exact RPC outcomes.
"""

from typing import Any
from uuid import UUID

from .errors import ConflictError, NotFoundError, RepositoryError, ServiceUnavailableError
from .models import (
    PlanResponse,
    PlanUpsertRequest,
    PurchaseConfirmationEnvelope,
    PurchaseConfirmationRequest,
    PurchaseResponse,
)
from .repository import FinancialRepository


def plan_response(row: dict[str, Any]) -> PlanResponse:
    sources = PlanUpsertRequest(
        planningDate=row["planning_date"],
        availableFundsCents=row["available_funds_cents"],
        safetyBufferCents=row["safety_buffer_cents"],
        fixedEssentialsCents=row["fixed_essentials_cents"],
        flexibleEssentialsCents=row["flexible_essentials_cents"],
    )
    protected_total = (
        sources.fixedEssentialsCents
        + sources.flexibleEssentialsCents
        + sources.safetyBufferCents
    )
    runway = max(0, sources.availableFundsCents - protected_total)
    shortfall = max(0, protected_total - sources.availableFundsCents)
    return PlanResponse(
        id=row["id"],
        userId=row["user_id"],
        planningDate=row["planning_date"],
        availableFundsCents=row["available_funds_cents"],
        safetyBufferCents=row["safety_buffer_cents"],
        fixedEssentialsCents=row["fixed_essentials_cents"],
        flexibleEssentialsCents=row["flexible_essentials_cents"],
        protectedTotalCents=protected_total,
        runwayCents=runway,
        shortfallCents=shortfall,
        createdAt=row["created_at"],
        updatedAt=row["updated_at"],
    )


def purchase_response(row: dict[str, Any]) -> PurchaseResponse:
    return PurchaseResponse(
        id=row["id"],
        planId=row["plan_id"],
        userId=row["user_id"],
        name=row["name"],
        amountCents=row["amount_cents"],
        createdAt=row["created_at"],
    )


def owned_plan_response(row: dict[str, Any], user_id: UUID) -> PlanResponse:
    plan = plan_response(row)
    if plan.userId != user_id:
        raise ValueError("Repository returned a plan for another owner.")
    return plan


def invalid_database_response() -> ServiceUnavailableError:
    return ServiceUnavailableError(
        "DATABASE_RESPONSE_INVALID", "The financial service returned invalid data. Please retry safely."
    )


class PlanService:
    def __init__(self, repository: FinancialRepository) -> None:
        self._repository = repository

    def get_current(self, user_id: UUID) -> PlanResponse:
        try:
            row = self._repository.get_current_plan(user_id)
        except RepositoryError as error:
            raise ServiceUnavailableError(
                "DATABASE_OPERATION_FAILED", "The financial plan could not be retrieved. Please retry."
            ) from error
        if row is None:
            raise NotFoundError("PLAN_NOT_FOUND", "No saved financial plan exists for this user.")
        try:
            return owned_plan_response(row, user_id)
        except (ValueError, TypeError, KeyError) as error:
            raise invalid_database_response() from error

    def save_current(self, user_id: UUID, request: PlanUpsertRequest) -> PlanResponse:
        try:
            row = self._repository.upsert_current_plan(
                user_id,
                {
                    "planning_date": request.planningDate.isoformat(),
                    "available_funds_cents": request.availableFundsCents,
                    "safety_buffer_cents": request.safetyBufferCents,
                    "fixed_essentials_cents": request.fixedEssentialsCents,
                    "flexible_essentials_cents": request.flexibleEssentialsCents,
                },
            )
        except RepositoryError as error:
            raise ServiceUnavailableError(
                "DATABASE_OPERATION_FAILED", "The financial plan could not be saved. Please retry."
            ) from error
        try:
            return owned_plan_response(row, user_id)
        except (ValueError, TypeError, KeyError) as error:
            raise invalid_database_response() from error

    def list_purchases(self, user_id: UUID) -> list[PurchaseResponse]:
        plan = self.get_current(user_id)
        try:
            rows = self._repository.list_purchases(user_id, plan.id)
        except RepositoryError as error:
            raise ServiceUnavailableError(
                "DATABASE_OPERATION_FAILED", "Purchase history could not be retrieved. Please retry."
            ) from error
        try:
            purchases = [purchase_response(row) for row in rows]
            if any(purchase.userId != user_id or purchase.planId != plan.id for purchase in purchases):
                raise ValueError("Repository returned purchase history for another owner or plan.")
            return purchases
        except (ValueError, TypeError, KeyError) as error:
            raise invalid_database_response() from error


class PurchaseService:
    def __init__(self, repository: FinancialRepository) -> None:
        self._repository = repository

    def confirm(
        self, user_id: UUID, request: PurchaseConfirmationRequest
    ) -> PurchaseConfirmationEnvelope:
        name = request.name.strip()
        if not name:
            raise ConflictError("PURCHASE_NAME_INVALID", "Enter a purchase name.")
        try:
            row = self._repository.confirm_purchase(
                user_id, name, request.amountCents, request.idempotencyKey
            )
        except RepositoryError as error:
            raise self._map_rpc_error(error) from error

        try:
            return self._confirmation_response(row, user_id, name, request.amountCents)
        except (ValueError, TypeError, KeyError) as error:
            # The RPC may already have committed: return 503 and preserve the caller's replay key.
            raise invalid_database_response() from error

    @staticmethod
    def _confirmation_response(
        row: dict[str, Any], user_id: UUID, name: str, amount_cents: int
    ) -> PurchaseConfirmationEnvelope:
        purchase = PurchaseResponse(
            id=row["purchase_id"],
            planId=row["plan_id"],
            userId=row["plan_user_id"],
            name=row["purchase_name"],
            amountCents=row["purchase_amount_cents"],
            createdAt=row["purchase_created_at"],
        )
        plan = owned_plan_response(
            {
                "id": row["plan_id"],
                "user_id": row["plan_user_id"],
                "planning_date": row["planning_date"],
                "available_funds_cents": row["available_funds_cents"],
                "safety_buffer_cents": row["safety_buffer_cents"],
                "fixed_essentials_cents": row["fixed_essentials_cents"],
                "flexible_essentials_cents": row["flexible_essentials_cents"],
                "created_at": row["plan_created_at"],
                "updated_at": row["plan_updated_at"],
            },
            user_id,
        )
        if (purchase.userId != user_id or purchase.planId != plan.id
                or purchase.name != name or purchase.amountCents != amount_cents):
            raise ValueError("RPC returned an unrelated purchase.")
        return PurchaseConfirmationEnvelope(purchase=purchase, plan=plan, replayed=row["replayed"])

    @staticmethod
    def _map_rpc_error(error: RepositoryError) -> ServiceUnavailableError | ConflictError | NotFoundError:
        message = error.business_code or str(error)
        if message == "PLAN_NOT_FOUND":
            return NotFoundError("PLAN_NOT_FOUND", "No saved financial plan exists for this user.")
        if message == "PURCHASE_EXCEEDS_RUNWAY":
            return ConflictError(
                "PURCHASE_EXCEEDS_RUNWAY", "This purchase exceeds the current discretionary runway."
            )
        if message == "IDEMPOTENCY_KEY_REUSED":
            return ConflictError(
                "IDEMPOTENCY_KEY_REUSED", "This confirmation key belongs to a different request."
            )
        if message in {"PURCHASE_NAME_INVALID", "PURCHASE_AMOUNT_INVALID"}:
            return ConflictError("PURCHASE_INVALID", "The purchase request is invalid.")
        if message in {"PLAN_OWNERSHIP_MISMATCH", "AUTHENTICATED_USER_REQUIRED"}:
            return ConflictError("PURCHASE_NOT_AUTHORIZED", "The purchase cannot be confirmed for this plan.")
        return ServiceUnavailableError(
            "DATABASE_OPERATION_FAILED", "The purchase could not be confirmed. Please retry safely."
        )
