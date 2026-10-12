# ASM3 P1B + P2B — Live Supabase Database and FastAPI Integration

> Project: Student Money Runway — BUS4012 Assignment 03
> Student: Thien Khuong Vu
> Target: `khuong-projects / student-money-runway-asm3-dev`
> Reference: `mnjmugwkjtihqswssiwa` — `ap-southeast-2` (Sydney)
> Started: 2026-10-12T02:40:27+11:00
> Updated: 2026-10-13 (Australia/Sydney)
> Status: P1B DATABASE DEPLOYMENT PASS; P2B PARTIAL — TEST EMAIL CONFIRMATION REQUIRED

## Latest verified checkpoint — 2026-10-13

The Notepad-saved `.env.live-tests.local` now contains all four nonempty test-account values. Presence, email format and distinct-email checks passed without printing any values. The file is UTF-8 without a BOM (350 bytes); no encoding change was needed. Existing working backend keys were preserved and not retrieved again. Earlier blank-file observations below are historical and have been resolved.

Real password login initially returned HTTP 400 / `invalid_credentials` for both accounts. A server-authorized read-only Auth account listing confirmed that neither configured email identity existed; other identities were not printed or modified. The existing `backend.register_test_users --signup` workflow then completed with exit 0 and accepted signup for both configured accounts through normal email/password Auth. No administrative user insertion, confirmation bypass or Auth-setting change occurred.

Subsequent password login returned HTTP 400 / `email_not_confirmed` for both users. This is the precise external checkpoint: the student must complete both verification emails. Successful signup requests do not prove mail delivery or successful login. No financial records or fixtures were created. Valid bearer acceptance, financial API persistence, transaction behavior, isolation, rollback and concurrency remain pending; the opted-in suite has not been rerun against unconfirmed accounts.

The student was asked only to complete the two email links. The agent will independently recheck actual login after confirmation, then execute and debug the live suite. No hidden-input window was reopened. Source changes in this continuation: this evidence only; normal signup created two pending Auth identities as authorized. No applied migration, React, key, deployment or source push was changed.

Current regression results: 19 local tests passed, 2 opt-in live tests skipped, one existing Starlette/httpx warning (0.76s); compilation, lint and build passed with exit 0. Both credential files remain Git-ignored. These local results do not establish real Auth or live financial behavior. Verdict: **P2B PARTIAL — HUMAN CHECKPOINT REQUIRED** (email confirmation only).

Email-delivery checkpoint: the student reports neither verification email arrived. Read-only Auth inspection confirms both accounts remain unconfirmed and both have `confirmation_sent_at` populated. Those timestamps record send attempts, not inbox delivery. CLI configuration diff and `config pull --dry-run` completed without changing local or hosted configuration. Email confirmation remains enabled; minimum mail interval is one minute. CLI projections did not establish whether hosted custom SMTP is configured, so no SMTP status or delivery failure cause is claimed. Supabase's [official SMTP documentation](https://supabase.com/docs/guides/auth/auth-smtp) states that its default sender is restricted to organization-member addresses and lacks a delivery guarantee; this is a possible cause only if the project uses that sender. No resend, security bypass or live financial test was performed during this inspection.

## Authorization and execution

The user explicitly approved only `20261012020847_initial_schema.sql` on project `mnjmugwkjtihqswssiwa`. Official Supabase CLI 2.120.0 was installed locally and authenticated by the user in VS Code. Authenticated project and organization listings mapped the project to organization `flrqbmcflwazcwtiowyl`, named `khuong-projects`; the project was `ACTIVE_HEALTHY`. The disabled Supabase plugin was not used.

Immediately before execution, the linked reference matched approval and the migration directory contained exactly the approved file. Its SHA256 matched the reviewed version, and was unchanged after application:

```text
0303356445EFD8EE72666569902E3D483FE6A48CFBDD3E390CE86FE50F38D7EE
```

