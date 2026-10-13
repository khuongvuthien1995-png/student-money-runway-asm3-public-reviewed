"""
@file backend/app/errors.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:22:38+11:00
@summary Defines stable application errors for HTTP transport and services.
@responsibility Owns error codes and safe client-facing messages.
@hardening C3 (2026-10-13): carries exact RPC business codes independently of provider text.
"""


class ApplicationError(Exception):
    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message


class AuthenticationError(ApplicationError):
    def __init__(self, code: str = "UNAUTHENTICATED", message: str = "Authentication is required.") -> None:
        super().__init__(401, code, message)


class NotFoundError(ApplicationError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(404, code, message)


class ConflictError(ApplicationError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(409, code, message)


class ServiceUnavailableError(ApplicationError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(503, code, message)


class RepositoryError(Exception):
    """Represents a database transport or RPC error before service-level mapping."""

    def __init__(self, message: str, *, business_code: str | None = None) -> None:
        super().__init__(message)
        self.business_code = business_code
