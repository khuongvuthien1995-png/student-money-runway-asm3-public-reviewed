# ASM3 C6 — External verification checkpoint

> Updated: 2026-10-14 (Australia/Sydney)
> LOCAL CODE PASS; external acceptance pending

Continued the actual C0–C5 worktree without restarting implementation. The user authorized C6 terminal execution and local commits while retaining Private-repository, publication, Preview and Production approval boundaries.

## C6-A: GitHub and local source checkpoint

Authenticated Git Credential Manager access verified the exact repository `khuongvuthien1995-png/student-money-runway-asm3`. The authenticated API returns **Public**, default branch `main`, push/admin permissions true and archived false. Remote HEAD/main is `c0422f1fbc20e9da6fc0d3d1edec83d5482b0626`, matching the original local checkpoint; original source was already published externally at some point before this continuation. No new upload was made here.

Preserved approved local identity and original history. Reviewed and scanned 165 staged change paths: no populated env, generated dependency/build directory or credential match. The scanner checked 391 working candidates and 165 staged blobs with zero flagged paths. Created real local commit:

`9d4bb51981c710a310642673ea9070360532d511` — `feat: integrate and verify ASM3 full-stack deployment source`.

This captures C1–C5 source/tests/configuration/evidence, preserving the original two commits. No fabricated phase history or force-push. Publication is withheld until Private visibility is independently verified and required publication approval is obtained. Post-push remote verification and clean GitHub clone remain pending; the C5 fresh-copy result is not a remote-clone result.

Latest regression: frontend **149 passed**, 9 files, 59.79s; backend **171 passed, 2 hosted skipped**, 5.13s, one existing test-client warning. Lint/build/compilation passed; build 494 modules, main 642.55 kB / 187.82 kB gzip with existing size warning. Production bundle: five files, zero unsafe paths. Existing dependency advisories remain documented in C5.

## C6-B: Supabase

Reused existing ignored application/test configuration, with no key retrieval or file recreation. All four account fields are populated. Real password login attempts for User A and B both return HTTP 400 `email_not_confirmed`; response bodies/tokens/identities were not printed. No signup, resend, confirmation bypass, financial fixture creation or hosted financial test was performed. Live write authorization exists in the earlier controlled integration request, but verified user sessions are still unavailable.

Supabase CLI 2.120.0 is available. Reviewed the public changelog index; no database or security setting was changed. **SUPABASE LIVE PASS is not established.** Normal email confirmation/mail delivery remains the checkpoint.

## C6-C/D: Vercel

Installed official Vercel CLI globally through npm, version 63.1.2; repository dependency manifests were not changed. Existing credentials were unavailable. The read-only context check initiated normal device authentication, which remains pending; no project link or deployment was performed. A CLI worker timed out and emitted EPIPE during session lookup, so no successful authenticated context is claimed.

Human device approval is required. After authentication, inspect actual available owner/project before linking or modifying it; never infer a target from login alone. Preview requires explicit approval; Production requires separate approval. Neither Preview nor Production PASS is established.

## Current checkpoints

1. Change the exact GitHub repository to Private; independently verify it, then obtain publication approval for the audited commits before pushing.
2. Complete normal confirmation for both existing test accounts; verify real login before the authorized controlled live suite.
3. Complete Vercel device login; verify actual project/owner and prepare a concrete Preview checkpoint before approval/deployment.

No reset, migration change, hosted financial write, security bypass, new push or deployment occurred. Existing credentials and completed source are preserved. The Supabase and Vercel CLI skills guide session/target checks; unavailable plugins do not block terminal work.

## Authorized checkpoint continuation — 2026-10-14

The user explicitly authorized changing only the target repository's visibility. Authenticated GitHub API PATCH returned HTTP 200; a separate GET independently verified `khuongvuthien1995-png/student-money-runway-asm3` is **PRIVATE**, default `main`, push permission true. No other repository was changed. Remote main remains `c0422f1fbc20e9da6fc0d3d1edec83d5482b0626`. Local implementation commit `9d4bb51981c710a310642673ea9070360532d511` is prepared; publication approval is now requested for that source plus this safe checkpoint record. No push occurred.

