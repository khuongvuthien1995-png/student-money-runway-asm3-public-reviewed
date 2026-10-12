# Real development-project integration tests

Target only: `mnjmugwkjtihqswssiwa` (`student-money-runway-asm3-dev`). Tests refuse another URL/link, missing schema assertions, duplicate identities, or users with existing financial rows. Normal `pytest backend/tests -q` skips live tests.

The student configures the ignored root `.env.local` with the project's server secret key and publishable key. The URL is already set to the verified project. Backend configuration uses JWKS; derived issuer is `<SUPABASE_URL>/auth/v1`, audience is `authenticated`. The student also fills `.env.live-tests.local` with `TEST_USER_A_EMAIL`, `TEST_USER_A_PASSWORD`, `TEST_USER_B_EMAIL`, and `TEST_USER_B_PASSWORD`. Use two distinct, dedicated, confirmed email/password accounts. Never put credentials in chat or committed files. Quote dotenv passwords containing spaces or `#`.

If the accounts do not exist, the student can submit normal signups in their own terminal after filling the files:

```powershell
.venv/Scripts/python.exe -m backend.register_test_users --signup
```

This utility uses only the publishable key and preserves email confirmation. Complete both verification emails in your browser. Handle CAPTCHA, MFA or signup restrictions directly without disabling security. Existing confirmed accounts do not need signup. The agent has not executed this command.

From the repository root:

```powershell
.venv/Scripts/python.exe -m backend.dev --check
.venv/Scripts/python.exe -m backend.inspect_auth
.venv/Scripts/python.exe -m backend.dev
```

The launcher explicitly loads `.env.local` before constructing the app; this file overrides process variables for deterministic local startup. It validates the project, credential presence/type, JWKS mode/URL, issuer and audience without printing values. It binds only to loopback and disables access logs. `python-dotenv` is an explicit dependency and is also provided by `uvicorn[standard]`.

The opt-in suite starts and stops its own Uvicorn process. Do not use `--showlocals`, HTTP debug logs or request tracing when credentials are loaded. Use concise failure output:

```powershell
$env:RUN_SUPABASE_LIVE_TESTS = '1'
try {
    .venv/Scripts/python.exe -m pytest backend/tests/integration -v -x --tb=no
} finally {
    Remove-Item Env:RUN_SUPABASE_LIVE_TESTS -ErrorAction SilentlyContinue
}
```

The suite signs in through real Supabase password authentication, keeps session tokens in memory, and uses the production verifier with hosted JWKS. It checks real signature rejection and missing/malformed bearer rejection; issuer/audience mismatches use an authentic token with mismatched verifier configuration; expiry uses that authentic token with verifier time advanced past its actual expiration. Tokens are not modified to impersonate valid users.

Financial tests use actual HTTP requests and independently query committed state via the server-only Data API. Coverage includes no-plan, save/retrieve/update, canonical calculations, client-supplied owner rejection/ignoring, purchase/history, idempotency, changed replay, cross-user replay, excess rejection, exact boundary, and real simultaneous HTTP confirmations through a thread barrier. Atomic rollback is checked by invoking the existing RPC inside a PostgreSQL subtransaction, deliberately raising division-by-zero after successful insertion/deduction, and checking unchanged state; the outer transaction also rolls back. No migration is changed.

The suite checks browser-role Data API read/write and RPC denials. Reviewed catalog assertions independently verify RLS and constraints. It does not grant browser permissions temporarily to test policies. The suite cleans only plan IDs created during this run, with an additional owner filter; purchase cleanup follows the existing cascade. Cleanup is checked. If a transport failure leaves an uncertain fixture, inspect the dedicated accounts directly before another run; the pre-existing-data guard prevents blind reuse.

The test accounts remain intact. Signup, email confirmation, passwords, CAPTCHA, MFA and identity-sensitive steps are handled by the student. A password login blocked by these controls is a setup checkpoint, not a reason to disable security.

The direct database test transport sends new secret keys on `apikey`, with no secret-key bearer header, as required by [Supabase's API key guidance](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys). Legacy service-role JWTs retain their bearer header. The actual backend SDK transport will be verified by the live suite after configuration.

Never report this suite passed merely because it was collected or skipped. Record the actual opted-in result separately from local cryptographic and mock tests.