No reset, project recreation, test-user creation, financial-row insertion, React source change, backend feature implementation, Vercel deployment, commit or Git push occurred.

## Actual CLI results

All completed commands below exited 0.

| Command | Actual result |
|---|---|
| `npx supabase db push --linked --skip-vault --dry-run` | Exactly `20261012020847_initial_schema.sql`; `dryRun: true`; seeds and custom roles empty. |
| `npx supabase db push --linked --skip-vault` | `Applying migration 20261012020847_initial_schema.sql...`; `dryRun: false`; `Finished supabase db push.` |
| `npx supabase migration list --project-ref mnjmugwkjtihqswssiwa` | Local and remote both `20261012020847`. |
| `npx supabase db query --linked --file supabase/tests/001_schema_assertions.sql` | Successful response, `rows: []`, no assertion exception; DO block completed and transaction rolled back. |

The earlier `migration list --linked` attempt stalled and was terminated; the explicit `--project-ref` invocation succeeded. Before deployment, live catalog queries found no public tables, neither migration function, and no migration-history table. After deployment, a direct query of `supabase_migrations.schema_migrations` returned:

```json
[{"name":"initial_schema","version":"20261012020847"}]
```

The CLI history time `2026-10-12 02:08:47` is the migration version timestamp, not deployment time.

## Hosted objects and constraints

Live queries verified `public.plans`, `public.purchases`, and `public.confirm_purchase(uuid,text,bigint,uuid)`. Both financial tables contained zero rows at verification time.

| Table | Verified catalog constraints |
|---|---|
| `plans` | Primary key `id`; unique `user_id`; unique `(id,user_id)`; auth-user cascade FK; all four financial columns checked between 0 and 100000000. |
| `purchases` | Primary key `id`; unique `idempotency_key`; amount between 1 and 100000000; trimmed name length between 1 and 120; auth-user cascade FK; composite `(plan_id,user_id)` references `plans(id,user_id)` with cascade. |

The reviewed assertions also verified both purchase-history indexes, the enabled timestamp trigger, and absence of persisted runway/shortfall columns.

## RLS and effective privileges

`pg_class.relrowsecurity` was true for both tables. `pg_policies` returned all five ownership policies: `plans_select_own`, `plans_insert_own`, `plans_update_own`, `purchases_select_own`, and `purchases_insert_own_plan`. Plan policies use `user_id = auth.uid()`; purchase insertion additionally checks ownership of the referenced plan.

Effective permissions were measured using `has_table_privilege` and `has_function_privilege`:

| Role | Both financial tables | RPC EXECUTE |
|---|---|---|
| `anon` | SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER all false | false |
| `authenticated` | All seven queried privileges false | false |
| `service_role` | All seven queried privileges true | true |

The migration explicitly grants service-role CRUD. Additional effective service-role privileges reflect hosted defaults that this migration did not revoke. Browser roles cannot directly read or mutate financial tables. FastAPI must enforce ownership because its server credential bypasses RLS.

The hosted RPC definition has `SECURITY DEFINER = true`, `search_path=pg_catalog, public`, and the repaired qualified funds-deduction UPDATE. RPC existence and execution permissions passed live validation. Actual purchase execution, idempotent replay, excess rejection and concurrency remain untested.

## Requested local regression checks

| Check | Actual result |
|---|---|
| `.venv/Scripts/python.exe -m pytest backend/tests -q` | 5 passed in 0.79s; one Starlette/httpx deprecation warning. |
| `npm run lint` | PASS, exit 0. |
| `npm run build` | PASS, exit 0; TypeScript and Vite completed, 438 modules transformed. |

Backend tests use an in-memory repository and stub token verifier. They do not establish live Auth/API/RLS isolation/RPC/concurrency results.

## Remaining Auth configuration and P2B readiness

Presence-only inspection found no real local `.env*` file besides `.env.example`, and no values in this execution environment for `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`, `SUPABASE_JWT_ISSUER` or `SUPABASE_PUBLISHABLE_KEY`. CLI authentication is separate from backend configuration. No credentials were requested or printed.

