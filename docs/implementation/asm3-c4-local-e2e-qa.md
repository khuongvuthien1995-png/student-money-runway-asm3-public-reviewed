# ASM3 C4 — Local full-stack E2E QA and stabilization

> Verified: 2026-10-13 (Australia/Sydney)
> Verdict: C4 LOCAL QA PASS — READY FOR C5
> OFFLINE E2E PASS · LOCAL HTTP PASS · LIVE SUPABASE PENDING

## A. Source baseline and boundaries

Read the user-supplied C4 request, the complete workspace master plan, C2/C3 evidence and current frontend/backend contracts. Used the latest worktree above `main` HEAD `c0422f1fbc20e9da6fc0d3d1edec83d5482b0626`, including the uncommitted C1/C2/C3 work. No earlier ZIP or source version was restored.

A pre-C4 hash inventory recorded 311 existing paths, including the two ignored environment files. Seven existing files changed in this phase; all other baseline hashes match. The six screens, routing/state architecture and real Auth/API infrastructure remain intact. ResultPage received only responsive sizing classes and a provenance annotation. No dependency, backend financial contract, monetary formula, RLS or migration change occurred.

The applied `20261012020847_initial_schema.sql` remains SHA256 `0303356445EFD8EE72666569902E3D483FE6A48CFBDD3E390CE86FE50F38D7EE`. Both populated environment files remain ignored, unchanged and unstaged. No provider login, signup, hosted database read/write, key retrieval, migration execution, Git commit/push or deployment occurred.

## B. Exact files changed

Modified existing files:

- `README.md`: reproducible C4 commands, dependency setup, ports and verification boundaries.
- `backend/app/security.py`: local malformed-JWT rejection before JWKS configuration; trusted signature/claim verification retained.
- `backend/tests/test_security_hardening.py`: six malformed-token cases and one valid-structure/configuration-denial case.
- `src/services/purchaseApi.ts`: correlate confirmation purchase identity/content with its returned plan and original proposal before accepting success.
- `src/services/financialApi.test.ts`: four mismatched-response cases and one legitimate normalized-name case.
- `src/pages/ResultPage.tsx`: constrain preview flex items and confirmed grid content so valid long names wrap.
- `tools/check-client-bundle.py`: reject C4-only Auth/test-entry markers in production artifacts.

Created source, test tools and documentation:

- `tests/browser/c4.html`
- `tests/browser/c4-main.tsx`
- `tools/demo-recorder/c4-fixtures.mjs`
- `tools/demo-recorder/verify-c4-integration.mjs`
- `tools/verify-local-http.py`
- `docs/implementation/asm3-c4-local-e2e-qa.md`

Created evidence under `docs/implementation/evidence/c4/`:

- `browser-results.json`: every executed browser case, viewport, actual intercepted requests, warnings and errors.
- `local-http-results.json`: actual loopback response checks and process shutdown evidence.
- `quality-gates.json`: terminal command results and explicit skipped-live counts.
- `changed-files.json`: complete C4 path inventory, including every screenshot.
- `defect-reproduction.json`: the initial four-width run's three preview-overflow failures (121 passed, 3 failed).
- `defect-preview-before-768.png` and `defect-confirmed-before-390.png`: genuine failing-layout screenshots.
- At each of **390, 768, 1024 and 1280px**, thirteen final screenshots: `login`, `setup`, `runway`, `preview`, `processing`, `confirmed`, `restored-essentials`, `error-service_unavailable`, `error-auth_verification_unavailable`, `save-error`, `uncertain`, `maximum-preview`, `maximum-history` (filenames use `<width>-<state>.png`).

This is 52 final-state screenshots plus two retained defect screenshots. Obsolete intermediate failure captures were removed from this phase's generated evidence. Re-running the existing C2 verifier left its evidence hashes unchanged. Build/cache files and internal baseline/compiler records remain ignored.

## C–H. Browser matrix, Auth, plans, purchases and uncertainty

The new runner executes **31 independent scenarios at each width: 124 passed, 0 failed, 0 skipped**. It renders the actual App, six page components, AuthProvider, BrowserRouter, state hook, money conversion and real FastAPI client modules. Only the browser entrypoint's Auth adapter and Playwright HTTP responses are doubles. Unlike the earlier MemoryRouter harness, this entrypoint exercises actual browser refresh/back/forward behavior.

All response bodies below are deterministic test fixtures, not hosted financial records. Each scenario and captured request is recorded in [browser-results.json](evidence/c4/browser-results.json).

