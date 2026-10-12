# Student Money Runway — BUS4012 Assignment 03

A student budgeting application for planning a short financial horizon, protecting essential costs and a safety buffer, and checking a purchase against discretionary runway. The existing six-screen React application originates from ASM2; ASM3 adds FastAPI and a hosted Supabase schema.

## Current status and architecture

The frontend is frozen and still uses its current React session. Its login screen is a demonstration; it is not connected to real Supabase sign-in. The backend and hosted schema exist separately. P2B live integration is pending test-account email confirmation; P3 frontend/backend integration and Vercel deployment are not complete. Local mocked/cryptographic tests do not prove live purchase behavior.

Intended integration:

```text
React / Vite → FastAPI → Supabase PostgreSQL
                 ↑
       Supabase Auth user JWT
```

React sends a user bearer token; FastAPI verifies it with the project's JWKS and derives ownership. A server-only credential performs database operations. Browser roles have no direct financial-table or purchase-RPC access. There is no bank integration.

## Technology and repository structure

- Frontend: React 19, TypeScript, Vite 8, Tailwind CSS, React Router, Framer Motion.
- Backend: Python 3.12, FastAPI, Pydantic, PyJWT with cryptography, Supabase Python SDK, Uvicorn, python-dotenv.
- Database: Supabase PostgreSQL, versioned SQL, RLS and restricted atomic purchase RPC.
- Checks: ESLint, TypeScript/Vite build, pytest local and explicit opt-in live tests.

```text
src/                         React pages, components, types and calculations
public/                      Runtime SVG assets
api/index.py                 ASGI deployment entrypoint
backend/app/                 API, models, JWT verification, services, repository
backend/dev.py               Explicit local dotenv loader and startup validation
backend/inspect_auth.py       Read-only, value-free Auth inspection
backend/register_test_users.py  Normal confirmation-preserving test signup
backend/tests/               Local tests and guarded live integration suite
supabase/migrations/         Reproducible schema SQL
supabase/tests/              Read-only schema assertions and live-test procedure
docs/                        Implementation, prompts, assessment and design evidence
tools/demo-recorder/         Optional Playwright demo utilities
BUS4012 AS01 .../            Original academic Figma exports; not runtime assets
```

Screens: `/login`, `/setup`, `/essentials`, `/runway`, `/purchase`, `/result`. Money uses integer cents; the canonical example is 95,000 funds minus 73,500 protected costs = 21,500 runway. These sample design values are not actual student financial records.

## Windows prerequisites and clone

Install Git with Git Credential Manager, Node.js 24 with npm, and Python 3.12 with the Windows `py` launcher. The local verification environment uses Node 24 and Python 3.12. Repository access requires authorized GitHub authentication; do not put tokens in clone URLs. Use PowerShell:

```powershell
git clone https://github.com/khuongvuthien1995-png/student-money-runway-asm3.git
cd student-money-runway-asm3
npm ci
py -3.12 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
# Install pytest and the same runtime dependencies for development checks:
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt -c requirements-lock.txt
```

`package-lock.json` pins the frontend install. `requirements-lock.txt` records the verified Windows environment's Python packages as constraints; use it with either requirements manifest for matching versions. Platform-specific dependencies can differ on other operating systems. Do not copy another machine's virtual environment or node_modules.

## Safe environment configuration

Every machine must privately supply its own permitted credentials. `.env.example` contains blank fields and non-sensitive defaults only. Create the ignored local file once, preserving any existing one:

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Edit `.env.local` in your editor. Set `SUPABASE_URL` to the approved development project's URL, `SUPABASE_SECRET_KEY` to its server secret/service-role credential, and `SUPABASE_PUBLISHABLE_KEY` to its public application key. Leave mode `jwks` and audience `authenticated` unless verified project configuration requires a reviewed change. The code derives JWKS URL and issuer from `SUPABASE_URL`; remove blank optional URL overrides if replacing process configuration explicitly. `ALLOWED_ORIGIN` defaults to `http://localhost:5173`.

The local launcher intentionally restricts this checkpoint to `student-money-runway-asm3-dev`, reference `mnjmugwkjtihqswssiwa`, in Sydney. This public project reference is not a credential. Other projects require a reviewed configuration change. CLI login credentials are not application service credentials.

Optional `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` fields are reserved for future frontend integration; the frozen React UI does not currently consume them. Never use a `VITE_` prefix for a server key, password or token. Vite exposes prefixed values to the browser.

## Start frontend and backend

Use two terminals in the repository root:

```powershell
# Terminal 1, normally http://localhost:5173:
npm run dev

# Terminal 2, after privately completing .env.local:
.\.venv\Scripts\python.exe -m backend.dev --check
.\.venv\Scripts\python.exe -m backend.dev
```

The backend binds to `127.0.0.1:8000`, explicitly loads `.env.local` before constructing settings, and disables request access logs. It prints configuration errors without values. Test its public health and OpenAPI:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

