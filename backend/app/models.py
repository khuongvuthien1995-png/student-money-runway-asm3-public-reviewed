"""
@file backend/app/models.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:31:42+11:00
@summary Defines typed HTTP models that match the P1 cents-based database contract.
@responsibility Owns request validation and response serialization contracts.
@hardening C3 (2026-10-13): strict financial responses, ISO dates and nonblank purchase names.
"""

import re
from datetime import date, datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field, StrictBool, StrictInt, field_validator


MAX_MONEY_CENTS = 100_000_000
PlanMoneyCents = Annotated[StrictInt, Field(ge=0, le=MAX_MONEY_CENTS)]
PurchaseMoneyCents = Annotated[StrictInt, Field(ge=1, le=MAX_MONEY_CENTS)]
# Three independently bounded protected amounts can legitimately total three times the source cap.
DerivedMoneyCents = Annotated[StrictInt, Field(ge=0, le=3 * MAX_MONEY_CENTS)]


class ErrorBody(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorBody


class HealthResponse(BaseModel):
    status: str


class PlanUpsertRequest(BaseModel):
    planningDate: date
    availableFundsCents: PlanMoneyCents
    safetyBufferCents: PlanMoneyCents
    fixedEssentialsCents: PlanMoneyCents
    flexibleEssentialsCents: PlanMoneyCents

    @field_validator("planningDate", mode="before")
    @classmethod
    def validate_planning_date(cls, value: object) -> date:
        if type(value) is date:
            return value
        if isinstance(value, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
            return date.fromisoformat(value)
        raise ValueError("Use a YYYY-MM-DD planning date.")


class PlanResponse(BaseModel):
    id: UUID
    userId: UUID
    planningDate: date
    availableFundsCents: PlanMoneyCents
    safetyBufferCents: PlanMoneyCents
    fixedEssentialsCents: PlanMoneyCents
    flexibleEssentialsCents: PlanMoneyCents
    protectedTotalCents: DerivedMoneyCents
    runwayCents: PlanMoneyCents
    shortfallCents: DerivedMoneyCents
    createdAt: datetime
    updatedAt: datetime


class PlanEnvelope(BaseModel):
    plan: PlanResponse


class PurchaseResponse(BaseModel):
    id: UUID
    planId: UUID
    userId: UUID
    name: Annotated[str, Field(min_length=1, max_length=120)]
    amountCents: PurchaseMoneyCents
    createdAt: datetime


class PurchasesEnvelope(BaseModel):
    purchases: list[PurchaseResponse]


class PurchaseConfirmationRequest(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=120)]
    amountCents: PurchaseMoneyCents
    idempotencyKey: UUID

    @field_validator("name")
    @classmethod
    def validate_name(cls, name: str) -> str:
        trimmed = name.strip()
        if not trimmed:
            raise ValueError("Purchase name must not be blank.")
        return trimmed


class PurchaseConfirmationEnvelope(BaseModel):
    purchase: PurchaseResponse
    plan: PlanResponse
    replayed: StrictBool


class AuthenticatedUser(BaseModel):
    id: UUID
