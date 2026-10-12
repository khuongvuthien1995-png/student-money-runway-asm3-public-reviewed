# ASM3 P0.5B Cloud Onboarding Verification

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P0.5B — cloud onboarding completion
> Evidence date: 2026-10-11 (Australia/Sydney)
> Scope: Verified local Git/environment readiness and attempted supported cloud access only. No account, repository, project, credential, table, deployment, commit, or push was created.

## 01. Executive Verdict

**P0.5B PARTIAL — CLOUD SETUP STILL PENDING.** Local tool prerequisites and safe environment configuration are ready. The required cloud identity/account operations could not be performed: this session exposes no provider connector, authenticated GitHub/Vercel/Supabase CLI, or authorised interactive browser/computer control. An attempted normal-browser launch for `https://supabase.com/dashboard` was rejected by the environment GUI policy. No account state is fabricated.

## 02. Verified Local Git Readiness

| Check | Result | Evidence |
|---|---|---|
| Repository root | PASS | `git rev-parse --show-toplevel` → `C:/Dev/BUS4012/student-money-runway-mvp` |
| Git installation | PASS | Git 2.55.0.windows.3 |
| Git name/email | PENDING HUMAN ACTION | both values are unset; no identity was invented |
| Remote | NOT VERIFIED | `git remote -v` returned none |
| Existing commit/history | NOT VERIFIED | supplied root remains entirely untracked |
| First commit/push | PENDING HUMAN ACTION | requires identity, staged review, private remote and explicit publication approval |

## 03. Supabase Account and Project

| Operation ID | Intended action | Actual outcome | Verification | Status |
|---|---|---|---|---|
| SB-01 | discover authorised provider access | no Supabase connector or CLI available | tool/CLI discovery | BLOCKED |
| SB-02 | open official dashboard | `Start-Process https://supabase.com/dashboard` rejected by environment GUI policy | terminal policy result | BLOCKED |
| SB-03 | verify personal organisation/project | no authenticated evidence available | none | NOT VERIFIED |

No Supabase account, organisation, project, project reference, health state, selected region, database password, key or credential is known. `student-money-runway-asm3-dev` has not been created by Codex. No SQL, table, RLS policy, function, data, or Auth setting was changed.

## 04. Supabase Authentication Settings

**NOT VERIFIED.** Required human dashboard review before P2: Email/Password provider availability; sign-up policy; email-confirmation policy; allowed redirect URLs; and JWT signing configuration. The architecture baseline remains Email/Password Supabase Auth, publishable browser configuration, and FastAPI verification of authenticated tokens. It must use the actual project’s supported signing configuration, not an assumed algorithm.

## 05. GitHub Account and Repository

`gh` is not installed and no GitHub connector/authentication is available. No GitHub account, owner, private `student-money-runway-asm3` repository, visibility, remote URL, access token, or remote file tree is verified. No duplicate-repository check could be performed without a verified account. No project source was published.

## 06. First Baseline Commit

Not started. The proposed commit message remains `chore: preserve completed ASM2 frontend baseline`. Before that operation: the student must confirm their Git commit name/email; a secret scan and staged-content review must pass; the student must confirm the intended private repository; and the student must explicitly approve first external push. `node_modules`, `dist`, `.venv`, populated environments and credentials must remain excluded.

## 07. Vercel Account and Integration

`vercel` is not installed and no Vercel connector/authentication/browser control is available. No Vercel account, workspace, GitHub integration, accessible repository, environment-variable access, project, plan or Python deployment compatibility is verified. No deployment or Vercel project was created. A FastAPI health-endpoint preview remains an early P2/P7 smoke test after account and repository setup.

## 08. Environment and Secrets

| Requirement | Result | Evidence |
|---|---|---|
| `.env`, `.env.local`, `.env.production`, `.env.development` ignored | PASS | `git check-ignore -v --no-index` matched `.env` / `.env.*` rules |
| `.env.example` trackable | PASS | negation rule `!.env.example` matched after `.env.*` |
| `.env.example` content safe | PASS | names/blank values only; no credentials |
| Python virtual environments ignored | PASS | `.venv/` is ignored |
| privileged key in React/source | NOT FOUND | prior P0.5 pattern scan found no credential values; no populated env file exists |
| real credentials committed | NOT VERIFIED | no commits/remote exist; working-tree scan found no value pattern |