Visit `http://127.0.0.1:8000/docs`. Five operations exist across three paths: health GET; current plan GET/PUT; current plan purchases GET/POST. Financial operations require real Supabase user bearer tokens. Starting the two services does not automatically connect the frozen frontend to the backend.

Without cloud credentials, use the safe unit tests. For routing-only smoke inspection, `.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000` starts an unconfigured app; health can work but financial operations are unavailable. That command does not automatically load `.env.local` and does not prove persistence.

## Supabase configuration and migration policy

The official CLI is a local npm development dependency. Only authorized project members can use hosted inspection:

```powershell
npx supabase --version
npx supabase login
npx supabase link --project-ref mnjmugwkjtihqswssiwa
npx supabase migration list --project-ref mnjmugwkjtihqswssiwa
.\.venv\Scripts\python.exe -m backend.inspect_auth
```

The installed CLI uses normal browser authentication; `npx supabase login --no-browser` is available when needed. Never paste its access token into chat, reports or source files. `supabase/.temp` is local linkage state and is ignored; a clean clone must link independently. `supabase/config.toml` is local-development configuration, not proof of the hosted Auth settings. Do not run `config push` blindly.

The initial migration `20261012020847_initial_schema.sql` has already been applied to this development project. Do not reapply it, edit its deployed contents, or reset the hosted database. Future schema corrections require a new versioned migration, reviewed dry-run and explicit approval. Do not run db push as part of clone setup. Read-only hosted assertions:

```powershell
npx supabase db query --linked --file supabase/tests/001_schema_assertions.sql
```

This validates schema and privileges, not live financial behavior. Source control contains schema SQL, not the hosted database or financial data.

## Local quality checks

```powershell
npm run lint
npm run build
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe -m pytest backend/tests -q
.\.venv\Scripts\python.exe -m compileall -q backend api
```

The normal pytest run skips the live integration tests. Local cryptographic tests use generated keys; API unit tests use an in-memory repository. Neither substitutes for live Auth, database transactions or concurrency.

## Opt-in live integration tests

Read [the live-test runbook](backend/tests/integration/README.md) before opting in. Privately create ignored `.env.live-tests.local` with the four blank `TEST_USER_*` fields from `.env.example`, then supply two distinct dedicated accounts you control. They must be email-confirmed and have no pre-existing financial rows. Keep account passwords in this local file only. The signup helper preserves normal confirmation and may require email, CAPTCHA or MFA steps.

The suite verifies the exact development URL/link, signs in through real Auth, starts its own backend server, creates isolated financial fixtures, and cleans only the captured plan IDs and their cascade purchases. It is not appropriate for production or unrelated user data.

```powershell
$env:RUN_SUPABASE_LIVE_TESTS = '1'
try {
    .\.venv\Scripts\python.exe -m pytest backend/tests/integration -v -x --tb=no
} finally {
    Remove-Item Env:RUN_SUPABASE_LIVE_TESTS -ErrorAction SilentlyContinue
}
```

Do not use `--showlocals` or HTTP tracing with real credentials. The current P2B record is [here](docs/implementation/asm3-p2b-live-integration.md); skipped tests are not a live PASS. Git publishing and clean-clone checks do not run financial tests or copy cloud credentials.

## Optional demo tools

The recorder has its own dependency manifest: `cd tools/demo-recorder`, `npm ci`, then follow its [README](tools/demo-recorder/README.md). Playwright browser installation may be required. Generated video, test results and reports are excluded from source control; curated screenshots and design references are retained.

## Troubleshooting and security

- Missing Python/Node: verify `py -3.12 --version`, `node --version`, and `npm --version`; use the documented versions.
- PowerShell activation restrictions: invoke `.venv\Scripts\python.exe` directly; activation is not required.
- `ModuleNotFoundError`: install `requirements-dev.txt` in the same virtual environment used by the test command.
- Missing server configuration: edit and save the ignored `.env.local`, then run `backend.dev --check`. Never print it to diagnose a failure.
- `email_not_confirmed`: complete normal confirmation. Default Supabase mail delivery has restrictions; custom SMTP may require a separate provider configuration. Do not disable confirmation to pass tests.
- Port in use: stop the existing development process or run `backend.dev --port 8001`; adjust health URLs accordingly. CORS origin must match the actual frontend port.
- Live fixture guard failure: inspect only dedicated test accounts through an authorized process; do not delete unrelated data.
- Private repository unavailable: finish GitHub OAuth and ensure the account has repository access; do not embed tokens in URLs.

Populated environment files, CLI state, logs, caches, virtual environments and builds must remain ignored. A private repository still requires secret scanning. Never commit server keys, user passwords/tokens, confirmation links, database passwords or financial test rows. Do not deploy Vercel or begin P3 automatically from these setup steps.
