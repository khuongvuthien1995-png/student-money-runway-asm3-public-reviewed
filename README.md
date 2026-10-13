# Student Money Runway — BUS4012 Assignment 03

A student budgeting application for planning a short financial horizon, protecting essential costs and a safety buffer, and checking a purchase against discretionary runway. The existing six-screen React application originates from ASM2; ASM3 adds FastAPI and a hosted Supabase schema.

## Current status and architecture

The six screens now use real Supabase Auth and the typed FastAPI services. Authenticated startup loads the saved plan, setup edits a separate draft, essentials saves through PUT, and purchase confirmation uses POST with a stable retry key. Server responses supply the saved balances; previews never write. C1–C5 local checks and C6 private GitHub publication/clean-clone verification are complete. The public [Vercel Preview](https://student-money-runway-asm3-preview.vercel.app/login) has verified HTTPS routing and anonymous browser checks. Live Auth remains blocked by email delivery/confirmation; authenticated cloud persistence and purchases remain unverified. Production has not been approved. Local mocked/cryptographic tests do not prove live persistence.

Implemented source architecture:

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

`package-lock.json` pins the frontend install. `requirements.txt` contains self-contained production pins compatible with Vercel's Python builder; their versions match `requirements-lock.txt`, which also constrains local test dependencies. `.python-version` selects Python 3.12; `package.json` selects Node 24. Platform-specific dependencies can differ on other operating systems and must be verified in C6's Linux build. Do not copy another machine's virtual environment or node_modules.

The private GitHub repository contains the audited C1–C6 source. C6 verified the remote commit and a credential-free clean clone; see [publication and clean-clone evidence](docs/implementation/asm3-c6-execution.md). Repository access must be granted to each developer or marker separately; a private URL alone does not grant access.

## Safe environment configuration

Every machine must privately supply its own permitted credentials. `.env.example` contains blank fields and non-sensitive defaults only. Create the ignored local file once, preserving any existing one:

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

Edit `.env.local` in your editor. Set `SUPABASE_URL` to the approved development project's URL, `SUPABASE_SECRET_KEY` to its server secret/service-role credential, and `SUPABASE_PUBLISHABLE_KEY` to its public application key. Leave mode `jwks` and audience `authenticated` unless verified project configuration requires a reviewed change. The code derives JWKS URL and issuer from `SUPABASE_URL`; remove blank optional URL overrides if replacing process configuration explicitly. `ALLOWED_ORIGIN` defaults to `http://localhost:5173`.

The local launcher intentionally restricts this checkpoint to `student-money-runway-asm3-dev`, reference `mnjmugwkjtihqswssiwa`, in Sydney. This public project reference is not a credential. Other projects require a reviewed configuration change. CLI login credentials are not application service credentials.

The Auth provider uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (a public `sb_publishable_` key); with absent configuration it reports an Auth configuration error through context and never creates a fake session. Configure these public values privately in `.env.local` before using real sign-in. Builds and offline tests need no cloud credentials. `VITE_API_BASE_URL` should be blank for same-origin `/api`; an explicitly configured external API must be HTTPS. The Vite development server alone proxies `/api` to `http://127.0.0.1:8000`; production and preview have no loopback proxy. Never use a `VITE_` prefix for a server key, password or token. Vite exposes prefixed values to the browser.

| Variable names | Purpose and scope |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Public Auth values embedded by Vite **at build time**. Changing them requires a rebuild. |
| `VITE_API_BASE_URL` | Blank for the preferred same-origin deployment; no production localhost fallback. |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Backend runtime database configuration; server key stays private. |
| `SUPABASE_JWKS_URL`, `SUPABASE_JWT_ISSUER` | Optional overrides; normally derived from `SUPABASE_URL`. |
| `SUPABASE_JWT_AUDIENCE`, `SUPABASE_AUTH_VERIFICATION_MODE` | Use `authenticated` and `jwks` with verified project settings. |
| `ALLOWED_ORIGIN` | One explicit allowed origin; local development default is in the example. Use the exact HTTPS app origin for a deployed environment. |
| `SUPABASE_PUBLISHABLE_KEY` | Backend Auth-inspection/signup helpers or the explicitly selected legacy verifier; not required for JWKS financial API operation. |
| `TEST_USER_A_EMAIL`, `TEST_USER_A_PASSWORD`, `TEST_USER_B_EMAIL`, `TEST_USER_B_PASSWORD` | Dedicated local live-test file only, with opt-in disabled during normal checks. Never put these in Vercel. |

Development uses ignored local configuration and permitted development-project credentials. Later Vercel **Preview** and **Production** scopes must each receive their own reviewed public build variables and private backend runtime variables. Do not copy populated environment files into a source snapshot or deployment. The production ASGI entrypoint reads process environment and never calls `backend.dev` or loads `.env.local`.

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

Visit `http://127.0.0.1:8000/docs`. Five operations exist across three paths: health GET; current plan GET/PUT; current plan purchases GET/POST. Financial operations require real Supabase user bearer tokens. With public Auth and private backend configuration supplied, the six-screen frontend calls these APIs through the development proxy.

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
npm test
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe -m pytest backend/tests -q
.\.venv\Scripts\python.exe -m compileall -q backend api
```

The normal pytest run skips the live integration tests. Local cryptographic tests use generated keys; API unit tests use an in-memory repository. Neither substitutes for live Auth, database transactions or concurrency.

`npm test` runs the offline Vitest/React Testing Library suite, including rendered App routing and financial actions. Auth and HTTP doubles live only in tests; runtime uses the Supabase SDK and real fetch. Shared JSON fixtures are also validated by the actual Python Pydantic models. See [C0 contract map](docs/implementation/asm3-c0-code-freeze.md), [C1 foundation](docs/implementation/asm3-c1-auth-api-foundation.md) and [C2 integration evidence](docs/implementation/asm3-c2-six-screen-integration.md). Do not mark these tests as live cloud verification.

After building, check browser artifacts without printing secrets:

```powershell
.\.venv\Scripts\python.exe tools/check-client-bundle.py
```

Optional C2 browser verification uses the existing isolated Playwright installation. Install it with `npm ci --prefix tools/demo-recorder` and, if needed, `npx --prefix tools/demo-recorder playwright install chromium`. Then run `node tools/demo-recorder/verify-c2-integration.mjs` from the root. It starts/stops its own loopback Vite server on port 5192, uses only the test entrypoint in `tests/browser`, blocks external requests, intercepts the API, and writes clearly labelled offline evidence under `docs/implementation/evidence/c2`.

C4 adds browser-history, refresh, keyboard, account-switch and purchase-uncertainty checks at 390, 768, 1024 and 1280px. After installing the recorder's Playwright dependencies as above, run:

```powershell
node tools/demo-recorder/verify-c4-integration.mjs
.\.venv\Scripts\python.exe tools/verify-local-http.py
.\.venv\Scripts\python.exe tools/check-repository-secrets.py
```

The C4 browser runner uses its own loopback server on port 5193 and test-only Auth/API doubles; external font requests are blocked, so screenshots use fallback fonts. The HTTP checker needs free ports 8000 and 5194. It starts the actual `api.index:app` entrypoint through Uvicorn with inherited provider settings removed, verifies unauthenticated HTTP/CORS and the actual Vite development proxy, then stops both processes. It never loads backend credentials or opts into live financial tests. Results and selected screenshots are saved under `docs/implementation/evidence/c4`; [C4 evidence](docs/implementation/asm3-c4-local-e2e-qa.md) distinguishes offline E2E, local HTTP and pending live verification.

## Deployment-ready source and C6 prerequisites

`vercel.json` explicitly selects the Vite preset, root install `npm ci`, build `npm run build` and `dist` output. The existing file-based Python function is `api/index.py`, which exports the original FastAPI app. API rewrites precede six explicit SPA rewrites; `/assets/*` and public SVGs remain filesystem resources. Unknown API paths reach the intended Python function instead of `index.html`, and no extra `/api` prefix is added by the client.

This combined layout follows Vercel's documented [file-based Python functions](https://vercel.com/docs/functions/runtimes/python/api-directory) and [rewrite configuration](https://vercel.com/docs/routing/rewrites). Local schema, Vercel route-compiler and loopback checks establish the intended configuration, **not live Vercel routing**. C6 Preview must prove Python function detection under the Vite preset and preservation of the original `/api/...` path through the rewrite. If the platform requires its Services topology, review that change after a reproduced Preview failure rather than silently replacing the current layout.

`.vercelignore` excludes credentials, tests, development helpers and academic evidence from uploads. Function exclusions also keep frontend/build/resources outside the Python bundle while preserving `backend/app`, the ASGI entrypoint and requirements/constraints. API responses explicitly use `private, no-store` and CDN `no-store`; the browser also disables HTTP response caching. Health is a liveness endpoint: missing or unusable database configuration does not create successful financial responses.

Before an authorized C6 Preview: verify the latest GitHub source/private visibility and author identity; choose the Vercel project root here and Node 24/Python 3.12; configure the reviewed environment scopes; and configure Supabase Auth Site URL/redirect allowlist for the actual HTTPS app domains. The existing SDK detects email-confirmation redirects at the current browser URL. Use exact Production URLs and only approved Preview URL patterns following [Supabase redirect guidance](https://supabase.com/docs/guides/auth/redirect-urls). Do not disable email confirmation, RLS or token verification.

Current signup does not supply an `emailRedirectTo` override, so confirmation uses the project's configured Site URL. Adding a Preview URL to the allowlist alone does not select that destination; verify the intended confirmation destination during C6 before testing signup. No Next.js environment-variable names are used by this Vite app.

First live Preview checks should be health JSON, all six direct React URLs, static assets, unknown API JSON 404, unauthenticated financial 401 and no cache hits for private responses. Only after routing/configuration pass and two controlled accounts are verified should separately authorized live Auth, plan save/reload, purchase replay, isolation and transaction checks run. Production deployment requires separate approval. No GitHub publication, provider configuration or Vercel deployment is performed by the C5 commands below.

```powershell
# After building and installing the recorder's Playwright dependencies:
.\.venv\Scripts\python.exe tools/verify-deployment.py
# Audit and copy the CURRENT Git worktree candidates, including uncommitted source,
# then install new dependencies/venv and run offline checks in a temporary folder:
.\.venv\Scripts\python.exe tools/verify-clean-setup.py
```

The fresh-copy checker retains its temporary directory for inspection. It copies no `node_modules`, virtual environment, Git metadata, populated env files or provider credentials. It installs from the current manifests/lockfiles and runs build/lint/unit tests, Chromium QA, actual local HTTP and the deployment routing model. It requires Node, Python 3.12, package-registry access and free QA ports; this is a local reproducibility check, not verification of the older GitHub branch. See [C5 evidence](docs/implementation/asm3-c5-deployment-ready.md).

Unsaved plan drafts and purchase proposals are kept in memory and cleared on logout or reload. If confirmation is interrupted, stay in the app and retry the same proposal; its payload and key remain read-only. A full reload has no valid proposal and cannot confirm it. Reloading or refreshing financial amounts alone does not establish whether an uncertain purchase was recorded; inspect purchase history before proposing another expense.

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
