# ASM3 C3 — Backend hardening

> Verified: 2026-10-13 (Australia/Sydney)
> Verdict: C3 CODE PASS — READY FOR C4
> Scope: production backend fixes and local/offline verification; no hosted operations

## A. Instructions and preserved baseline

The requested `Student_Money_Runway_ASM3_C3_Backend_Hardening_Codex_Prompt.md` was not available on disk. It was not read or fabricated. After the missing-file checks, the user explicitly authorized proceeding using the conversation's C3 instructions, the existing master plan and the C2 report. That replacement authorization supplies this phase's acceptance scope.

Inspected current backend configuration, security, models, routes, services, repository, entrypoint, existing local/live tests and the current frontend service contracts. Read the master plan and previous implementation evidence. Worked on the latest worktree above HEAD `c0422f1fbc20e9da6fc0d3d1edec83d5482b0626`, preserving uncommitted C0/C1/C2 work.

Preservation hashes were captured before implementation and compared afterward: **51 protected source/configuration paths, zero changes**. These cover frontend source/assets, dependency manifests, Vite configuration, the applied migration and both ignored credential files. The initial migration's SHA256 remains `0303356445EFD8EE72666569902E3D483FE6A48CFBDD3E390CE86FE50F38D7EE`. No frontend redesign, schema change, key retrieval, Auth signup, hosted read/write, Git commit/push, plugin login or deployment occurred.

## B. Exact files changed in C3

Modified production source:

- `backend/app/errors.py`
- `backend/app/main.py`
- `backend/app/models.py`
- `backend/app/repository.py`
- `backend/app/security.py`
- `backend/app/services.py`

Added tests and evidence:

- `backend/tests/conftest.py`
- `backend/tests/test_api_hardening.py`
- `backend/tests/test_repository.py`
- `backend/tests/test_security_hardening.py`
- `docs/implementation/asm3-c3-backend-hardening.md`

Re-running the existing C2 browser verifier regenerated its existing screenshots and `docs/implementation/evidence/c2/browser-results.json`. No new browser feature/test harness or frontend runtime change was introduced. Python caches and production build output remain ignored; the internal preservation-hash file lives only in `.git`.

## C. Reproduced findings and implemented fixes

| Finding reproduced locally | Fix and implication |
|---|---|
| The installed PostgREST SDK returns `None` for an empty `maybe_single()` result. Reading `result.data` raised an exception and incorrectly returned database-unavailable 503. | Handle both an absent result and a result with null data. The actual SDK over an offline HTTP response `[]` now produces HTTP 404 `PLAN_NOT_FOUND`, matching the first-time C2 flow. |
| Repository upsert could accept a `user_id` inside its internal values mapping and overwrite the verified owner. | Put the verified owner last in the payload. HTTP input already had a service whitelist; no public ownership exploit was demonstrated. This closes the repository-level override path and protects future callers. |
| RPC error mapping searched substrings in provider exception text. An unrelated provider failure mentioning `PLAN_NOT_FOUND` became a false no-plan response. | Preserve a typed business code from PostgreSQL `P0001` errors and match exact codes. Other failures remain safe 503 responses. Actual SDK/PostgREST error objects are exercised over MockTransport. |
| JWKS connection failures and malformed key sets were reported as invalid tokens, leading C2 to sign out users during provider outages. | A focused PyJWKClient subclass maps key-provider failures to 503 `AUTH_VERIFICATION_UNAVAILABLE`; unknown keys, signature failures and invalid claims remain 401. No signature verification is disabled. |
| Legacy Auth HTTP 429/5xx or malformed success bodies became 401, or a list body raised an unhandled TypeError. | Explicit invalid-session statuses 401/403 remain 401. Provider/transport/response failures become safe 503 envelopes. Unsupported verification modes fail closed with `AUTH_CONFIGURATION_INVALID`. |
| Malformed plan/history/RPC rows could be coerced into success, raise unhandled exceptions, or serialize a foreign owner returned by a faulty repository. | Validate strict bounded cents before arithmetic; reject invalid/missing rows, foreign owners/history plan IDs, mismatched confirmation content and nonboolean replay flags. Fail closed with 503 `DATABASE_RESPONSE_INVALID`. These are injected-response tests, not evidence of a hosted data leak. |
| A whitespace-only purchase name reached the business layer as a 409 conflict. | Validate/normalize the request name in Pydantic. Blank input now gives the existing 422 `INVALID_REQUEST` envelope before purchase mutation. |
| Pydantic silently accepted numeric dates and datetime strings despite the C1 request contract specifying `YYYY-MM-DD`. | Validate the ISO date boundary explicitly. Those inputs now return 422; legitimate current frontend requests remain compatible. |
| OpenAPI omitted new-purchase 201 and described POST validation through the default FastAPI envelope instead of the actual error envelope. | Document 201 `PurchaseConfirmationEnvelope` and 422 `ErrorResponse`, preserving replay 200 and the five existing operations. |

