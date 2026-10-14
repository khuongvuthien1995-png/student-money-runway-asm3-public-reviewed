# ASM3 C6 — Live Preview Auth hotfix

> Latest 14 October reassessment: custom SMTP is paused. A new organization-member account has confirmed email and a recorded login event. A/B remain unconfirmed nonmembers. See [current read-only evidence and limitations](asm3-c6-auth-readonly-reassessment.md); earlier blanket-blocker statements below are historical.

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

## Published fix and actual live retest

Audited, committed and pushed source fix **`08c2f38d97b3c580fcf73f3b6e2808d609c79ae9`** (`fix: report live Auth email delivery errors accurately`) after independently verifying GitHub remains PRIVATE. Deployment API metadata records this exact Git commit. Independent inspection verifies **`dpl_2rZ463Uvk5Ad3kcaEvrXG11UKrAy`**, target **Preview**, state **READY**; immutable URL `https://student-money-runway-asm3-24pijimjx-khuong-projects.vercel.app`. Assigned the existing alias **https://student-money-runway-asm3-preview.vercel.app** only after READY verification. No Production deployment was created.

One post-fix real signup attempt using the same authorized existing identity returned **429 `over_email_send_rate_limit`**, and the real UI now reports “Verification email sending is rate-limited. Please wait before retrying. Contact the project owner if this continues.” No confirmation-success state or session was fabricated. One real password-login check returned **400 `email_not_confirmed`**, displayed as “Confirm your email before signing in.” Both journeys have zero initial configuration alerts, zero JavaScript exceptions and zero failed transport requests. Each has one console error from its expected rejected HTTP response. Supabase requests were not intercepted. These are provider rejection results, not signup or confirmed-login PASS.

Real unauthenticated HTTPS checks after alias update: login HTML 200, health exact JSON 200, missing-bearer plan 401. Two deployed browser assets load successfully; their bytes contain the intended project URL, expected public key and new rate-limit message. Equality scanning against actual local private values found **zero private matches**. No raw credentials were printed or saved in evidence. The clean GitHub clone was fast-forwarded to the source fix; its four Auth adapter tests and lint passed.

Sanitized live evidence: `evidence/c6/auth-signup-before-hotfix.json`, `auth-signup-results.json`, `auth-login-results.json`, `auth-preview-https-results.json`. No screenshot, network trace, storage state, password or session token from a submitted account form is retained.

## Remaining C6 checkpoints

The local and deployed error-reporting defect is repaired. The real provider continues rejecting signup because its email-send limit is reached. No SMTP credential was retrieved, no SMTP cause was established, no quota setting was changed and no repeated automatic signup loop was introduced. Email-confirmed login stays pending; hosted financial verification remains unexecuted.

The exact Supabase Site URL/redirect update remains pending the approval requested under Step 4. Current localhost Site URL and empty redirect allowlist must not be described as corrected. Email confirmation, backend JWT checks and database RLS remain enabled. C7 was not started.

**C6 PREVIEW AUTH BLOCKED — VERIFIED ROOT CAUSE**: Supabase `over_email_send_rate_limit`; existing account login remains `email_not_confirmed`. This verdict does not negate the verified public Preview/routing gate or the repaired source error message.

## Approved Auth URL correction — 2026-10-14

The user approved the exact Site URL and redirect changes. An initial isolated CLI config diff included unrelated defaults; it was rejected before any push. Pulled the current hosted configuration into an ignored temporary directory under `.git`, changed only the two URL fields, and verified the diff contains exactly `auth.site_url` and `auth.additional_redirect_urls`. Official CLI config push exited 0. Independent readback against both the temporary configuration and original workspace confirms Site URL **https://student-money-runway-asm3-preview.vercel.app** and redirect allowlist **https://student-money-runway-asm3-preview.vercel.app/login**.

Public Auth settings returned 200 with signup enabled and automatic confirmation disabled; required email confirmation remains enabled. No SMTP, mail quota, MFA, database, storage or other provider setting was changed. The repository's local Supabase configuration was not overwritten. Evidence: `evidence/c6/auth-url-settings-results.json`. Real public Preview checks still return login 200, health 200 and missing-bearer financial API 401. No redeployment or hosted financial write was needed.

The URL approval checkpoint is now resolved. No new signup/email-send request was made merely to verify these settings. The previous actual rate-limit rejection and unconfirmed-account checkpoint remain pending; URL correctness does not prove email delivery or confirmed login. **C6 PREVIEW AUTH BLOCKED — VERIFIED ROOT CAUSE** remains the honest live Auth verdict until a successful provider signup/confirmation/login result is obtained.

## C7 continuation — definitive SMTP inspection

The user requested autonomous email-delivery diagnosis while independent C7 work continued. Reused the existing official CLI session credential from its exact Windows Credential Manager entry, captured only in process memory, to call the supported read-only Management API. Project identity/status verified: `mnjmugwkjtihqswssiwa`, ACTIVE_HEALTHY. Auth configuration confirms no SMTP host/user/password/sender and no email-send hook; built-in email quota **2/hour**, minimum mail interval **60 seconds**, signup enabled and automatic confirmation disabled. Approved Site URL/redirect values remain correct.

Read-only organization membership comparison confirms **neither existing test address is an organization-member address**; addresses and other identities were not printed. Supabase's [official SMTP documentation](https://supabase.com/docs/guides/auth/auth-smtp) states that the built-in sender only permits organization-member addresses; its [rate-limit documentation](https://supabase.com/docs/guides/auth/rate-limits) gives the built-in two-email/hour limit. This combination explains the observed recipient rejection and independently observed `over_email_send_rate_limit`; waiting alone does not remove recipient restrictions. No inbox delivery or SMTP bounce is claimed.

Prepared the smallest safe repair: connect an authorized external SMTP service using a verified sender and provider-issued SMTP credentials. Required settings are `smtp_host`, `smtp_port`, `smtp_user`, `smtp_pass`, `smtp_admin_email`, `smtp_sender_name`; email quota 30/hour is proposed only within the selected provider's allowance and pending approval. Keep confirmation, existing accounts/passwords, JWT/RLS and financial data unchanged. No existing SMTP credentials are available, and no provider account/subscription was created. Requested only the necessary provider-setup authorization/selection; no secrets in chat. SMTP changes have **not** been applied while that checkpoint is pending.

Sanitized definitive configuration evidence: `docs/assessment/c7/evidence/email-delivery-diagnosis.json`. C7 can complete documentation/raw anonymous captures independently, but real Auth, financial acceptance and the complete live demo remain pending.

The user subsequently authorized free custom SMTP setup. Selected low-volume Gmail SMTP, prepared ignored private-entry fields and a guarded SMTP-only tool. Nine focused safety tests and the full **180-pass/two-hosted-skip** backend regression passed. No SMTP patch or send has occurred: Google app-password verification/private entry is still required. See [SMTP preparation and human checkpoint](asm3-c6-smtp-repair.md). Prior references to pending setup authorization are historical; authorization is now granted, credentials are missing.


Latest read-only final acceptance: [current per-workflow matrix](asm3-c6-final-live-acceptance.md). Personal records remain unchanged; writes are not authorized. Password sign-ins are user-reported and still require observer corroboration. SMTP remains paused.
