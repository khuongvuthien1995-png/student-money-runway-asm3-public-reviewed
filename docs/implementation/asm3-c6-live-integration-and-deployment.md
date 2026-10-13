# ASM3 C6 — Live Preview Auth hotfix

> Updated: 2026-10-14 (Australia/Sydney)
> Verification in progress; no signup or confirmed-login PASS claimed

## Reproduced root cause

Read the supplied Auth hotfix request and actual Supabase client, adapter, provider, LoginPage, entrypoint and public environment types. The production SDK initializes from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; unsafe or missing configuration produces a separate configuration error. The real Preview browser had no initial Auth error and sent an actual signup request to `https://mnjmugwkjtihqswssiwa.supabase.co/auth/v1/signup`. One existing, student-authorized test identity was used; no arbitrary identity or request interception was introduced.

The real provider response was **HTTP 429 / `over_email_send_rate_limit`**. The adapter lacked this code's message and therefore displayed the generic “Authentication is unavailable. Please retry.” The SDK itself was initialized and the request reached the correct project. This establishes a provider email-rate-limit rejection plus a reproduced frontend error-reporting defect, not missing public configuration or a CORS failure. The browser reported zero JavaScript exceptions and zero failed requests; one console error corresponds to the rejected HTTP request. Raw bodies, submitted credentials, tokens and account addresses were not retained.

## Preview and provider configuration

Verified Vercel account/workspace/project in the preceding C6 checkpoint: `khuongvuthien1995-png`, `khuong-projects`, exact project `prj_AlYUIbncfbSBJfCibzimnQ2xyyWv`. API inspection confirms both public variables are Preview-scoped with no branch restriction. Authorized read-only comparisons of their values against ignored local configuration both match. Variables predate the deployed Preview build; successful real Auth transport further establishes their runtime availability. Backend URL/server-key variables exist separately in Preview; the server key is not assigned to a `VITE_` variable.

Read-only Supabase checks: public Auth settings 200, JWKS 200/one ES256 key, email provider enabled, signup enabled, email confirmation required. Hosted config diff shows Site URL `http://localhost:3000`, no allowed redirect URLs, and email-send rate value 2 matching local CLI configuration. SMTP host/enabled status is not established by these CLI projections; the 429 is actual send-limit evidence, not proof of which mail service is configured.

Requested explicit approval for only Site URL `https://student-money-runway-asm3-preview.vercel.app` and redirect allowlist entry `https://student-money-runway-asm3-preview.vercel.app/login`. No provider setting was changed while that approval remains pending. The frontend message repair does not remove this separate confirmation-link configuration checkpoint.

## Focused source repair

`src/auth/authAdapter.ts` now maps `over_email_send_rate_limit`, `email_address_invalid` and `email_address_not_authorized` to safe, actionable messages. It preserves provider error codes, does not display raw provider details and does not fake success or a session. Added three real-adapter delegation regression cases in `src/auth/authAdapter.test.ts`. Added `tools/demo-recorder/verify-c6-auth.mjs` to exercise real HTTPS Auth with an explicitly supplied existing test identity; credentials stay in process memory, and evidence includes only status/code/origin and safe UI feedback. No Supabase requests are intercepted.

The earlier public-access hotfix also extends the existing Preview browser runner for credential-free checks and adds separate public evidence. Supabase Auth/JWT/RLS, six screens, API contracts, financial formulas and deployed migration remain unchanged.

## Local regression

Frontend: **152 passed**, nine files, 5.35s. Backend: **171 passed, two hosted skipped**, 3.84s. Build, Python compilation and both secret scans passed. Initial new-tool lint failed because its URL global was undeclared; after the focused declaration fix, lint passed. Existing local deployment checker: **24 passed**. Main bundle warning, previously recorded dependency advisories and backend test-client warning remain.

Signup and confirmed login remain unverified pending provider email delivery/confirmation. No financial records, migration execution, Production deployment or security bypass occurred. Final deployed repair and live retest results will be appended below.