| User action and session | Network scenario / expected request | Expected and observed UI | Result at all widths |
|---|---|---|---|
| Anonymous user opens each protected route | No financial requests | `/login`; no private amounts or redirect loop | PASS |
| Restore Auth, then load plan | Delayed Auth and delayed initial GET tested independently | Status announcements; neither private-content flash nor premature setup | PASS |
| Login / signup / Auth startup failure | Test adapter accepts login, rejects invalid credentials, returns confirmation-required signup or unavailable Auth | Navigation waits for Auth; errors/confirmation are visible; no invented session | PASS |
| First-time User A completes Setup/Essentials | GET 404 `PLAN_NOT_FOUND`, no PUT on Setup Continue, then exact five-field PUT at Save | Empty draft → pending disabled save → saved Runway | PASS |
| Returning User A restores/refreshes/edits | GET 200; PUT success or 503 then explicit retry | Hydrated forms; draft survives failure; returned plan owns displayed amounts | PASS |
| Initial GET cannot establish a plan | Transport interruption, unrelated 404, 503 including `AUTH_VERIFICATION_UNAVAILABLE` | Retryable error, retained session; no false first-time flow | PASS |
| Preview purchase | Zero POSTs; saved mock balance remains unchanged | Runway before, amount and remaining/excess; valid preview only | PASS |
| Confirm explicitly / duplicate clicks | One initial POST; gated 201 response | Actual processing state; disabled action; success only after response | PASS |
| Server returns a different legitimate balance | POST 201 returns funds 77700 rather than local estimate 79000 | Funds AUD 777 / runway AUD 42; no local subtraction | PASS |
| Confirm exact runway / excess | Exact 21500 succeeds; excess preview cannot POST; stale balance returns 409 `PURCHASE_EXCEEDS_RUNWAY` | Zero runway after exact purchase; rejection reconciles saved balance and permits safe edit | PASS |
| POST outcome is uncertain | Real client timeout after mock commit or network interruption | No success or optimistic deduction; read-only proposal; original UUID/name/amount retained | PASS |
| Retry original confirmation | Identical body/key, response 200 `replayed:true` | One mock history row/deduction; explicit no-second-deduction feedback | PASS |
| Response conflicts or is malformed | 409 reused key, 422, 503, or successful-looking response with altered identity/payload | Safe error/uncertainty; no forced new key or false success | PASS |
| Revisit successful result / start another purchase | Back/forward remount sends no additional POST; next approved purchase has a different UUID | Saved success stays definitive; new proposal is separate | PASS |
| Refresh uncertain result / invalid `/result` | Refresh loses in-memory proposal; zero automatic new POSTs | Safe empty purchase route, no invented success | PASS |
| Purchase history | Explicit GET failure then retry | Error without losing plan; authoritative history after retry | PASS |
| Logout, expired session and switch accounts | GET/PUT/POST 401; late held User A GET/POST resolves after User B switch | Login required after 401; previous amounts/history/proposals removed; late response ignored | PASS |
| Strict and maximum financial input | Negative/precision/separator/exponent/over-limit/empty inputs; exact cents and native date field | Invalid forms cannot submit; max amounts and 120-character names remain usable | PASS |

Canonical browser assertions: 95000 funds, 45500 fixed, 18000 flexible and 10000 safety → protected 73500/runway 21500; preview 16000 → remaining 5500 with zero POSTs; confirmed response → funds 79000/runway 5500. Exact 21500 → zero runway; 30000 preview → 8500 excess. Shortfall 65000 versus 73400 → 8400. A separate 3-cent plan saves exactly 3/0/1/1 cents without rounding. C1 contract tests continue rejecting impossible/year-zero dates at the service boundary; native date input and empty-date feedback are exercised in Chromium.

Timeout tests use the production client's configured deadline, not a manually injected timeout exception. The test server's committed-state simulation intentionally withholds the first response. Retry uses the identical immutable body and gets replay 200; no second mock deduction occurs. This proves client integration behavior, not PostgreSQL atomicity.

## I–J. Responsive and accessibility evidence

| Chromium viewport | Browser cases | Final outcome |
|---|---:|---|
| 390px | 31 | PASS |
| 768px | 31 | PASS |
| 1024px | 31 | PASS |
| 1280px | 31 | PASS |

Actual DOM geometry checks found zero horizontal overflow in the final journeys, including maximum-value preview, confirmation and history. CTA bounds after scrolling remain inside the viewport and above fixed mobile navigation. Mobile navigation is visible/fixed below 1024px; desktop navigation is visible/static at 1024/1280px. Labels, validation alerts, saving/processing announcements and disabled controls are asserted against real UI.

