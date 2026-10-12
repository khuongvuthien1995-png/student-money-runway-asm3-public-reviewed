"""
@file backend/app/models.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:31:42+11:00
@summary Defines typed HTTP models that match the P1 cents-based database contract.
@responsibility Owns request validation and response serialization contracts.
"""

from datetime import date, datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, Field, StrictInt


MAX_MONEY_CENTS = 100_000_000
PlanMoneyCents = Annotated[StrictInt, Field(ge=0, le=MAX_MONEY_CENTS)]
PurchaseMoneyCents = Annotated[StrictInt, Field(ge=1, le=MAX_MONEY_CENTS)]


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


class PlanResponse(BaseModel):
    id: UUID
    userId: UUID
    planningDate: date
    availableFundsCents: int
    safetyBufferCents: int
    fixedEssentialsCents: int
    flexibleEssentialsCents: int
    protectedTotalCents: int
    runwayCents: int
    shortfallCents: int
    createdAt: datetime
    updatedAt: datetime


class PlanEnvelope(BaseModel):
    plan: PlanResponse


class PurchaseResponse(BaseModel):
    id: UUID
    planId: UUID
    userId: UUID
    name: str
    amountCents: int
    createdAt: datetime


class PurchasesEnvelope(BaseModel):
    purchases: list[PurchaseResponse]


class PurchaseConfirmationRequest(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=120)]
    amountCents: PurchaseMoneyCents
    idempotencyKey: UUID


class PurchaseConfirmationEnvelope(BaseModel):
    purchase: PurchaseResponse
    plan: PlanResponse
    replayed: bool


class AuthenticatedUser(BaseModel):
    id: UUID