The public endpoint `https://mnjmugwkjtihqswssiwa.supabase.co/auth/v1/.well-known/jwks.json` returned HTTP 200 with one ES256 key. This supports the existing JWKS verification path, but no real user token was verified. Issuer/audience, Auth provider, signup/email-confirmation settings and sign-in behavior still require live confirmation.

The database is ready for integration. Live FastAPI checks require secure backend environment configuration and two student-controlled Auth sessions. Remaining checks: real GET/PUT/RPC, reload/history, user isolation, valid/invalid/expired tokens, idempotent replay/mismatch, excess rejection and concurrent distinct-key serialization. The transaction procedure in `supabase/tests/README.md` remains unexecuted.

The P1B deployment task stopped after verification. The following P2B-FINAL work resumes under the user's separate integration request. Future database repairs require a new reviewed migration; do not edit or blindly rerun the applied initial migration.

## P2B-FINAL execution evidence and human setup checkpoint

The user authorized real backend/Auth integration and controlled financial fixtures, preserving React and the deployed migration. This phase reconfirmed linked project `mnjmugwkjtihqswssiwa`, local/remote migration version `20261012020847`, unchanged migration SHA256, and hosted read-only schema assertions (exit 0, no assertion exception). No database migration or financial fixture mutation was performed in this phase.

### A. Actual Auth settings

Read-only official CLI `config diff --project-ref mnjmugwkjtihqswssiwa` completed successfully, with raw responses captured only in process memory. Its allowlisted projection showed hosted `auth.email.enable_confirmations = true`. Auth is included in the diff scope. Local `auth.enable_signup = true`, `auth.email.enable_signup = true`, and `auth.jwt_expiry = 3600` had no differences; these are matched CLI configuration values, not observed real-token behavior. The CLI's `--output json` form was unsupported for this command; its default machine response was used instead. No remote setting was changed.

The public JWKS endpoint was rechecked: HTTP 200, one ES256 key. Email provider/password login, actual token issuer/audience, actual expiry behavior, CAPTCHA and sign-in remain unverified until secure configuration. `backend.inspect_auth` can inspect the public `/auth/v1/settings` endpoint once the publishable key is present. No signing key or email-confirmation setting was changed.

### B. Deterministic local configuration

Added `backend/dev.py`: `python -m backend.dev --check` and `python -m backend.dev` explicitly load ignored `.env.local` before constructing settings. The local launcher validates the approved project, server-key presence/type, JWKS mode/endpoint, issuer, audience and origin; failures print variable names and safe messages only. It binds to loopback and disables access logs. `python-dotenv` was confirmed installed and is now an explicit direct dependency in `requirements.txt`.

Created ignored `.env.local` with the verified non-secret project URL and blank server/publishable keys; created ignored `.env.live-tests.local` with blank test-account fields. Existing files are not overwritten. Git ignore checks confirmed both paths are excluded. Presence checks and startup validation found the server key missing; `backend.dev --check` exited 1 with `SUPABASE_SECRET_KEY is missing.` The student requested setup instructions and received the project API-key link and instructions for two distinct, dedicated, email-confirmed accounts with no financial data. Real credentials must be entered directly into these local files, never chat.

### C. HTTP health and OpenAPI

A real local Uvicorn process was started for an unconfigured smoke test, with the public project URL/JWKS defaults and no backend service credential. HTTP health returned 200; OpenAPI exposed five operations across three paths; missing and malformed bearer tokens returned 401. The process was stopped. This verifies actual HTTP startup/routing/auth rejection, not configured database persistence or real sign-in. Configured startup waits for the server key.

### D–J. Real Auth, plans, purchases and security

