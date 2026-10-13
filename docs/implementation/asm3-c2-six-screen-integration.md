# ASM3 C2 — Six-screen Auth and FastAPI integration

> Verified: 2026-10-13 (Australia/Sydney)
> Verdict: C2 CODE PASS — READY FOR C3
> Acceptance: local production source, offline App/HTTP contracts and Chromium checks

## A. Source baseline

Used the latest worktree above HEAD `c0422f1fbc20e9da6fc0d3d1edec83d5482b0626` on `main`, including all uncommitted C1 implementations. Read the master plan, C0/C1 evidence, six pages, components, Auth/API implementations, monetary utilities and actual FastAPI/Pydantic/repository contracts. No ZIP restoration occurred. Existing C1 dependencies, entrypoint provider and service contracts were reused.

Backend production files, `runwayCalculations.ts`, `StatusActionButton.tsx` with its attribution, global CSS/design tokens and the deployed migration were preserved. The initial migration SHA256 remains `0303356445EFD8EE72666569902E3D483FE6A48CFBDD3E390CE86FE50F38D7EE`. No Auth/cloud login, hosted test, database write, migration execution, commit, push or deployment occurred in C2. Both populated local environment files remained ignored and were not modified.

## B. Every file changed in C2

Modified current source (C1 modifications that already existed are not counted again):

- `README.md`
- `src/App.tsx`
- `src/auth/AuthProvider.tsx`
- `src/auth/authContext.ts`
- `src/auth/RequireAuth.tsx`
- `src/components/layout/AppShell.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/RunwaySetupPage.tsx`
- `src/pages/ProtectEssentialsPage.tsx`
- `src/pages/RunwayResultPage.tsx`
- `src/pages/PurchaseCheckPage.tsx`
- `src/pages/ResultPage.tsx`
- `src/utils/moneyValidation.ts`

Created source, tests and report:

- `src/state/financialState.ts`
- `src/state/useFinancialWorkspace.ts`
- `src/components/layout/SessionControls.tsx`
- `src/App.integration.test.tsx`
- `src/tests/appTestHarness.tsx`
- `tests/browser/index.html`
- `tests/browser/main.tsx`
- `tools/check-client-bundle.py`
- `tools/demo-recorder/verify-c2-integration.mjs`
- `docs/implementation/asm3-c2-six-screen-integration.md`

Created offline evidence under `docs/implementation/evidence/c2/`:

- `browser-results.json`
- `390-load-error.png`, `390-runway.png`, `390-preview.png`, `390-confirmed.png`
- `768-load-error.png`, `768-runway.png`, `768-preview.png`, `768-confirmed.png`
- `1024-load-error.png`, `1024-runway.png`, `1024-preview.png`, `1024-confirmed.png`
- `1280-load-error.png`, `1280-runway.png`, `1280-preview.png`, `1280-confirmed.png`

Build output remains ignored. No dependency manifest, Python source, SQL, frontend entrypoint or Vite proxy change was needed in C2.

## C–F. Complete six-screen flow, Auth and API ownership

| Route | Implemented source behavior |
|---|---|
| `/login` | Real C1 password sign-in and signup; pending controls; safe credential/configuration errors; confirmation-required feedback without a fabricated session. Successful Auth triggers the authenticated bootstrap GET before routing. |
| `/setup` | Empty draft for a genuine missing plan, or hydrated saved cents converted to exact AUD text. Changes affect the draft only; Continue validates and navigates without PUT. Back to runway preserves the saved financial truth. |
| `/essentials` | Validates source money, displays a cents-based protected total, constructs the exact five-field PUT body, disables submission/fields while saving and accepts the returned plan. Failed saves keep draft entries and allow retry. |
| `/runway` | Displays saved plan values and derives protected/runway/shortfall from integer cents. Provides existing editing/purchase navigation and explicit GET purchase-history loading with pending/error/retry feedback. |
| `/purchase` | Validates trimmed name length 1–120 and positive bounded AUD cents. Changes only the purchase draft. Preview creates or reuses the proposal UUID; no POST occurs. |
| `/result` | Previews against the saved plan without mutation. Explicit confirmation calls POST, renders processing, then accepts the returned purchase/plan/replayed envelope. Updated runway and new-purchase actions follow definitive success. Invalid direct result access redirects safely without confirming. |

