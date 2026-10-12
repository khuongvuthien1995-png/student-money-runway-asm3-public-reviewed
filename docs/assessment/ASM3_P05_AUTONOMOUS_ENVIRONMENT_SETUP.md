# ASM3 P0.5 Autonomous Environment Setup

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P0.5 — environment and cloud onboarding
> Evidence date: 2026-10-11 (Australia/Sydney)
> Scope: Local discovery and safe configuration preparation only. No accounts, cloud resources, credentials, database objects, commits, pushes, or deployments were created.

## 01. Executive Setup Verdict

**P0.5 AUTO-SETUP PARTIAL — HUMAN ACTION REQUIRED.** Local development prerequisites are installed and the repository received safe secret/virtual-environment preparation. This session has PowerShell, web research, and existing Playwright, but no authorised interactive browser/computer control, GitHub/Supabase/Vercel connector, or authenticated provider CLI. Cloud account identity, terms, OAuth, account selection and project creation therefore cannot be completed by Codex in this session.

## 02. Automation Capabilities Actually Available

| Capability | Actual result | Evidence |
|---|---|---|
| PowerShell/terminal | PASS | version, Git, secret and configuration checks executed |
| Existing browser automation | PASS, project-local only | Playwright verifier previously ran against local Vite app |
| Web research | PASS | official provider documentation can be read; it cannot create/account-manage resources |
| Interactive browser/computer use | BLOCKED | no authorised browser/computer tool exposed in this session |
| GitHub/Supabase/Vercel connector | BLOCKED | no provider connector/tool exposed |
| GitHub/Vercel/Supabase CLI | NOT INSTALLED | `Get-Command` found none |

## 03. Local Tools and Verified Versions

| Tool | Result |
|---|---|
| OS | Windows 11 Home, 64-bit, 10.0.26100 |
| Node/npm | v24.19.0 / 11.17.0 |
| Python/launcher/pip | 3.12.5 / 3.12.5 / pip 24.2 |
| Python venv | available; `.venv` not created because no backend dependency exists yet |
| Git | 2.55.0.windows.3 |
| VS Code | 1.141.0 x64 |
| winget | 1.11.430 |
| Git identity | NOT CONFIGURED (name/email empty) |
| root Vite scripts | `dev`, `lint`, `build`, `preview` present |