| Category | Actual outcome in this phase |
|---|---|
| D. Valid User A/B bearer verification; issuer/audience/expiry behavior | NOT RUN — controlled accounts and credentials absent. Missing/malformed HTTP bearer rejection passed in the unconfigured smoke test. |
| E. Real GET/PUT plan persistence and calculations | NOT RUN — secure setup required. |
| F. Real purchase history | NOT RUN. |
| G. Atomic purchase and controlled rollback | NOT RUN. |
| H. Idempotent replay, mismatch and excess rejection | NOT RUN. |
| I. Real two-user isolation and browser-role Data API denial | NOT RUN. P1B hosted catalog assertions were re-run successfully. |
| J. Genuine simultaneous purchase confirmations | NOT RUN. Thread-barrier test implemented; no concurrency result claimed. |

### K. Reusable suite and actual checks

`backend/tests/integration/conftest.py` and `test_live_supabase.py` implement opt-in real tests. They require `RUN_SUPABASE_LIVE_TESTS=1`, verified development URL/link, hosted schema assertions, two distinct real email/password identities and no pre-existing financial rows. They launch a real Uvicorn HTTP process with the production verifier/repository, query committed state independently, and clean only captured test plan IDs plus cascade purchases. Accounts remain intact. Startup/sign-in/failure output omits credentials and response bodies. A transport uncertainty requires inspecting dedicated fixtures before rerunning.

Coverage prepared: real bearer acceptance and signature rejection; mismatched issuer/audience using authentic tokens; expiry by advancing verifier time beyond actual token expiration; no-plan/save/retrieve/update; canonical 73500/21500 calculations; client-owner injection; purchase/history; replay/mismatch/cross-user replay; excess and exact boundary; PostgreSQL subtransaction rollback after successful RPC; two simultaneous HTTP confirmations with distinct keys; browser-role table/RPC denials; migration history; cleanup verification. This suite is implemented but not yet validated against real sessions.

Local `test_security.py` uses generated ES256 keys and a local key-set fixture to exercise production claim/signature validation. These are explicitly local cryptographic tests, not Supabase Auth evidence. It also verifies local startup guards and deterministic dotenv loading.

| Executed check | Result |
|---|---|
| `pytest backend/tests -q` via `.venv/Scripts/python.exe -m pytest` | 17 passed, 2 live tests skipped, one Starlette/httpx deprecation warning; 0.76s. |
| `python -m compileall -q backend api` | PASS, exit 0. |
| Real Uvicorn HTTP smoke | Health 200; five operations/three paths; missing/malformed bearer 401; no service credential used. |
| `npm run lint` | PASS, exit 0. |
| `npm run build` | PASS, exit 0; 438 modules transformed. |
| `backend.inspect_auth` | Confirmation/JWKS inspected; exits 1 at missing publishable-key checkpoint. |
| Opted-in live suite | NOT RUN; skipped results do not satisfy acceptance. |

No focused frontend test command exists in `package.json`. React remains frozen. No verified live backend defect has yet been reproduced, so no production verifier/repository repair is claimed.

### L. Exact source changes in this phase

- Added `backend/dev.py`, `backend/inspect_auth.py`, and student-invoked `backend/register_test_users.py` (not executed; preserves email confirmation).
- Added `backend/tests/test_security.py`.
- Added `backend/tests/integration/__init__.py`, `conftest.py`, `test_live_supabase.py`, and `README.md`.
- Updated `requirements.txt` with the direct dotenv dependency.
- Updated this implementation evidence.
- Created only ignored local configuration templates `.env.local` and `.env.live-tests.local`; these are not source artifacts.

No React, initial migration, production API contract or existing backend persistence implementation was changed.

### M. Source-control readiness and exact next checkpoint

Git status still shows the existing workspace source as untracked. No Git remote or identity was configured, invented or pushed. Both local environment files are ignored. A baseline commit/push remains a separately authorized task; this does not block integration.

The student must fill server/publishable keys in `.env.local`, and confirmed dedicated-account emails/passwords in `.env.live-tests.local`. Then run or allow the agent to run the value-free configuration check and read-only Auth inspection. If provider settings remain unavailable, provide only a non-sensitive Auth/email-provider dashboard screenshot. No secrets or user tokens should appear in that screenshot.

