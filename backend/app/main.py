"""
@file backend/app/main.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:30:00+11:00
@summary Configures the authenticated FastAPI API and its typed plan/purchase routes.
@responsibility Owns HTTP routing, dependency wiring and safe error serialization.
"""

from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import Settings
from .errors import ApplicationError, AuthenticationError
from .models import (
    AuthenticatedUser,
    ErrorBody,
    ErrorResponse,
    HealthResponse,
    PlanEnvelope,
    PlanUpsertRequest,
    PurchaseConfirmationEnvelope,
    PurchaseConfirmationRequest,
    PurchasesEnvelope,
)
from .repository import FinancialRepository, SupabaseRepository, UnavailableRepository
from .security import SupabaseTokenVerifier, TokenVerifier
from .services import PlanService, PurchaseService


@dataclass
class ApplicationContainer:
    repository: FinancialRepository
    token_verifier: TokenVerifier


bearer_scheme = HTTPBearer(auto_error=False)


def get_container(request: Request) -> ApplicationContainer:
    return request.app.state.container


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    container: Annotated[ApplicationContainer, Depends(get_container)],
) -> AuthenticatedUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise AuthenticationError()
    return container.token_verifier.verify(credentials.credentials)


def get_plan_service(
    container: Annotated[ApplicationContainer, Depends(get_container)],
) -> PlanService:
    return PlanService(container.repository)


def get_purchase_service(
    container: Annotated[ApplicationContainer, Depends(get_container)],
) -> PurchaseService:
    return PurchaseService(container.repository)


def create_app(
    settings: Settings | None = None,
    repository: FinancialRepository | None = None,
    token_verifier: TokenVerifier | None = None,
) -> FastAPI:
    resolved_settings = settings or Settings.from_environment()
    resolved_repository = repository
    if resolved_repository is None:
        resolved_repository = (
            SupabaseRepository(resolved_settings)
            if resolved_settings.database_configured
            else UnavailableRepository()
        )
    app = FastAPI(title="Student Money Runway API", version="0.1.0")
    app.state.container = ApplicationContainer(
        repository=resolved_repository,
        token_verifier=token_verifier or SupabaseTokenVerifier(resolved_settings),
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[resolved_settings.allowed_origin],
        allow_credentials=False,
        allow_methods=["GET", "PUT", "POST"],
        allow_headers=["Authorization", "Content-Type"],
    )

    @app.exception_handler(ApplicationError)
    def application_error_handler(_: Request, error: ApplicationError) -> JSONResponse:
        return JSONResponse(
            status_code=error.status_code,
            content=ErrorResponse(error=ErrorBody(code=error.code, message=error.message)).model_dump(),
        )

    @app.exception_handler(RequestValidationError)
    def request_validation_error_handler(_: Request, __: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                error=ErrorBody(code="INVALID_REQUEST", message="The request data is invalid.")
            ).model_dump(),
        )

    @app.get("/api/health", response_model=HealthResponse, tags=["health"])
    def health() -> HealthResponse:
        return HealthResponse(status="ok")

    @app.get(
        "/api/plans/current",
        response_model=PlanEnvelope,
        responses={401: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
        tags=["plans"],
    )
    def get_current_plan(
        user: Annotated[AuthenticatedUser, Depends(get_current_user)],
        service: Annotated[PlanService, Depends(get_plan_service)],
    ) -> PlanEnvelope:
        return PlanEnvelope(plan=service.get_current(user.id))

    @app.put(
        "/api/plans/current",
        response_model=PlanEnvelope,
        responses={401: {"model": ErrorResponse}, 422: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
        tags=["plans"],
    )
    def save_current_plan(
        payload: PlanUpsertRequest,
        user: Annotated[AuthenticatedUser, Depends(get_current_user)],
        service: Annotated[PlanService, Depends(get_plan_service)],
    ) -> PlanEnvelope:
        return PlanEnvelope(plan=service.save_current(user.id, payload))

    @app.get(
        "/api/plans/current/purchases",
        response_model=PurchasesEnvelope,
        responses={401: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
        tags=["purchases"],
    )
    def get_purchases(
        user: Annotated[AuthenticatedUser, Depends(get_current_user)],
        service: Annotated[PlanService, Depends(get_plan_service)],
    ) -> PurchasesEnvelope:
        return PurchasesEnvelope(purchases=service.list_purchases(user.id))

    @app.post(
        "/api/plans/current/purchases",
        response_model=PurchaseConfirmationEnvelope,
        responses={401: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 409: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
        tags=["purchases"],
    )
    def confirm_purchase(
        payload: PurchaseConfirmationRequest,
        response: Response,
        user: Annotated[AuthenticatedUser, Depends(get_current_user)],
        service: Annotated[PurchaseService, Depends(get_purchase_service)],
    ) -> PurchaseConfirmationEnvelope:
        result = service.confirm(user.id, payload)
        response.status_code = 200 if result.replayed else 201
        return result

    return app


app = create_app()