Existing file provenance and original timestamps remain intact; touched backend files gained truthful C3 hardening annotations. No backend replacement or schema migration was needed.

## D. JWT security and ownership verification

Local tests generate ES256 keypairs and tokens, inject a local key set, and exercise the **production** `SupabaseTokenVerifier`. They cover valid signatures and UUID subjects, required issuer/audience/expiration/subject claims, expired tokens, wrong issuer/audience, forged signatures, malformed tokens, unknown key IDs, unsigned and HS256 algorithm confusion, future `nbf`, invalid claim types and configured-key isolation from untrusted `jku`/embedded `jwk` headers. Newly added malformed numeric-date claim cases already rejected correctly; no fix to signature/claim verification was claimed for those passing cases.

Two locally signed subjects also traverse the actual FastAPI dependencies, PUT, GET, history and POST. Ownership is derived from the verified JWT; injected body owner fields do not control it. The other subject cannot see the first subject's plan/history or lose funds through that subject's purchase. These tests use an in-memory financial repository and establish **LOCAL CRYPTOGRAPHIC / API ISOLATION PASS**, not real Supabase account isolation.

SDK transport tests inspect the real query builder's outgoing requests: plan reads filter `user_id`, upsert conflicts on `user_id` with a trusted owner, history filters both owner and plan and orders newest first, and confirmation passes only the four existing RPC arguments. The server credential is used only by the backend SDK. Returned rows are checked again before serialization because the server credential bypasses RLS.

## E. Exact HTTP contracts and financial behavior

| Operation | Verified behavior |
|---|---|
| GET `/api/health` | Public HTTP 200, `{status: "ok"}`. |
| GET `/api/plans/current` | Bearer required; HTTP 200 `{plan}` or true 404 `PLAN_NOT_FOUND`. |
| PUT `/api/plans/current` | Five existing camelCase fields; exact integer source cents and ISO date; HTTP 200 `{plan}`. Updates preserve the current plan ID. Unknown owner fields remain ignored by the service whitelist. |
| GET `/api/plans/current/purchases` | Bearer and current plan required; HTTP 200 `{purchases}` including an empty array; owner/plan-scoped history. |
| POST `/api/plans/current/purchases` | Existing name/amount/UUID body; HTTP 201 `{purchase,plan,replayed:false}` for a new confirmation, HTTP 200 with `replayed:true` for replay. |

Errors retain exactly `{error:{code,message}}`. HTTP tests cover missing/malformed/invalid bearer for every financial operation, 404 absence, 409 business rejection, 422 invalid input, 503 provider/response failures and safe messages without raw provider details. CORS allows only the configured origin, permitted methods and bearer/content-type headers, with no cookie credential reliance.

Source cents remain 0–100000000 and purchase cents 1–100000000. Response cents and replay flags no longer accept coercible strings/floats/booleans. Protected totals can legitimately reach **300000000 cents**, because three independently bounded protected fields are added; that is preserved rather than incorrectly capped at one source field's limit.

Tests verify canonical 95000/45500/18000/10000 → protected 73500 and runway 21500; confirmed 16000 → returned funds 79000 and runway 5500; exact runway purchase 21500 → zero runway; excess 30000 → rejection; shortfall 65000 versus 73400 → 8400; zero, one-cent and maximum-field boundaries. All arithmetic uses validated integers.

## F. Idempotency, transaction boundary and uncertainty

Production confirmation still delegates to the existing restricted `confirm_purchase` RPC. No Python sequence was added to insert purchases or deduct funds separately. The caller's UUID and normalized payload are forwarded unchanged; C3 creates no keys and adds no automatic application-level purchase retry.

Offline lifecycle tests prove the API returns one purchase/deduction in its **test repository**, replays the same key at 200, rejects changed name/amount and cross-user key reuse at 409, returns the current authoritative plan, and exposes only own history. Excess rejection leaves mock state unchanged. SDK tests verify RPC transport and exact PostgreSQL business-error mapping.

