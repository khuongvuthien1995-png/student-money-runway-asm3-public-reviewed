"""
@file api/index.py
@project Student Money Runway — BUS4012 Assignment 03
@student Thien Khuong Vu
@phase P2 — FastAPI Backend Skeleton and Authentication
@createdAt 2026-10-12T02:22:38+11:00
@updatedAt 2026-10-12T02:22:38+11:00
@summary Exposes the FastAPI ASGI application for local and Vercel execution.
@responsibility Owns only the deployment entrypoint.
"""

from backend.app.main import app

__all__ = ["app"]