After setup, run the opted-in suite following `backend/tests/integration/README.md`, reproduce and repair any actual backend failure, retest, and replace pending rows with real evidence. Do not disable Auth, email confirmation or RLS. Any schema repair requires a new reviewed migration and approval.

### N. Acceptance verdict

**P2B PARTIAL — AUTH/ENV/TEST SETUP REQUIRED.** P1B remains verified. The local startup gap is resolved and a guarded real integration suite is prepared, but valid real sessions, persistence, transactions, isolation and concurrency remain unexecuted. Not ready to claim P3 readiness; do not start React integration automatically. Paused at the user-controlled credential/account checkpoint.


## Autonomous P2B continuation — 2026-10-13

The current source contracts and existing records were inspected directly. The user authorized autonomous secure configuration retrieval through the authenticated official CLI, preserved-value local configuration, controlled account signup, and isolated development integration tests. React and the applied initial migration remain frozen.

| Evidence category | Actual result |
|---|---|
| A. Environment | Python 3.12.5 in the existing virtual environment. FastAPI 0.143.0, Supabase 2.32.0, PyJWT 2.15.1, Uvicorn 0.54.0, python-dotenv 1.2.4, pytest 9.1.1. `pip check`: no broken requirements. |
| A. Secure application configuration | Official CLI `projects api-keys --project-ref mnjmugwkjtihqswssiwa --reveal` returned existing keys, captured only in process memory. Existing new secret/publishable keys were written only into previously blank fields in the existing ignored `.env.local`. No key was created or printed. All existing non-empty values preserved. `backend.dev --check`: exit 0. |
| B. Hosted Auth settings | `backend.inspect_auth`: exit 0. Public `/auth/v1/settings`: HTTP 200; email provider enabled; `disable_signup=false`; `mailer_autoconfirm=false`. Email confirmation required. JWKS: HTTP 200, one ES256 key. Real password login, actual session issuer/audience and expiration enforcement remain NOT TESTED. |
| C. Configured local HTTP | Real `backend.dev` process started and stopped successfully. Health HTTP 200; three OpenAPI paths/five operations; missing and malformed bearer HTTP 401. This time the backend service configuration was present. |
| D. Authenticated GET/PUT | NOT TESTED — dedicated account credentials unavailable. |
| E. Hosted connectivity | Direct server-only Data API read: HTTP 200. Actual existing Supabase SDK table read: PASS, zero plan IDs returned. This is authenticated application-to-database connectivity, not user-session plan persistence. |
| F. Atomic purchase | NOT TESTED in this continuation. |
| G. Idempotency/replay | NOT TESTED in this continuation. |
| H. User isolation | Real two-user API behavior NOT TESTED. Existing P1B catalog verification remains the deployed baseline. |
| I. Concurrency/rollback | NOT TESTED in this continuation. |
| J. Local regression | 17 passed, 2 live tests skipped, one existing Starlette/httpx deprecation warning, 0.67s. Compilation exit 0. Lint exit 0. Build exit 0, 438 modules. No opted-in live result claimed. |
| J. Hosted preflight | Authenticated CLI project list: exact linked project, Sydney, ACTIVE_HEALTHY. CLI 2.120.0; migration listing: local and remote `20261012020847`. No db push/reset executed. |
| K. Defects | No backend technical defect reproduced: the existing SDK worked with the securely retrieved new server key. No speculative code repair performed. |
| L. Changes | Updated this evidence; filled only missing API-key fields in ignored `.env.local`. No backend or frontend source changed in this continuation. |
| M. Human checkpoint | Four test-account fields are blank in existing `.env.live-tests.local`. The student was asked only to enter two controlled distinct emails and chosen passwords directly into this ignored file. The student replied that they will enter these values. No invented identities, signup, financial writes or fixture cleanup occurred. |
| N. P3 readiness | NO — valid User A/B Auth, real API persistence, purchase behavior, isolation and concurrency remain unverified. |