The user requested safe resends without recreating accounts. Read-only Auth listing matched exactly one existing identity per configured address, both unconfirmed. One normal `/auth/v1/resend` signup request per identity returned HTTP 400 **`email_address_invalid`**. Therefore no successful send or inbox delivery is claimed. Local format checks pass and neither address uses the tested reserved/example-domain forms; that does not establish why Supabase rejected them. No password, account, confirmation policy or SMTP setting was changed. Live financial tests remain pending. Do not instruct the student to open emails that were not sent. The supported resend operation is documented in [Supabase Auth resend](https://supabase.com/docs/reference/javascript/auth-resend).

Despite the student's browser-login report, a fresh Vercel `whoami --format json` returns `loggedIn:false`. The CLI initiated a new device flow, awaiting human approval before teams/project inspection can complete. No account, workspace or linked target is yet verified. The new device checkpoint was presented; no link/deployment operation was authorized or executed. The user's approval remains required before Preview, and separate approval before Production.

Current working-candidate scan: 392 files, zero staged blobs and zero flagged paths. GitHub privacy is resolved; push approval, persisted Vercel authentication and Supabase resend/mail handling remain separate checkpoints.

## Approved publication and verified clean clone — 2026-10-14

The user approved the audited push. Private visibility and push permission were independently rechecked immediately before publication. `git push origin main` succeeded without force, publishing source commit `9d4bb51981c710a310642673ea9070360532d511` and checkpoint commit `9293da928425ffbfc0ac11127ce26fbc9989cdbe` (`docs: record verified C6 privacy and authentication checkpoints`). Remote main and a fresh GitHub clone both resolve to `9293da928425ffbfc0ac11127ce26fbc9989cdbe`.

The clone was created outside the working repository, with no copied dependencies or credentials. Verified README, frontend, API entrypoint, backend, requirements, Vercel configuration, migration and tests exist; populated environment files are absent. Installed dependencies from the committed lockfiles and created a new Python 3.12 environment. Actual results: frontend **149 passed**, nine files, 43.66s; backend **171 passed, two hosted skipped**, 4.42s; lint/build, Python compilation and dependency consistency passed. Production bundle scan: five files, zero unsafe paths. Repository scan: 392 candidates, zero flagged paths. Existing nine npm advisories, chunk-size warning and test-client warning remain. The clean clone worktree is clean. **GITHUB REMOTE PASS — CLEAN CLONE VERIFIED.**

## Verified Vercel preparation — deployment approval pending

Persisted CLI authentication now verifies account `khuongvuthien1995-png` and workspace `khuong-projects`. Read-only listing found no existing projects. Created and explicitly linked only `student-money-runway-asm3`; project inspection verified its owner and root directory. Configured and re-inspected Vite framework, `npm ci`, `npm run build`, `dist` and Node 24.x.

Configured eight variables for **Preview only**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`, `SUPABASE_JWT_ISSUER`, `SUPABASE_JWT_AUDIENCE`, `SUPABASE_AUTH_VERIFICATION_MODE`. Existing local values were transferred through process stdin, with no credentials printed. The server key uses Vercel's Secret type; no server credential was assigned to a browser variable. Production variables were not configured. The exact Preview HTTPS origin remains to be established after an approved deployment before origin-specific verification.

Vercel linking added a local OIDC credential to the existing ignored environment file; existing Supabase fields remained present. Redundant automatically appended ignore rules were removed to preserve the `.env.example` exception. Local environment and `.vercel` files remain ignored. No Preview or Production deployment has occurred. Preview approval is required by the user's explicit C6 policy; Production remains a separate approval.

Supabase remains pending: both original users were unconfirmed and both supported resend requests failed with `email_address_invalid`. No financial tests, account recreation, password changes, SMTP changes or confirmation bypass occurred. No successful mail delivery is claimed. Completed GitHub work and Vercel preparation do not establish Supabase live or Vercel deployment PASS.

## Approved Preview release and HTTPS verification — 2026-10-14

The user explicitly approved Preview deployment and verification, retaining the separate Production boundary. The first command used `--target preview`, but Vercel assigned the new project's first deployment to **production**. Inspection confirmed this unexpected target on `dpl_9SVmWXSxrLquKZwgR429XkLWEkTo`; its build failed and it never reached READY. This was reported immediately. No successful Production release or Production acceptance is claimed. The failed attempt is retained as evidence rather than concealed.

The remote Python builder could not parse the included constraints file in `requirements.txt`. Replaced that inclusion with self-contained exact production pins matching the existing lockfile, excluding test-only dependencies. Updated README and the deployment regression to verify each production pin belongs to the lockfile. No dependency version, financial code, Auth contract, frontend screen or migration was changed.

The next attempt was independently verified as Preview and READY. Configured a dedicated Preview alias and its exact `ALLOWED_ORIGIN`, then rebuilt and independently verified final deployment **`dpl_HtZGGzGuPuQWroSH7khbZb9q9hyj`**, target **preview**, state **READY**, Python **3.12**, Node **24.x**, Linux build duration **35.415 seconds**. Its immutable URL is `https://student-money-runway-asm3-77urvmi5o-khuong-projects.vercel.app`; dedicated alias: **https://student-money-runway-asm3-preview.vercel.app**. Nine environment variables apply only to Preview. Vercel Authentication remains enabled. No Git auto-deployment connection was created.

Actual HTTPS checks: **14 passed** — health 200/exact JSON, no-store API caching, six SPA routes, all four financial operations rejecting absent bearer with the expected 401 envelope, exact Preview CORS, and unknown API JSON 404. These write-method rejection probes contained no valid authentication and performed no financial mutation. `vercel curl` used existing authentication and generated a project protection bypass credential without printing its value; access controls were not disabled.

Actual deployed Chromium checks: **four widths (390/768/1024/1280)**, six anonymous route checks each, signup/sign-in view toggles, zero horizontal overflow, zero page exceptions and zero financial writes. No signup/login form was submitted. Browser requests used the existing short-lived OIDC credential scoped only to the exact Preview origin. A deployed JS/CSS scan checked **two assets, zero unsafe paths** against local private values and credential patterns. An initial broad pattern flagged the bare `sb_secret_` validation-code prefix; requiring an actual credential-shaped suffix correctly distinguishes that nonsecret code literal. Error-log query for this deployment over one hour returned exit 0 and **zero error entries**; this limited query is not an uptime guarantee.

Post-fix local checks: **149 frontend passed**, **171 backend passed, two hosted skipped**, lint/build/compile/pip consistency passed. Existing warnings remain. Added `tools/verify-preview-http.py` and `tools/demo-recorder/verify-c6-preview.mjs`; evidence includes HTTP/browser results, error-log summary, deployed asset scan and four anonymous login screenshots under `evidence/c6/`. No tokens or populated configuration are written into evidence.

**VERCEL PREVIEW PASS — HTTPS ROUTING AND ANONYMOUS UI VERIFIED.** Real authenticated cloud persistence, ownership, transactions and concurrency remain unverified at the Supabase email checkpoint. **SUPABASE LIVE PENDING; VERCEL PRODUCTION NOT APPROVED / NOT VERIFIED.**
