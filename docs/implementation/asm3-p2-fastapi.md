# ASM3 P2 — FastAPI Backend and Authentication Foundation

> Project: Student Money Runway — BUS4012 Assignment 03
> Student: Thien Khuong Vu
> Phase: P2 — FastAPI backend and authentication foundation
> Created: 2026-10-12T02:22:38+11:00
> Updated: 2026-10-12T03:56:29+11:00

## Scope

P2 adds a local FastAPI service and mock-backed backend tests. The subsequent approved P1B deployment applied the initial migration to `student-money-runway-asm3-dev` (`mnjmugwkjtihqswssiwa`) and passed hosted schema/security assertions. See [P1B/P2B live evidence](asm3-p2b-live-integration.md). Backend credentials and live Auth/API integration remain pending; React was not changed.

## Implemented contract

- ASGI entrypoint: `api/index.py`; API factory/routes: `backend/app/main.py`.
- Typed API paths: `GET /api/health`, `GET`/`PUT /api/plans/current`, `GET /api/plans/current/purchases`, `POST /api/plans/current/purchases`.
- Pydantic requests/responses use stable camel-case `*Cents` fields.
- `SupabaseRepository` uses a server-only service credential and calls P1 RPC `confirm_purchase` with `p_user_id`, `p_name`, `p_amount_cents`, and `p_idempotency_key` exactly.
- The backend maps P1 business messages including `PLAN_NOT_FOUND`, `PURCHASE_EXCEEDS_RUNWAY` and `IDEMPOTENCY_KEY_REUSED` without trusting a browser user ID.
- `SupabaseTokenVerifier` supports project-configured JWKS verification (issuer/audience/expiry/signature) and the legacy supported `/auth/v1/user` verification fallback. Authentication mode is configuration, not a hard-coded signing assumption.

## Security boundary

React will later send only a Supabase user bearer token. FastAPI verifies it and derives the UUID subject. The service credential remains only in backend configuration. Direct browser table writes remain blocked by P1 grants. The repository does not claim a real Supabase connection until `SUPABASE_URL` and `SUPABASE_SECRET_KEY` are securely configured and P1 is applied.

## Local verification

`backend/tests/test_api.py` runs with an in-memory repository and stub token verifier. It verifies health/OpenAPI availability, canonical cents calculations, one-deduction replay safety, excess rejection, missing-plan isolation and request validation with the API error envelope. These tests exercise API/service contracts only; they do not substitute for real P1 RLS/RPC/transaction tests.

Executed locally on 2026-10-12: `pytest backend/tests -q` passed (5 tests; one upstream Starlette deprecation warning), Python compilation passed, and a local Uvicorn smoke service returned `{"status":"ok"}` from `/api/health`. OpenAPI exposes the three planned paths: `/api/health`, `/api/plans/current`, and `/api/plans/current/purchases` (four HTTP operations because the latter supports GET and POST). `npm run lint` and `npm run build` also passed. A secret-pattern scan found no credential values.

## Remaining live integration checkpoints

1. Completed: approved initial migration applied and remote version `20261012020847` verified.
2. Completed: reviewed P1 schema assertions passed. Remaining: two-user isolation and real transaction/atomicity/concurrency tests.
3. Configure local backend variables through a user-controlled ignored environment file; never send values to chat.
4. Set actual Supabase Auth signing mode/issuer/JWKS or legacy verification details, then test valid, invalid and expired tokens.
5. Run live GET/PUT/RPC requests against development Supabase and map any provider error formatting differences before React integration.

On 2026-10-12 the requested regression checks passed again: 5 backend tests (one Starlette deprecation warning), lint and build. Presence-only inspection found backend environment variables absent. The hosted public JWKS endpoint returned HTTP 200 with one ES256 key; no real user token has been validated. Deployment verification stopped before additional features, as requested.
