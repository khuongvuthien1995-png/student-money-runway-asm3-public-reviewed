# ASM3 C0 — source freeze and contract map

> Verified: 2026-10-13 (Australia/Sydney)
> Baseline: `c0422f1fbc20e9da6fc0d3d1edec83d5482b0626`, branch `main`

The latest working repository is authoritative. No ZIP files were restored. Before implementation, the worktree was clean apart from importing the provided master plan into its requested documentation path; the index contained no staged changes. Origin is the configured `khuongvuthien1995-png/student-money-runway-asm3` repository. No remote request, login, push or deployment is part of C0/C1. Both populated environment files resolve as ignored. The initial migration's worktree SHA256 is `0303356445EFD8EE72666569902E3D483FE6A48CFBDD3E390CE86FE50F38D7EE`; it and the core financial helpers are preserved.

## Actual FastAPI contract

| Operation | Request / response |
|---|---|
| GET `/api/health` | `{status}`; public |
| GET `/api/plans/current` | `{plan}`; bearer; absent plan returns 404 `PLAN_NOT_FOUND` |
| PUT `/api/plans/current` | `planningDate`, four source cents fields → `{plan}` |
| GET `/api/plans/current/purchases` | `{purchases: PurchaseResponse[]}` |
| POST `/api/plans/current/purchases` | `name`, positive `amountCents`, caller's stable UUID `idempotencyKey` → `{purchase,plan,replayed}`; new purchase 201, replay 200 |

Actual authority: `backend/app/models.py`, `main.py`, `services.py`, `repository.py`, `security.py`. Plan sources are integer cents 0–100000000; purchase cents 1–100000000. Plan response adds UUID strings, derived protected/runway/shortfall cents and timestamps; purchases include own/plan IDs and timestamps. Errors use `{error:{code,message}}`, with 401/404/409/422/503. FastAPI derives the user from verified JWT; frontend requests supply no owner ID. The frontend DTOs and shared test fixtures are validated against these actual Pydantic models, not a new backend contract.

## Six-screen freeze

| Screen | Existing props / state boundary |
|---|---|
| Login | `onStartSession` |
| Setup / Essentials | `runwayState`, `onRunwayStateChange` |
| Runway | `runwayState`, `onStartNewPurchase` |
| Purchase | `runwayState`, `onRunwayStateChange`, `onStartNewPurchase` |
| Result | `runwayState`, `onConfirmPurchase`, `onStartNewPurchase` |

`App.tsx` retains raw string drafts and its existing ASM2 behavior until C2. No page, navigation design, existing financial helper or deployed migration is changed in C1. The entrypoint gains the real Auth provider; the tested route guard is available but not yet applied to the six-screen flow. C2 must wire login, protected routes, serverPlan/drafts, persistence and authoritative confirmation; it must remove the existing local-only confirmation path then. P1B is deployed; real P2B remains pending test-email confirmation. Offline Auth/API tests are separate from live acceptance.
