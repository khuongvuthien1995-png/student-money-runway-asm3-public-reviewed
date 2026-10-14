# Student Money Runway

A React and Python budgeting application developed by Thien Khuong Vu for BUS4012 Assignment 03, building on the Assignment 02 six-screen MVP. Students can protect essential costs and a safety buffer, see discretionary runway, preview a purchase, and explicitly record spending.

[Live Preview](https://student-money-runway-asm3-preview.vercel.app/login) | [GitHub source](https://github.com/khuongvuthien1995-png/student-money-runway-asm3-public-reviewed) | [Assessment manifest](docs/assessment/c7/ASM3_SUBMISSION_MANIFEST.md)

## 1. Assignment context and current status

The official six-page `BUS4012-AS03.pdf` has now been inspected locally. It requires React, Python, Supabase persistence, a five-minute individual demonstration, prompt evidence, and three separate peer reviews. The brief permits either private or public GitHub visibility. Copyrighted course PDFs are not redistributed here.

C1-C5 local code/QA checks are complete. The public Vercel **Preview** serves the React app and Python health endpoint; unauthenticated financial requests are rejected. A permitted organization-member account's email confirmation is corroborated. At least one fresh password grant is corroborated by structured server logs (HTTP 200). The complete two-login browser/reload/history workflow remains pending independent observation; user-reported sign-ins alone are not a verified full live workflow. No Production release is claimed.

This repository contains the reviewed sanitized source and development history, published separately from the original private repository. Known unapproved peer identifiers were removed before upload; original academic records and the old-to-new commit mapping remain private. The original repository remains private because old GitHub objects are still retained there. Public availability and clean-clone results are verified separately during release; they do not establish hosted financial acceptance. No open-source license has been selected. See [source provenance](docs/assessment/c7/ASM3_SANITIZED_SOURCE_STATUS.md); older publication audits describe the original history before remediation.

## 2. Problem, users and MVP boundaries

The target user is a student making short-horizon spending decisions. The application works with a user-entered financial snapshot, not a bank account or financial-advice service. It does not implement bank synchronization, recurring budgets, payment processing, an administrator dashboard or a general ledger.

Implemented source supports password Auth, protected routes, editable plan drafts, saved-plan retrieval/update, exact-cent runway calculations, purchase preview, explicit idempotent purchase confirmation, history and logout. Production modules call real providers; offline test doubles do not create successful production responses.

## 3. Technology stack

| Layer | Actual technology |
|---|---|
| Frontend | React 19, TypeScript 6, Vite 8, React Router 6, Tailwind CSS 3, Framer Motion |
| Backend | Python 3.12, FastAPI, Pydantic, PyJWT/cryptography, Uvicorn, Supabase Python SDK |
| Database/Auth | Supabase PostgreSQL, Supabase Auth, JWKS signature verification |
| QA | Vitest, React Testing Library, pytest, Playwright/Chromium, ESLint, route/security checkers |
| Deployment | Vercel Vite output plus `api/index.py` Python function; Node 24.x |

The committed npm lockfiles and Python pins define installed versions. See dependency advisory triage in the [technical audit](docs/assessment/c7/ASM3_FINAL_TECHNICAL_RELEASE_AUDIT.md); the project does not claim zero known vulnerabilities.

## 4. Architecture and data flow

```text
React + TypeScript -- Supabase SDK --> Supabase Auth
       |
       | /api requests with current user Bearer JWT
       v
FastAPI / Python -- server-only Supabase SDK --> PostgreSQL
       |                                           |
       +-- JWT verification, ownership, validation  +-- constrained tables,
                                                       atomic purchase RPC
```

React uses Supabase directly for **Auth only**. All financial operations pass through FastAPI. The verified token subject supplies ownership; request bodies do not supply a trusted user ID. The backend's private database credential bypasses RLS, so services also validate ownership and response consistency. Browser roles cannot directly access the financial tables or restricted RPC in the reviewed migration.

## 5. Repository structure

```text
src/                         Six pages, Auth, typed API clients, state, shared UI
public/                      Runtime SVG assets
api/index.py                 Vercel/ASGI entrypoint
backend/app/                 Config, JWT checks, models, routes, services, repository
backend/tests/               Offline tests and separately opted-in live tests
backend/dev.py               Guarded launcher for the original development project
supabase/migrations/         Versioned schema, constraints, RLS and purchase RPC
supabase/tests/              Schema assertions and transaction verification procedure
tests/                       Browser entrypoints, deployment/proxy tests and fixtures
tools/                       HTTP, deployment, bundle/history checks and demo utilities
docs/implementation/         Phase-specific technical evidence
docs/assessment/c7/          Scripts, prompt evidence, peer templates and readiness audits
requirements*.txt            Pinned Python runtime/development dependencies
vercel.json                  API-first and explicit six-route SPA rewrites
.env.example                 Safe blank configuration template
```

Original ASM1/Figma design exports are reference material, not runtime resources. The frontend entrypoint is `src/main.tsx`; the deployed Python app is exported by `api/index.py`. Generated dependencies, builds, populated environments and local CLI linkage are excluded.

## 6. Windows prerequisites

Install Git, Node.js **24.x** with npm, and Python **3.12** with the Windows `py` launcher. PowerShell commands below run from the repository root. The public source can be cloned without GitHub credentials. Never embed a token in a clone URL.

## 7. Clone and install

```powershell
git clone https://github.com/khuongvuthien1995-png/student-money-runway-asm3-public-reviewed.git
cd student-money-runway-asm3-public-reviewed
npm ci
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt -c requirements-lock.txt
```

Runtime installation alone does not install pytest. Use the second Python installation command for development tests. Never copy another machine's virtual environment or node_modules.

## 8. Offline verification without cloud credentials

A clean install can lint, build and run offline tests without populated environment files:

```powershell
npm test
npm run lint
npm run build
.\.venv\Scripts\python.exe -m pytest backend/tests -q
.\.venv\Scripts\python.exe -m compileall -q backend api
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe tools/check-client-bundle.py
.\.venv\Scripts\python.exe tools/check-repository-secrets.py
```

Keep `RUN_SUPABASE_LIVE_TESTS` unset or `0`. Two hosted tests are deliberately skipped; skips are not live passes. Local JWT tests generate keys, repository tests use transport doubles, and App tests use test-only Auth/API adapters.

## 9. Private environment configuration

`.env.example` is a **template**, with no usable private credentials. Create an ignored local copy only if it does not already exist:

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Supply your own authorized Supabase configuration privately in an editor. Do not request or reuse the author's server credential.

| Supported names | Scope |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Public browser Auth configuration; new `sb_publishable_` key required by the current client; embedded at build time |
| `VITE_API_BASE_URL` | Leave blank for same-origin `/api`; external override must be HTTPS |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Private backend runtime configuration; secret/service-role credential never uses `VITE_` |
| `SUPABASE_JWKS_URL`, `SUPABASE_JWT_ISSUER` | Optional; derive from backend URL when blank/omitted |
| `SUPABASE_AUTH_VERIFICATION_MODE`, `SUPABASE_JWT_AUDIENCE` | `jwks` and `authenticated` for the supported normal flow |
| `ALLOWED_ORIGIN` | Exact frontend origin; normally `http://localhost:5173` locally |
| `SUPABASE_PUBLISHABLE_KEY` | Public Auth value used by inspection/signup helpers; financial JWKS verification does not require it |
| `TEST_USER_A_EMAIL`, `TEST_USER_A_PASSWORD`, `TEST_USER_B_EMAIL`, `TEST_USER_B_PASSWORD` | Dedicated ignored `.env.live-tests.local` only; never frontend build variables |

CLI authentication is separate from application configuration. Production reads runtime environment; it never loads local dotenv files. Do not share populated files, JWTs, password forms or SMTP credentials in commits/screenshots/videos.

## 10. Your own Supabase project and migration policy

For a **new, empty project you control**, inspect `supabase/config.toml`, the migration, and [schema documentation](supabase/tests/README.md). Configure the project's Auth/JWKS and public application key. With project-owner authorization:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_OWN_PROJECT_REF
npx supabase migration list --project-ref YOUR_OWN_PROJECT_REF
npx supabase db push --linked --skip-vault --dry-run
# Only after reviewing the exact dry-run and approving that NEW target:
npx supabase db push --linked --skip-vault
```

Replace the uppercase placeholder with your own reference. These commands are **not** routine clone tests and were not executed on a new target during this release task. Never reset hosted data. Never reapply or edit the already deployed initial migration on the author's project. Future schema changes require a new reviewed migration.

Set Auth Site URL and permitted confirmation redirects for your actual app origin. Keep email confirmation enabled. The current built-in sender supports permitted organization-member recipients and is rate-limited; unrestricted nonmember signup is **not established**. Custom SMTP remains paused. Do not add organization members merely to bypass email policy.

## 11. Start the application in two terminals

Terminal 1:

```powershell
npm run dev
```

Open `http://localhost:5173`. Vite's **development-only** proxy forwards `/api` to `127.0.0.1:8000`.

Terminal 2, using your own privately configured project:

```powershell
.\.venv\Scripts\python.exe -m uvicorn api.index:app --env-file .env.local --host 127.0.0.1 --port 8000 --no-access-log
```

This Uvicorn path supports settings from your `.env.local` and does not use the original-project guard. Set the backend/public URLs consistently and leave optional JWKS overrides blank to derive them. Existing process environment takes precedence for Uvicorn's env-file loading; remove stale conflicting variables privately.

For the **original approved development project only**, the preserved guarded launcher is also supported:

```powershell
.\.venv\Scripts\python.exe -m backend.dev --check
.\.venv\Scripts\python.exe -m backend.dev
```

Do not weaken that helper's target guard to run live fixtures elsewhere. Check public health and local OpenAPI:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

Open `http://127.0.0.1:8000/docs`. Without credentials, omit `--env-file` for routing-only health/401 smoke tests; health success does not mean Auth/database setup is complete.

## 12. Six-screen user flow

| Route | Action |
|---|---|
| `/login` | Real password login/signup; confirmation feedback; restored session bootstrap |
| `/setup` | First-time empty draft or edit saved plan; available funds/date/buffer; no save yet |
| `/essentials` | Fixed/flexible essentials; validated five-field authenticated PUT; accept server plan |
| `/runway` | Authoritative protected total, runway/shortfall, edit/purchase navigation, explicit history GET |
| `/purchase` | Draft trimmed purchase name and exact amount; generate/reuse stable proposal identity |
| `/result` | Read-only preview, then explicit POST on Mark as spent; authoritative success or safe retry |

Only `404 PLAN_NOT_FOUND` selects the first-time setup flow. Network/503 errors remain retryable failures. Logout clears private state. Session restoration holds protected content; account switches discard prior in-flight results.

## 13. API reference

All financial routes require `Authorization: Bearer <user access token>`. Never paste a real token into documentation.

| Method and route | Request / response |
|---|---|
| GET `/api/health` | Public 200 `{status: "ok"}` |
| GET `/api/plans/current` | 200 `{plan}`; 404 `PLAN_NOT_FOUND` |
| PUT `/api/plans/current` | `planningDate` (`YYYY-MM-DD`), `availableFundsCents`, `safetyBufferCents`, `fixedEssentialsCents`, `flexibleEssentialsCents`; 200 `{plan}` |
| GET `/api/plans/current/purchases` | 200 `{purchases: [...]}` scoped to current user/plan |
| POST `/api/plans/current/purchases` | `name`, `amountCents`, `idempotencyKey` (UUID); 201 new or 200 replay `{purchase, plan, replayed}` |

Plan fields additionally include `id`, `userId`, derived `protectedTotalCents`, `runwayCents`, `shortfallCents`, `createdAt` and `updatedAt`. Purchase fields include `id`, `planId`, `userId`, `name`, `amountCents`, `createdAt`. Unknown request owner fields cannot control ownership.

Source amounts are exact integers 0-100000000 cents; purchases are 1-100000000. Names are trimmed, nonblank and at most 120 characters. Errors use `{error: {code, message}}`: 401 invalid/missing session, 404 absent plan, 409 financial/idempotency conflict, 422 invalid input, 503 unavailable provider/database or invalid provider response. Unknown API paths return JSON 404, not the SPA. API responses use private/no-store cache controls.

## 14. Financial example and purchase safety

| Amount | AUD |
|---|---:|
| Available funds | 950 |
| Fixed essentials | 455 |
| Flexible essentials | 180 |
| Safety buffer | 100 |
| Protected total | 735 |
| Discretionary runway | 215 |
| Example purchase | 160 |
| Funds after successful confirmation | 790 |
| Runway after successful confirmation | 55 |

`protected = fixed + flexible + buffer`; `runway = max(0, available - protected)`; `shortfall = max(0, protected - available)`. AUD input is parsed without floating-point rounding. These are controlled examples, not permission to overwrite personal records.

Preview sends no financial mutation. Confirmation delegates to one database RPC and accepts the returned plan; it never subtracts locally. The immutable UUID/payload is reused after an uncertain response. Changed-payload replay is a conflict, not a reason to generate a new key automatically.

Drafts and proposals live in memory. After a full reload, an uncertain proposal/key is lost: inspect actual history before starting a new expense. Refreshing funds alone does not prove whether a purchase committed. Hosted concurrency/rollback acceptance remains pending.

## 15. Browser, HTTP and deployment checks

```powershell
npm ci --prefix tools/demo-recorder
node tools/demo-recorder/node_modules/playwright/cli.js install chromium
node tools/demo-recorder/verify-c4-integration.mjs
.\.venv\Scripts\python.exe tools/verify-local-http.py
.\.venv\Scripts\python.exe tools/verify-deployment.py
.\.venv\Scripts\python.exe tools/audit-public-history.py
```

C4 uses the actual App with **test-only** Auth and intercepted API responses at 390/768/1024/1280px; it is not live Supabase footage. Ports 5193 (C4), 8000/5194 (HTTP) and 8000/5195 (deployment routing) must be free. Run HTTP and deployment checks sequentially. Their runners stop their own processes.

The history gate intentionally exits nonzero while historical peer privacy issues remain; redacting HEAD is insufficient. No scanner universally proves secrets are absent. Review raster/video content and distribution rights separately.

## 16. Opt-in hosted tests

Read [the live-test runbook](backend/tests/integration/README.md). The guarded suite targets the original development project and needs two dedicated, controlled, confirmed accounts with **no existing financial rows**. It writes fixtures and cleans captured test plan IDs; explicit authorization is required. Never point it at the preserved personal account.

```powershell
$env:RUN_SUPABASE_LIVE_TESTS = '1'
try {
    .\.venv\Scripts\python.exe -m pytest backend/tests/integration -v -x --tb=no
} finally {
    Remove-Item Env:RUN_SUPABASE_LIVE_TESTS -ErrorAction SilentlyContinue
}
```

Do not execute this block merely to install/run a clone. The dedicated accounts remain unconfirmed, and two-user live isolation is PENDING. Avoid `--showlocals`, raw HTTP traces and credential-bearing logs.

## 17. Deployment overview

`vercel.json` builds Vite output and routes `/api` to the existing Python function before SPA paths. `.python-version` selects Python 3.12. `.vercelignore` excludes populated environments, tests, academic evidence and local configuration from uploads.

Preview variables are scoped separately: public Vite variables at build time; server credentials and exact `ALLOWED_ORIGIN` at runtime. The public alias is a **Preview**, not Production. No new deployment or Production promotion is part of this documentation/privacy task. Supabase confirmation URL settings match the approved Preview origin and `/login` redirect.

## 18. Troubleshooting

- **Private repository / clone denied:** request authorized access while privacy remediation is pending; do not put credentials in URLs.
- **Auth configuration error:** provide the correct public HTTPS Supabase URL and publishable key, then rebuild/restart Vite.
- **Confirmation email absent:** built-in recipient policy and quota can apply; do not disable confirmation or repeatedly resend. SMTP changes require approval.
- **Backend helper rejects a different project:** use the documented Uvicorn env-file command for your own project; do not change the live-test guard.
- **Health works but plan fails:** verify backend URL/server credential, JWKS/issuer and actual user bearer privately. Health is only liveness.
- **503:** preserve drafts and retry safely; do not interpret it as a new empty plan or authenticated purchase success.
- **Port occupied:** stop only the process you own or choose a supported development port; coordinate QA ports.
- **Purchase timeout:** retain the same proposal/key and retry identically before reloading; reconcile history if the proposal is lost.
- **Build chunk warning:** currently non-failing. Dependency advisories and the existing test-client warning are documented, not suppressed.

## 19. Assessment, reviewer access and known gaps

The [official marking audit](docs/assessment/c7/ASM3_FINAL_MARKING_AUDIT.md), [course traceability](docs/assessment/c7/ASM3_COURSE_KNOWLEDGE_TRACEABILITY.md), [peer access guide](docs/assessment/c7/ASM3_PEER_ACCESS_GUIDE.md) and [submission manifest](docs/assessment/c7/ASM3_SUBMISSION_MANIFEST.md) separate local, live, user-reported and pending evidence.

The complete narrated individual video and three genuine peer reviews remain outstanding. The brief does not require peer database or source access. Prefer a supervised review or an approved disposable account shared privately; do not disclose the personal main account. Public source is a user goal, not a prerequisite imposed by Part B.

## 20. Authorship, credits and AI-assisted development

Student/project author: **Thien Khuong Vu**. Existing ASM1/Figma design references and ASM2 provenance are preserved. The adapted status button retains its original third-party attribution; no project-wide open-source license is implied by source visibility.

Development used structured prompts, source inspection, focused fixes and regression tests. The [Prompt Document](docs/assessment/c7/ASM3_PROMPT_DOCUMENT.md) preserves available original prompt text and labels reconstructed descriptions. It is not presented as a complete historical chat export. No invented commits, peer findings, live transactions or finished video are claimed.