A separate keyboard-only journey uses Tab and typed input to traverse login → Runway → Setup → Essentials → Runway → Purchase → Result → Runway → logout. It verifies visible focus indicators and Enter/Space activation at all four widths. Reduced-motion Chromium contexts verify the processing spinner's animation is disabled while processing feedback remains available. Limited automated checks do not constitute WCAG certification.

Final results contain **zero page exceptions, unhandled promise errors or critical console warnings**. Three known noncritical notices are recorded separately: two React Router v7 migration notices and Framer Motion's reduced-motion notice. Unexpected warnings/errors fail the runner; expected failed-resource messages from deliberately rejected requests are excluded. External requests are blocked, and provider attempts would fail the test; the only recorded external origin is Google Fonts. Screenshots therefore show **fallback fonts**, not verified remote-font rendering.

Selected visual evidence: [mobile uncertainty](evidence/c4/390-uncertain.png), [tablet fixed maximum preview](evidence/c4/768-maximum-preview.png), [desktop runway](evidence/c4/1280-runway.png), [maximum-name history](evidence/c4/390-maximum-history.png).

## K. Actual Uvicorn HTTP and development proxy

`python tools/verify-local-http.py` starts the actual `api.index:app` through `python -m uvicorn`, using the documented routing-only startup approach. Inherited Supabase/test-user configuration is removed; `.env.local` is not loaded by the backend. This deliberately differs from the configured `backend.dev` launcher, which loads real private configuration and is unnecessary for this offline gate.

**19 actual HTTP checks passed, 0 failed/skipped**:

- Health 200 with exactly `{status:"ok"}`.
- OpenAPI contains three paths/five operations, correct plan/history envelopes, POST 200/201 confirmation envelopes and safe 401/422 schemas.
- All four financial operations return safe 401 envelopes for missing bearer, incorrect scheme and malformed JWT (12 checks). Valid-shaped write probe bodies never reach financial mutation.
- CORS permits the configured origin/method/headers, omits credential allowance, and rejects unapproved origin/method (three checks).
- The actual production Vite development config forwards health through `/api` to Uvicorn on `127.0.0.1:8000` and preserves financial 401 rejection (two checks).

Uvicorn startup/shutdown lifecycle messages were checked in process memory. Both servers stopped and their sockets became unreachable. Access logs are disabled; checked output contains no authorization probes, token markers, private-key markers or traceback. Windows SIGBREAK shutdown yields Uvicorn exit code 3 and Node's signal exit code 3221225786; these are recorded honestly rather than described as normal process exit 0. The smoke **checker itself exits 0**, and Uvicorn reports application shutdown complete. [Actual machine results](evidence/c4/local-http-results.json) contain no raw log/credential data.

This establishes local HTTP routing/auth rejection/proxy behavior. It does not establish real sign-in, authenticated database access or hosted persistence.

## L–M. Production/test separation and secret checks

Production entrypoint still mounts the real Supabase adapter and real FastAPI modules. C4 bridge controls, fake bearer/password strings and sessionStorage test identity exist only under the test entrypoint. API interception exists only in the Node test tools; production has no fake success path or financial-table Supabase calls.

The production checker inspected five built files, finding **0 unsafe paths**, including equality checks against actual private local values and C4/C2 test markers. The candidate/staged repository checker scanned **374 working candidates and 0 staged blobs**, finding **0 flagged paths**. Both populated environment files remain ignored and preserved. Source/evidence scans report paths/counts only. Their pattern/equality checks do not certify universal secret detection; selected raster evidence was visually inspected and contains only controlled offline sample data.

## N. Actual final quality gates

| Executed command/check | Actual final result |
|---|---|
| `npm test` | **122 passed**, 8 files, 0 failed/skipped; 6.54s; exit 0. Baseline 117 + five C4 contract cases. |
| `npm run lint` | **PASS**, exit 0. |
| `npm run build` | **PASS**, exit 0; 494 modules; main JS 642.53 kB / 187.81 kB gzip; existing nonfatal chunk warning. |
| `.venv/Scripts/python.exe -m pytest backend/tests -q` with live opt-in disabled | **157 passed, 2 hosted tests skipped, 0 failed**, 2.25s; exit 0. Baseline 150 + seven C4 security cases. |
| `.venv/Scripts/python.exe -m compileall -q backend api` (also compiled new HTTP checker) | **PASS**, exit 0. |
| `.venv/Scripts/python.exe -m pip check` | **PASS**, exit 0; no broken requirements. |
| `node tools/demo-recorder/verify-c2-integration.mjs` | **PASS**, four viewport journeys; exit 0; offline only. |
| `node tools/demo-recorder/verify-c4-integration.mjs` | **124 passed**, 0 failed/skipped; 31 cases × four widths; aggregate case time 105.45s; exit 0. |
| `.venv/Scripts/python.exe tools/verify-local-http.py` | **19 checks passed**, 0 failed/skipped; startup/shutdown verified; exit 0. |
| Additional C4 browser-entry TypeScript check using an ignored temporary config extending `tsconfig.app.json` | **PASS**, exit 0. |
| `.venv/Scripts/python.exe tools/check-client-bundle.py` | **5 files checked, 0 unsafe paths**; exit 0. |
| `.venv/Scripts/python.exe tools/check-repository-secrets.py` | **0 flagged paths**, 0 staged blobs; exit 0. |