All protected routes pass through C1 `RequireAuth`. Initial Auth restoration and plan loading hold financial content. Returning login routes to `/runway` when GET succeeds; only 404 **and** `PLAN_NOT_FOUND` creates the new-plan flow. Unknown 404, network and 503 responses remain retryable failures. Missing-plan confirmation also clears the obsolete saved view and returns to setup.

`Workspace` is keyed by authenticated user identity. `useFinancialWorkspace` owns separate `serverPlan`, `planDraft`, purchase draft, proposal/confirmation status and purchase history. No unsaved form value becomes `serverPlan`. Every asynchronous financial operation checks its captured AbortController/component lifetime before accepting a response. Account switches unmount the prior workspace; tests resolve late GET and POST responses and verify they cannot contaminate the next account.

Auth sign-out immediately removes the session/private UI before awaiting SDK cleanup. A financial 401 invalidates the session, blocks protected actions, clears SDK state and shows sign-in feedback. Late Auth events cannot restore an invalidated session while sign-out is pending. All financial service calls use the C1 bearer client and exact existing FastAPI operations; frontend bodies never supply an owner ID and contain no direct Supabase financial-table calls.

## G. Purchase idempotency and authoritative confirmation

One immutable `{name, amountCents, idempotencyKey}` is created for a valid proposal, independently of renders. Unchanged back/preview navigation reuses it. A changed unsent proposal or an explicit new purchase after success receives a new key. A synchronous confirmation lock prevents duplicate POSTs before React re-renders; `StatusActionButton` receives its actual processing state.

After a definitive POST success, only `response.plan` supplies funds. The old local subtraction path is removed. Confirmed purchase details and history rows come from the response. Re-entering a successful result cannot submit it again; replay success explicitly explains that no second deduction occurred.

Timeout, network interruption, invalid response or server failure is treated conservatively as uncertain. The original payload/key remain unchanged, purchase and plan editing are blocked, and **Retry same confirmation** submits identical content. Refresh saved plan reconciles amounts but does not manufacture purchase success. Even if the refreshed balance is lower, the identical retry remains available because it may be an idempotent replay.

`PURCHASE_EXCEEDS_RUNWAY` displays the rejection and fetches current saved amounts, without a success state; safe purchase editing remains available after reconciliation. `IDEMPOTENCY_KEY_REUSED` is a conflict: the proposal remains read-only and no replacement key is automatically minted. 422 permits correction/retry, and 401 removes protected state.

## H. Loading, error and session UX

Auth/plan bootstrap uses status announcements. Save has a disabled fieldset, busy form and status text. Confirmation disables duplicate actions immediately. Errors use `role="alert"`; email confirmation, replay and uncertain-proposal guidance use status announcements. Recoverable save failures retain entries. Sign-out exists on the setup/essentials screens and shared application shell. Mobile bottom navigation remains three items; the existing edit action is accurately labelled **Edit plan** and opens `/setup`.

Drafts and proposals are intentionally held in memory, with no financial/local-password persistence added. Full reload loses unsaved values and cannot confirm a missing proposal. For an uncertain purchase, remain in the app to retry with the same key; after reload, inspect actual purchase history before proposing another expense. This limitation is documented in README.

## I. Financial regression evidence

Rendered App tests verify:

- 950/455/180/100 AUD → protected 735, runway 215.
- Preview 160 AUD → remaining 55, **zero POSTs**.
- Mock HTTP confirmation → returned funds 790 and runway 55, one initial POST.
- A deliberately different returned balance is displayed without applying a local subtraction.
- Excess preview 300 AUD cannot confirm; exact 215 AUD can confirm with returned runway zero.
- 650 available / 734 protected → shortfall 84 and runway zero.
- Strict rejection of negatives, extra precision, separators, exponent notation, over-limit input, zero purchase amount and names beyond 120 characters.
- Draft protected totals use integer cents rather than floating addition artifacts.

These are deterministic **MOCK CONTRACT PASS** results, not evidence of hosted purchase execution.

## J–L. Actual automated checks