Git ignore checks passed for both local environment files. Equality scanning found the actual server credential in zero inspected source/build files (src, public, dist, backend, api, docs and Supabase source, excluding CLI internal state). React source SHA256 hashes captured before and after checking were identical. The applied migration SHA256 remains `0303356445EFD8EE72666569902E3D483FE6A48CFBDD3E390CE86FE50F38D7EE`. No deployment, push or schema change was made.

Next action belongs to the agent after the local test values are saved: rerun presence checks, attempt real login for each configured account, submit normal signup only when an account is confirmed absent, pause only for required email/CAPTCHA/MFA steps, then execute the opted-in suite and repair actual defects. Do not ask the student to run scripts or investigate logs.

Current verdict: **P2B PARTIAL — HUMAN CONFIGURATION REQUIRED**. Secure server configuration has been completed autonomously; only user-controlled test identities are missing.

## Resume attempt — saved-account checkpoint, 2026-10-13

The student reported saving the test-account values. Direct disk inspection of the exact workspace file `.env.live-tests.local` found all four required fields still blank. The 238-byte file has no BOM; UTF-8/dotenv parsing and a separate declaration scan agree: each field exists once with an empty right-hand side. No credential content was printed. No alternate test configuration file exists in the workspace root. The student was asked only to save the populated values to this exact file and confirm; no commands or log investigation were delegated.

Working `.env.local` was preserved. `backend.dev --check` and `backend.inspect_auth` both exited 0. Hosted Auth settings again showed email enabled, signup enabled, email confirmation required and ES256 JWKS. No API keys were retrieved or recreated.

The explicitly opted-in live suite was attempted: 2 tests collected, 1 fixture setup error, 0 passed, second test not run because `-x` stopped execution; exit 1 in 0.19s. The source precondition requires all four account values, so the setup failure occurred before Auth login, signup, financial mutation or fixture creation. This is a human configuration blocker, not a reproduced backend defect or successful live test.

Requested regressions: 17 local tests passed, 2 live tests skipped during the normal non-opted-in run, one existing Starlette/httpx warning, 0.78s; compilation passed; lint passed; build passed (438 modules). Only this evidence file was changed. No backend code repair, React change, database write, applied-migration rerun, deployment or push occurred. Real sign-in, JWT acceptance, plan persistence, purchases, isolation, rollback, concurrency and cleanup remain untested in this resume attempt. P3 readiness: NO.

Verdict: **P2B PARTIAL — HUMAN CHECKPOINT REQUIRED**. Resume from the existing account-file checkpoint after confirmation; preserve completed server configuration and checks.

After a second student save confirmation, presence checks still found all four fields empty. A second opted-in attempt stopped with the same setup precondition: 2 collected, 1 error, 0 passed, second not run, exit 1 in 0.17s. No login or mutation was attempted. To resolve the local save mismatch without requesting passwords in chat, added `backend/setup_test_credentials.py` and opened a local interactive PowerShell prompt. It hides all four inputs, validates distinct emails/non-empty passwords and the target/ignore policy, and writes directly to the existing ignored file; it performs no signup or database operation. Compilation passed. Awaiting completion of this secret-entry-only prompt. This helper and the evidence are the only source changes in this resume attempt.

The student subsequently clarified that they pressed Enter before completing the prompt and closed it. Setup remains explicitly incomplete. The helper was repaired to retry empty email/password entries and duplicate email identities rather than exit; it verifies that all four values read back from the saved file exactly match the entered values without printing them. The secure local PowerShell workflow was reopened from the beginning. New local-only regression coverage in `backend/tests/test_setup_test_credentials.py` passed (2 tests, 0.16s), including retry and cancellation/preserved-file behavior. No Auth calls, database operations or live tests ran during this reopening task. Live integration will resume only after saved setup is verified.
