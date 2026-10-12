# ASM3 P-GIT — source control and reproducibility

> Updated: 2026-10-13 (Australia/Sydney)
> Target: `khuongvuthien1995-png/student-money-runway-asm3`
> State: LOCAL SOURCE VERIFIED; PUBLIC-REPOSITORY AND FIRST-PUSH CHECKPOINTS

## A–B. Repository and author verification

Authenticated Git Credential Manager browser login succeeded. GitHub API verified the exact target owner/repository, PUBLIC visibility, default branch `main`, write permission true, archived false. Remote `ls-remote` returned no branch/history refs. No upload occurred. The user must change visibility to PRIVATE before the first push, then the agent must reverify it. GitHub's email-list API returned 404; author name `Thien Khuong Vu` was supplied by the student. The student explicitly selected the account's GitHub noreply address; it was derived from the authenticated account ID/login and configured locally with the supplied name. No global identity was changed or email guessed.

The existing Git directory was preserved. It originally had an unborn `master` branch, no commits, no remote and all source untracked. The unborn branch now uses the verified remote default name `main`; origin is the exact requested credential-free HTTPS URL. No history was reset, backdated or overwritten.

## C–F. Source inventory

The original candidate inventory comprised 245 files, 10,018,633 bytes: 17 frontend source files; 2 public assets; 21 backend files; 1 ASGI entrypoint; 5 Supabase files; 102 documentation/evidence files; 73 original academic PNG exports; 8 recorder-tool files; 16 root files. The audited initial snapshot now has 250 staged files; see the [complete source inventory](asm3-source-inventory.txt). Curated and original design PNGs are retained as academic reference resources, not imported runtime assets. Screenshots show canonical demonstration values, not the dedicated live accounts' financial records.

Preserved frontend: six existing pages, reusable layout/UI components, types and financial utilities. Preserved backend: configuration, JWT verifier, repository, services, API, local startup/Auth/signup/input helpers, local and opt-in integration tests. Preserved Supabase: reviewed local config, applied migration `20261012020847_initial_schema.sql`, assertion SQL and test runbook. Hosted database contents and local linkage are excluded.

## G. Security review

Before staging, byte-level scanning of all candidates found zero matches for actual ignored local keys/passwords/test emails or secret-key/GitHub/Supabase-token/JWT/password-bearing PostgreSQL URL patterns. Supabase TOML sensitive fields contain empty strings or `env(...)` references, not populated credentials. A demonstration login screenshot was visually reviewed with blank input fields. Token-pattern and equality scanning do not constitute complete optical inspection of every raster image.

Merged missing ignore rules for venvs, Python/tool caches, coverage, generated TypeScript state, temporary files, videos/reports and Git credential files. Actual `git check-ignore` resolution passed for node_modules, dist, virtual environments, Python caches, coverage, populated environment files and Supabase `.temp`. The safe `.env.example` remains includable. Added a reusable scanner that checks working candidates and staged blobs without printing values. No real credentials were found in candidate source; no rotation is indicated by this scan.

`npm ci` initially reported 10 dependency advisories. A non-breaking `npm audit fix --ignore-scripts` updated one package (source-map-js), leaving 9 advisories: 5 high and 4 moderate. Audit exit 1 reflects remaining findings, not an install failure. Remaining fixes offered by npm require major Tailwind/React Router upgrades; these were not forced into the frozen frontend. This is a known security limitation for first-push review, separate from the zero-secret scan. Production or untrusted build inputs require dependency remediation review.

## H–K. Commit, push and clone evidence

The audited comprehensive initial source commit is prepared using the real current timestamp and student-approved local author identity. Commit SHA evidence will be appended after successful execution. No first push is approved or attempted. Remote commit/file verification and the mandatory post-push clean GitHub clone are NOT EXECUTED. Visibility must be PRIVATE and audited commits concrete before requesting first-push approval. No remote PASS is claimed.

## L. Local quality evidence

Workspace `npm ci`, lint and build passed. Python install from `requirements-dev.txt` with the new Windows constraints file passed; `pip check` found no broken requirements; pytest: 19 passed, 2 opt-in live tests skipped, one existing Starlette/httpx warning, 0.98s; compilation passed. Generated builds/caches remain excluded.

New portability work: full root README covering the actual separate frontend/backend state and Windows setup; safe test-variable examples; merged ignore rules; text/binary attributes; 46-entry Windows Python constraints file; reusable staged/working secret scanner; this evidence. Markdown two-space hard breaks in existing academic records are preserved via the whitespace attribute rather than stripped. The staged and working scans each cover all 250 files with zero flagged paths. No React implementation, financial formula, backend business rule, Supabase schema or signing key changed.

A separate no-credential source snapshot was copied into `C:\Dev\BUS4012\asm3-source-check-lhu7gtri` for fresh dependency-install validation while publication is blocked. This is a local pre-publication check, not the mandatory post-push GitHub clone. No populated environment file, node_modules or virtual environment was copied; dependencies were installed anew there. After the actual lockfile patch, fresh `npm ci`, lint and build passed; a newly created Python 3.12 virtual environment installed the constrained development dependencies, `pip check` passed, pytest returned 19 passed/2 skipped/one existing warning in 1.86s, and compilation passed. The real `api.index:app` ASGI process returned health 200, exposed five OpenAPI operations across three paths and rejected missing bearer credentials with 401. No cloud credentials or live financial tests were used. Both populated environment files are absent from this source copy.

## M–N. Remaining application work

P1B database deployment remains the verified baseline. P2B's two real test identities were signed up and are waiting on email confirmation; no valid real-session financial integration, ownership isolation or concurrency PASS exists. This Git task does not perform live financial tests. P3 frontend/backend integration is pending. Vercel deployment, deployment credentials/environment and a reviewed production rollout remain separate future work; no deployment is made here.