If RPC response validation fails, the database operation may already have committed. The API returns 503, so existing C2 preserves the original payload/key and treats the result as uncertain. The backend does not assert rollback, manufacture a successful response or retry using a different key.

The applied SQL's transaction/idempotency control flow was inspected without editing or executing it. **Actual PostgreSQL atomicity, rollback, concurrent serialization and browser-role denial were not executed in C3.** In-memory outcomes and mocked SDK responses cannot establish those live guarantees. They remain later opt-in verification.

## G. Focused test additions and repairs

Added **126** local cases:

- `test_repository.py`: **8**, using the installed SDK with HTTP MockTransport for empty plans, trusted owner/query/RPC parameters and provider/business failures.
- `test_security_hardening.py`: **29**, covering production JWT verification, Auth provider failure semantics and two signed subjects through HTTP dependencies.
- `test_api_hardening.py`: **89**, covering exact envelopes, auth/ownership, strict cents/date/name/UUID input, canonical and boundary calculations, replay/mismatch/excess, corrupt/foreign responses, CORS and OpenAPI.

The existing **24** tests, including the shared frontend fixture validation, remain unchanged and passing. The two hosted integration cases remain explicit skips.

An autouse local-test guard denies provider network connections; MockTransport and local key sets are required. The initial guard also blocked Windows asyncio's internal loopback socketpair. That test-infrastructure error was corrected to permit its loopback `socket.connect` while retaining external connection denial. No provider request was performed to resolve it. Focused failing regressions were reproduced before the corresponding production fixes and passed afterward.

## H. Actual final quality results

| Check | Result |
|---|---|
| `.venv/Scripts/python.exe -m pytest backend/tests -q` with live opt-in disabled | **150 passed, 2 skipped, 0 failed**, 2.15s; exit 0. One existing Starlette/httpx deprecation warning. |
| `npm test` | **117 passed**, 8 files, 0 failed/skipped; 25.10s; exit 0. |
| `npm run lint` | **PASS**, exit 0. |
| `npm run build` | **PASS**, exit 0; 494 modules, main JS 642.23 kB / 187.73 kB gzip. Existing non-failing chunk-size warning. |
| `.venv/Scripts/python.exe -m compileall -q backend api` | **PASS**, exit 0. |
| `.venv/Scripts/python.exe -m pip check` | **PASS**, exit 0; no broken requirements. No dependency changes. |
| Actual Uvicorn through `api.index:app`, without provider credentials | Health HTTP 200; OpenAPI three paths/five operations; missing bearer HTTP 401. Process started/stopped successfully; no financial/cloud request. |
| Existing C2 browser regression | **PASS at 390, 768, 1024 and 1280px**, exit 0; six screens, navigation/layout, keyboard, pending/error and stable-retry checks. Test-only Auth/intercepted API; zero page errors/overflow. |
| Production bundle secret check | **5 files checked, 0 unsafe paths**; actual local private-value equality, credential patterns and test-only markers. |
| Candidate/staged source secret check | **0 flagged paths**, no staged blobs. Credentials were never printed. |
| Git ignore and preservation | Both populated environment files ignored; 51 preservation hashes unchanged; initial SQL unchanged; index untouched. |

The C2 browser verifier was rerun as a regression, not as a new C4 implementation or live full-stack test. Its [machine evidence](evidence/c2/browser-results.json) remains explicitly marked offline.

## I. Remaining risks and C4 readiness

No reproduced C3 local defect remains unresolved. This gate does not certify hosted behavior or the whole application's security. P2B remains partial at the existing test-email confirmation/mail-delivery checkpoint; no new sign-in attempt was made. Real Auth, database persistence/isolation, rollback/concurrency and deployment require separately authorized later verification. Skipped tests are not counted as live passes.

The existing frontend chunk-size warning, previously documented C1 dependency advisories and backend test-client deprecation warning remain. This backend phase did not introduce dependency upgrades or weaken validation to hide warnings. The financial plan remains an editable snapshot; no ledger/reconciliation feature was invented.

**Ready for C4: YES**, for the master plan's local simulation/browser acceptance work. Preserve C1/C2 source and the hardened contracts, retain mock/live distinctions, and do not begin cloud verification without the later authorization and account setup. No C4 implementation, push or deployment started.

**C3 CODE PASS — READY FOR C4**
