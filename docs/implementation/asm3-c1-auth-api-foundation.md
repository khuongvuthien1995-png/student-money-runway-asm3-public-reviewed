# ASM3 C1 — Auth and API foundation

> Verified: 2026-10-13 (Australia/Sydney)
> Verdict: C1 CODE PASS — READY FOR C2
> Scope: local source and offline contract verification only

## A. C0 baseline and boundaries

Read the supplied master plan completely and copied it into the requested implementation-document path when absent. [C0 freeze](asm3-c0-code-freeze.md) records actual baseline HEAD `c0422f1fbc20e9da6fc0d3d1edec83d5482b0626`, source props and Pydantic contracts. Newer local backend helpers and tests were preserved. No ZIP restoration, cloud login, provider call, migration execution, commit, push or deployment was performed. The existing six page components, `App.tsx`, monetary helpers and initial migration match their pre-C1 SHA256 values.

## B–E. Implemented runtime source

- `src/lib/supabase.ts`: real Supabase JS SDK, lazy initialization with public HTTPS URL and `sb_publishable_` key only. Missing/unsafe public configuration throws a clear error; no dummy session is created. Session persistence, auto refresh and confirmation-URL detection are enabled.
- Auth adapter/provider/hook: real password login, signup result with explicit confirmation-required status, logout, restore, synchronous Auth subscriptions, refreshed/current token lookup, safe errors, loading/pending/session states and subscription cleanup. Event-version checks prevent late restoration success/error from overwriting newer signout/sign-in state. Provider is mounted at the existing entrypoint.
- `RequireAuth`: holds protected children while restoration is pending, handles unavailable Auth, redirects anonymous access to login with return-path state, and prevents login self-redirect loops. It is tested but deliberately not applied to the current six-screen demo handlers; that integration is C2.
- Typed DTOs mirror actual camelCase Pydantic bodies. API client injects a freshly obtained bearer, uses same-origin `/api` by default, normalizes backend error envelopes and 401/404/409/422/503, handles caller cancellation and whole-request timeout (including token acquisition and response parsing). It has no cookie credential reliance, automatic mutation retries or synthetic success path.
- Plan and purchase modules call FastAPI only, construct exact whitelisted request fields, validate bounds/date/name/UUID and reject malformed financial responses. No Supabase financial `.from(...)` calls exist. Purchase keys are provided by the caller and preserved verbatim; the confirmation module returns the server's plan rather than deducting locally.
- `moneyCents.ts`: strict decimal regex and digit/BigInt construction, followed by bounded integer conversion. Accepts AUD 0 through 1,000,000 inclusive; rejects negatives, unsupported separators, exponent notation, extra precision and huge values without silent rounding. Reverse conversion emits exact two-decimal AUD strings from bounded integer cents.
- Vite proxies `/api` to loopback FastAPI only for the development server; resolved production and preview configurations have no proxy. API clients have no production loopback fallback. Existing React plugin/settings are preserved.

## F. Actual final checks

| Check | Execution evidence |
|---|---|
| `npm test` | 7 files passed; 72 tests passed; 0 skipped/failed; 1.56s. Vitest + React Testing Library; all doubles confined to tests. |
| `npm run lint` | PASS, exit 0. |
| `npm run build` | PASS, exit 0; TypeScript checks runtime and test source; Vite transformed 485 modules. |
| `python -m pytest backend/tests -q` | 24 passed, 2 opt-in live tests skipped, 1 existing Starlette/httpx deprecation warning; 1.09s; exit 0. |
| `python -m compileall -q backend api` | PASS, exit 0. |
| Shared fixture validation | Five new Python tests validate the frontend request/response/history fixtures against actual Pydantic models and the canonical cents contract. |
| Auth lifecycle/guard coverage | Restore, sign-in/signup/logout, account/refresh events, stale success/error races, StrictMode cleanup, configuration/credential errors, no protected-content flash and no login redirect loop. |
| Transport/financial coverage | Fresh bearer, unauthenticated prevention, exact GET/PUT/POST contracts, error envelopes, timeout/cancel, stable replay key, authoritative response, invalid values/response rejection, no owner injection. |
| Preserved source | All six screens, App, existing financial helpers and deployed migration unchanged. |

Verified local fixes during implementation: removed an extra Vite-config closing parenthesis; made generic request option types explicit for TypeScript; added the early-abort guard and safe missing-configuration error; protected restored state from a late failure; rejected year-zero dates. One initially failed test reused a consumed `Response` twice; the fetch double now creates a fresh response per request. Final tests all pass. No backend production repair or schema change was necessary.

The build reports a non-failing 625 kB minified main-chunk warning (182.27 kB gzip) after adding the SDK. Dependency installation still reports the previously documented 9 advisories (5 high/4 moderate), whose suggested major Tailwind/Router upgrades are outside this preserved-UI C1 change. No forced major dependency migration was performed.

## G. Remaining work and security boundary

No C1 blocking local issue remains. The six-screen login/save/history/confirmation and serverPlan/draft ownership transitions remain C2, including removal of the pre-existing local-only confirmation path. The Auth provider is real infrastructure, not a claim that the current LoginPage performs production sign-in. P2B email confirmation, real two-user/cloud persistence and transaction acceptance remain deferred; skipped or mocked checks are not live PASS. No C2 route wiring, Vercel config/deployment or GitHub publication was performed.

Actual ignored local server-key equality scanning of the production bundle found no server credential. Test-only credential/fixture markers were also absent from production JS. Source scans flagged zero paths; populated environment files remain ignored and the index is unchanged/empty. These are actual source/build checks, not proof of live Auth or a universal secret-detection guarantee.

## Every changed file

Modified existing files:

- `.env.example`
- `README.md`
- `package.json`
- `package-lock.json`
- `src/main.tsx`
- `tsconfig.node.json`
- `vite.config.ts`

Created files:

- `docs/implementation/Student_Money_Runway_ASM3_CODE_FIRST_MASTER_PLAN.md` (provided plan copied intact)
- `docs/implementation/asm3-c0-code-freeze.md`
- `docs/implementation/asm3-c1-auth-api-foundation.md`
- `src/lib/supabase.ts`
- `src/lib/supabase.test.ts`
- `src/auth/authAdapter.ts`
- `src/auth/authAdapter.test.ts`
- `src/auth/authContext.ts`
- `src/auth/AuthProvider.tsx`
- `src/auth/AuthProvider.test.tsx`
- `src/auth/useAuth.ts`
- `src/auth/RequireAuth.tsx`
- `src/types/api.ts`
- `src/vite-env.d.ts`
- `src/services/apiClient.ts`
- `src/services/apiClient.test.ts`
- `src/services/apiSchemas.ts`
- `src/services/planApi.ts`
- `src/services/purchaseApi.ts`
- `src/services/financialApi.test.ts`
- `src/utils/moneyCents.ts`
- `src/utils/moneyCents.test.ts`
- `src/tests/setup.ts`
- `src/tests/fixtures/api.json`
- `tests/viteProxy.test.ts`
- `vitest.config.ts`
- `backend/tests/test_frontend_contract.py`

Authoritative source references for SDK lifecycle and test configuration: [Supabase Auth subscriptions](https://supabase.com/docs/reference/javascript/auth-onauthstatechange), [Vitest configuration](https://vitest.dev/config/). Runtime behavior and test outcomes above were verified locally, not inferred from documentation.