Python 3.12 is compatible with the selected design and with Vercel’s currently documented default Python runtime. Actual Vercel deployment compatibility is still not verified. [Vercel Python runtime](https://vercel.com/docs/functions/runtimes/python)

## 04. Actions Performed Automatically

| ID | Provider/area | Intended action | Actual outcome | Verification | Status |
|---|---|---|---|---|---|
| ENV-OP-01 | local | inspect OS/toolchain/CLIs | completed | PowerShell version checks | PASS |
| ENV-OP-02 | Git | inspect root, identity, remote and status | root confirmed; identity/remote absent; baseline untracked | `git rev-parse`, `git config`, `git remote -v`, `git status` | PASS |
| ENV-OP-03 | security | inspect ignore policy and likely credential patterns | no credential values found in source scan; `.env*` ignored | `rg` scan and `.gitignore` review | PASS |
| ENV-OP-04 | configuration | add safe environment template | `.env.example` added with blank names only | file inspection | PASS |
| ENV-OP-05 | configuration | ignore Python venv | `.venv/` added to `.gitignore` | file inspection | PASS |

## 05. Human Checkpoints Completed or Pending

No human cloud checkpoint was completed in this session.

| Checkpoint | Why it requires the student | Status |
|---|---|---|
| GitHub account ownership/sign-in | personal account/password/2FA/terms | PENDING HUMAN ACTION |
| GitHub private repository creation and first push | destination/visibility and external source publication | PENDING HUMAN ACTION |
| Supabase sign-in, organisation and project | account choice, terms, project/database password, region | PENDING HUMAN ACTION |
| Supabase Auth settings | account policy and verification/sign-up decisions | PENDING HUMAN ACTION |
| Vercel sign-in/GitHub OAuth | account choice and OAuth repository permissions | PENDING HUMAN ACTION |
| Global CLI installation | material workstation change; requires approval | PENDING HUMAN ACTION |

## 06. GitHub Account and Repository Status

Git works and the repository root is `C:/Dev/BUS4012/student-money-runway-mvp`. There is no configured Git name/email, remote, known GitHub account, commit, or remote repository. All baseline files are untracked; no initial commit was created. Repository `student-money-runway-asm3` is **NOT VERIFIED** and was not created. Intended visibility remains private.

Before any first commit/push: set verified student Git identity; inspect staged content; run a secret scan; confirm the exact private owner/repository; obtain explicit push approval; then verify the GitHub tree after push. Do not publish publicly.

## 07. Supabase Account, Organisation and Project Status

No Supabase account, organisation, project, project reference, region, URL, key, database password, healthy dashboard, or Auth setting could be verified. No project was created. Intended resource is a student-owned personal/free development project named `student-money-runway-asm3-dev`, Australia/Sydney only if available and chosen by the student. No SQL, table, RLS policy, RPC, seed or credential configuration was performed.

## 08. Supabase Auth Configuration Status

**NOT VERIFIED.** The P0 decision remains email/password Supabase Auth with a browser-held publishable key and FastAPI-verified bearer token. Required later inspection: provider availability, email confirmation policy, sign-up policy, redirect URLs, session/JWT signing mode and creation of two student-controlled test users. Do not disable email confirmation or create arbitrary users merely to speed testing.

## 09. Vercel Account and Integration Status

No Vercel account, personal workspace, GitHub integration, accessible repository, environment-variable access or project creation permission was verified. No Vercel project/deployment was created. The P0 topology remains a single repository/project with Vite output and a FastAPI entrypoint; validate it with a health-endpoint preview in P7, not P0.5.

## 10. Environment Variable Policy

| Variable | Use | Classification | Storage |
|---|---|---|---|
| `VITE_SUPABASE_URL` | browser Supabase Auth | publishable | user-controlled `.env.local` / Vercel public env |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser Supabase Auth | publishable, RLS-limited | user-controlled `.env.local` / Vercel public env |
| `SUPABASE_URL` | FastAPI | identifier | local/Vercel server env |
| `SUPABASE_SECRET_KEY` | FastAPI privileged DB access | secret | local/Vercel server env only |
| `SUPABASE_JWKS_URL` | token verification | identifier | local/Vercel server env |
| `ALLOWED_ORIGIN` | local API CORS | non-secret | local server env |

`.env.example` contains blank placeholders only. Never place a secret in `VITE_*`, Git, chat, screenshots, source or `public/`.

## 11. Security Blueprint Corrections

The P0 security contract is confirmed: React never receives a privileged Supabase key and does not directly mutate financial tables; authenticated FastAPI endpoints own mutations; FastAPI verifies bearer identity and enforces ownership even though a server secret can bypass RLS; grants/revokes are designed separately from RLS; the confirmation function is restricted, ownership-checking, atomic and idempotent. Supabase confirms secret keys bypass RLS and must not be exposed in browser code. [Supabase secure data](https://supabase.com/docs/guides/database/secure-data)

JWT algorithm/signing configuration is **NOT VERIFIED** until a real project is inspected. P2 must choose JWKS verification or the supported legacy-token verification path based on that project, not assume an algorithm.

## 12. Git Baseline Status

`.gitignore` already excluded Node output and `.env*`; this P0.5 task added `.venv/`. The root has no commits and all source/doc files are untracked. This is a safe discovery state, not evidence that GitHub has a repository. First proposed commit remains `chore: preserve completed ASM2 frontend baseline`, but it requires a verified identity, repository, staged-content review and explicit approval before push.

## 13. Credential and Secret Audit

The source/configuration pattern scan found no exposed Supabase URL/key, service-role/secret key, or populated environment file. Matches were descriptive documentation and source labels only. No token, cookie, password, access key, database password, browser storage, or credentials were requested, displayed, copied or retained.

## 14. Outstanding Blockers

1. Direct human account authentication/authorisation for GitHub, Supabase and Vercel.
2. Approval to install official GitHub, Vercel and Supabase CLIs if CLI-based onboarding is preferred.
3. Student decisions on GitHub account/repository ownership, private visibility, Supabase personal organisation/project region, database password storage, and Vercel workspace/GitHub permissions.
4. Git name/email configuration before the baseline commit.

## 15. P1 Readiness Matrix

| ID | Requirement | Status | Evidence | Remaining action |
|---|---|---|---|---|
| ENV-01 | Python/pip/venv | PASS | Python 3.12.5, pip 24.2, venv help | create project venv only in P2 if required |
| ENV-02 | Node/npm | PASS | Node 24.19.0/npm 11.17.0 | none |
| ENV-03 | Git | PARTIAL | Git 2.55/root confirmed | set student identity |
| ENV-04 | GitHub account | NOT VERIFIED | no CLI/connector/auth | human sign-in |
| ENV-05 | GitHub repository | NOT VERIFIED | no remote | create/verify private repository |
| ENV-06 | Supabase account | NOT VERIFIED | no connector/auth | human sign-in |
| ENV-07 | Supabase organisation | NOT VERIFIED | no dashboard | choose/create personal organisation |
| ENV-08 | Supabase development project | NOT VERIFIED | no project | create free dev project |
| ENV-09 | Supabase Auth configuration | NOT VERIFIED | no project settings | inspect settings with student |
| ENV-10 | Vercel account | NOT VERIFIED | no connector/auth | human sign-in |
| ENV-11 | Vercel/GitHub connection | NOT VERIFIED | no integration | human OAuth approval |
| ENV-12 | Git baseline | PENDING HUMAN ACTION | untracked root/no identity | review, commit, explicit push approval |
| ENV-13 | Environment/secret security | PASS | ignore policy, blank template, scan | keep real values user-controlled |
| ENV-14 | P0 security addendum | PASS | P0 blueprint and section 11 | apply in P1/P2 |
| ENV-15 | Ready for P1 | PENDING HUMAN ACTION | P1 needs real Supabase project | complete ENV-06–09 |

## 16. Exact Next Task

**Human checkpoint: create or sign in to the student-controlled Supabase account in a normal browser, select/confirm the personal organisation and a free Australia/Sydney development project named `student-money-runway-asm3-dev` (if that region is available).** Complete password, email verification, 2FA, CAPTCHA and terms directly; do not send credentials to Codex. Then confirm only that the project dashboard is healthy and the project reference is visible. P0.5 can then verify non-sensitive project status and continue.