`SUPABASE_SECRET_KEY` is backend-only; no `VITE_*` secret is permitted. The P0 design remains: verified FastAPI identity and explicit ownership checks, least privilege/RLS, restricted atomic RPC, and user-bound idempotency.

## 09. Automated Actions Performed

| ID | Action | Outcome | Status |
|---|---|---|---|
| P05B-01 | inspect Git status, remote and identity | root verified; no remote/identity | PASS |
| P05B-02 | verify ignore resolution without creating credential-like files | real env patterns ignored; example unignored | PASS |
| P05B-03 | inspect `.env.example` | blank safe template confirmed | PASS |
| P05B-04 | inspect provider CLI/browser capability | CLI/connector absent; browser launch policy-blocked | PASS (discovery) |
| P05B-05 | attempt official Supabase dashboard launch | no browser opened; policy blocked | BLOCKED |

The earlier `.gitignore` already had the required `!.env.example` rule after `.env.*`; this P0.5B verification made no additional application/configuration change beyond this report.

## 10. Human Checkpoints

1. Confirm the Git commit name and email to configure locally (not a password or token).
2. In a normal browser, sign in to the student-owned Supabase account, create/select a personal free organisation and create `student-money-runway-asm3-dev` in Australia/Sydney if available; store the database password privately.
3. Supply non-sensitive dashboard evidence (project name, organisation, healthy status, region and project reference; redact keys) if direct provider access remains unavailable.
4. Sign in to GitHub, verify/create the intended private repository, then explicitly approve the first source push.
5. Sign in to Vercel and approve least-privilege GitHub repository integration; do not create/deploy an application yet.

## 11. Evidence Register

| Evidence | Scope | Classification |
|---|---|---|
| PowerShell tool/version checks from P0.5 | local environment | independently verified |
| `git status`, `git remote -v`, Git config | Git readiness | independently verified |
| `git check-ignore -v --no-index` | environment security | independently verified |
| `.env.example` inspection | configuration security | independently verified |
| GUI launch rejection | Supabase access limitation | independently verified tool restriction |
| cloud account/project claims | GitHub/Supabase/Vercel | NOT VERIFIED; no dashboard evidence supplied |

## 12. Outstanding Blockers

**Essential P1 blocker:** an accessible, correctly student-owned Supabase development project. P1 must not create schema objects until that exists.

Non-blocking for P1 schema preparation but required before their gates: Git identity; GitHub account/private repository/baseline push; Vercel account/GitHub integration. Global CLI installation is optional; it requires student approval because it changes the workstation and does not replace required human identity checks.

## 13. P1 Entry Criteria

| Gate | Status | Requirement |
|---|---|---|
| G01 local Node/npm/Python/Git | PASS | satisfied |
| G02 Git identity | PENDING HUMAN ACTION | student confirms name/email |
| G03 ignore/template safety | PASS | satisfied |
| G04–G06 GitHub/account/repo/baseline | NOT VERIFIED | needed before source-control milestone, not P1 SQL itself |
| G07 Supabase account | NOT VERIFIED | human authentication required |
| G08 Supabase development project healthy | NOT VERIFIED | **required before P1** |
| G09 Supabase Auth settings | NOT VERIFIED | can be completed before P2; capture decisions in P1/P2 |
| G10–G11 Vercel/account/integration | NOT VERIFIED | required before deployment, not P1 |
| G12 no exposed secrets | PASS for working tree | maintain on every future commit |
| G13 no unintended application changes | PASS | frozen `src/` untouched |
| G14 P1 direct prerequisites | PENDING HUMAN ACTION | complete G07/G08 |

## 14. Final Recommendation

Do not install CLIs or begin P1 yet. Complete the Supabase human checkpoint first and return only non-sensitive dashboard evidence. Once the development project is independently accessible or accurately evidenced, reconcile its actual region/project reference/Auth settings against the P0 blueprint, then request the explicit go-ahead for P1 schema and security implementation.