| Command/check | Final execution result |
|---|---|
| `npm test` | **117 passed**, 8 files, 0 failed/skipped; 5.93s; exit 0. Includes 72 C1 tests and 45 new rendered App cases. |
| `npm run lint` | **PASS**, exit 0. |
| `npm run build` | **PASS**, exit 0; TypeScript and Vite, 494 modules; main JS 642.23 kB / 187.73 kB gzip. |
| `.venv/Scripts/python.exe -m pytest backend/tests -q` | **24 passed, 2 live tests skipped**, 1 existing Starlette/httpx warning; 1.17s; exit 0. |
| `.venv/Scripts/python.exe -m compileall -q backend api` | **PASS**, exit 0. |
| `tools/check-client-bundle.py` | 5 production files checked, **0 unsafe paths**; actual local private-value equality, credential patterns and test-entry markers. No credential value printed. |
| `tools/check-repository-secrets.py` | Candidate/staged scan **0 flagged paths**; no staged blobs. Local credentials remain ignored. |
| Preserved source checks | No diff in backend production, SQL migration, core calculation helper, global CSS or attributed status button; migration SHA256 unchanged. |

App coverage includes bootstrap/no flash, valid and invalid login, signup confirmation, restored/empty plans, non-empty error states, exact bearer/PUT/POST contracts, save failure and retry, authoritative edit/dashboard state, preview without write, concurrent clicks, real client timeout, identical-key retry, replay, new keys, stale-runway reconciliation, conflict/validation/service errors, GET/PUT/POST 401, logout, stale GET/POST account-switch protection, invalid deep links and history retry.

Verified repairs during implementation: corrected an initial JSX conditional in Setup; separated initial async load from retry state updates to satisfy React lint; fixed the test fixture's actual key names and queued-response union type; replaced an implicit-status test route probe; made processing assertions account for the existing Framer Motion label transition; corrected a test that attempted to reauthenticate solely with a stale Auth event after explicit sign-out. Source review also repaired exact-cent protected summaries, synchronized confirmed purchase details with the response, and handled a missing plan during POST. Every final check above passed. Touched-file encoding artifacts were repaired while preserving historical provenance.

## M. Actual responsive browser evidence

`node tools/demo-recorder/verify-c2-integration.mjs` launches Chromium against the real rendered App via a **test-only** Auth entrypoint. Playwright intercepts API requests and blocks external network traffic. It starts/stops a loopback Vite server; no real credentials, Supabase sessions or database requests are used.

| Width | Verified result |
|---|---|
| 390px | Offline six-screen flow, mobile bottom navigation, keyboard login, loading/error retry, disabled save/confirmation, immutable retry, updated balances and logout PASS. |
| 768px | Same checks PASS. |
| 1024px | Same checks PASS; desktop navigation visible. |
| 1280px | Same checks PASS; desktop navigation visible. |

All journeys report zero horizontal overflow at each screen and loading/uncertain/success states, zero page errors, one PUT, zero preview POSTs and two identical POST attempts after an intentionally interrupted first confirmation. This is one logical purchase in the offline scenario. [Machine evidence](evidence/c2/browser-results.json), [mobile preview](evidence/c2/390-preview.png) and [desktop runway](evidence/c2/1280-runway.png) are retained alongside all sixteen screenshots. External font requests were blocked, so the screenshots use the configured fallback font. These checks do not claim comprehensive accessibility certification or live E2E persistence.

## N–O. Remaining risks and C3 handoff

No verified C2 local blocker remains. The non-failing main-chunk warning persists; dependency advisories previously recorded in C1 remain a separate reviewed upgrade task. The backend's existing test-client deprecation warning is unchanged. A definitive key-reuse conflict deliberately blocks resubmission/editing rather than forcing a fresh deduction; inspect real history before starting a different proposal.

P2B remains **PARTIAL**, pending test email confirmation/mail delivery. Real two-user Auth, hosted plan persistence, purchase rollback, isolation and concurrency are **NOT VERIFIED BY C2**. Public frontend Auth values and private backend credentials must be configured for actual use; no missing cloud setup blocks offline code acceptance. Neither C3, GitHub publishing nor Vercel deployment started.

C3 should preserve these client contracts, run the existing backend tests, and repair only reproduced backend mismatches. Separately authorized later cloud verification must establish real Auth/persistence/idempotency/isolation/concurrency and deployment behavior. Keep the deployed initial migration unchanged.

**C2 CODE PASS — READY FOR C3**