Terminal summaries and verification categories are retained in [quality-gates.json](evidence/c4/quality-gates.json). Python still emits the existing Starlette/httpx deprecation warning. Skipped hosted cases are not passing live tests.

## O. Reproduced defects, focused repairs and retests

| Severity / reproduction | Expected versus actual before fix | Root cause, files and repair | Regression and actual retest |
|---|---|---|---|
| HIGH: successful-looking replay changes returned plan ID/owner/name/amount | Reject mismatched confirmation; instead the client accepted it and UI claimed purchase recorded | `purchaseApi.ts` validated shapes only. Added plan/purchase identity and request-content correlation; backend-trimmed names remain compatible. Mismatch throws 502 and existing C2 uncertainty handling freezes original proposal. | Four new unit cases reproduced false acceptance; all ten module tests pass after fix. Browser malformed-replay case passes at all four widths without success or automatic replacement key. |
| MEDIUM: malformed JWT with no provider configuration | Local safe 401; instead configuration was checked first and gave 503 | `security.py` now rejects invalid compact syntax/JSON locally before configuration. The unverified parse supplies no identity; trusted signing key plus issuer/audience/expiry/subject checks are still mandatory. | Six failing cases reproduced 503; new valid-structure case remains denied with configuration 503. Focused 36 security tests and final 157-case backend suite pass; real HTTP malformed bearer returns 401 on all four financial operations. |
| MEDIUM: 120-character unbroken name and maximum purchase in tablet/desktop preview | Fit within viewport; instead scrollWidth 1679 at widths 768/1024/1280 | Preview flex child's minimum content width prevented `break-words` wrapping. `ResultPage.tsx` now gives the title a shrinkable `min-w-0 flex-1` container and bounds the amount. | Initial full run: 121 passed, three layout failures. Focused four-width maximum-data run and final full 124-case run pass. Genuine before screenshot retained. |
| MEDIUM: same maximum purchase after confirmation at 390px | Wrapped confirmed card; instead scrollWidth 1492 | Implicit mobile grid track retained the name's minimum content width. Added `min-w-0` to confirmed content in `ResultPage.tsx`. | Extended maximum-data journey reproduced failure after preview repair; four-width preview/confirmation/history checks now pass. Genuine before screenshot retained. |

Test-only infrastructure repairs: classify known Router migration notices separately from critical errors; use valid browser history before testing logout/back; target the primary zero-runway display without duplicate text ambiguity; use the actual history-retry button label; remove unused declared globals flagged by lint; isolate the C4 Vite cache to prevent concurrent servers invalidating optimized dependencies. These were test/tool defects, not production feature repairs. No validation was weakened to hide a product failure.

## P–Q. Remaining risks and C5 handoff

No verified blocking local C4 defect remains. Existing main-chunk size, previously documented dependency advisories and test-client deprecation remain; this phase performed no dependency upgrade or new vulnerability audit. The limited Chromium/keyboard checks do not cover every device, browser or accessibility need.

**P2B LIVE PENDING — EMAIL CONFIRMATION.** This phase made no new Auth attempt; the previous two-account confirmation/mail-delivery checkpoint remains unresolved. Real Supabase sign-in, hosted ownership/RLS, financial persistence, PostgreSQL rollback/concurrency and Vercel HTTPS are unverified by C4. Mock commit/replay state does not establish actual database guarantees.

Unsaved drafts/proposals remain in memory. A full reload discards an uncertain proposal/key and cannot establish whether it committed; the documented recovery is to inspect actual history before proposing another expense. No automatic purchase is sent after refresh. A definitive key-reuse conflict stays blocked for reconciliation rather than forcing another deduction.

C5 can use these locally verified client/backend contracts and reproducible QA tools when deployment is separately authorized. Check public frontend configuration, private backend settings, HTTPS Auth/CORS origins, production `/api` routing and real provider acceptance at that later gate. Preserve the applied migration and maintain the distinction between offline, loopback and live results. **C5 was not started.**

**C4 LOCAL QA PASS — READY FOR C5**
