# Final technical release audit

Date: 14 October 2026. Actual local source preserved; no C0-C5 restart or production redesign.

## Current verification matrix

| Item | Status | Evidence / limit |
|---|---|---|
| Runtime source integrity | PASS | No runtime diff from deployed 08c2f38; no initial SQL modification |
| React tests | PASS | 152 passed, 9 files, 0 skipped/failed |
| FastAPI baseline tests | PASS | 184 passed, 2 hosted skipped; includes four new publication-gate tests |
| Supabase confirmation | PASS for main identity | Earlier server record/log confirmation; SMTP paused |
| Fresh password login | PASS server-side | Matching main-account POST /token password grant HTTP200 in structured logs |
| Two-login browser/session restoration | PENDING | User-reported sign-ins; observer has no completed milestone; no browser PASS invented |
| Existing saved plan/history | PASS scoped DB existence; browser retrieval PENDING | One plan/one purchase unchanged; no financial mutation authorized |
| Two-user live isolation | PENDING | Two dedicated nonmember accounts remain unconfirmed |
| Live deployment | PASS anonymous HTTPS | Preview READY; routes/assets/health/401/JSON404/no-store; not a Production release |
| GitHub source | PRIVATE | Remote verification/synchronization recorded in publication audit |
| GitHub PUBLIC / anonymous clone | BLOCKED | Peer privacy in reachable history; user requested reviewed proposal before changes |
| Repository completeness | PASS inventory | React, Python, SQL, tests, tools, manifests, safe environment template and deployment config present |
| README | UPDATED | Own-project Uvicorn env-file path documented; original guarded launcher preserved |
| Clean dependency installation | PASS private fresh clone | Actual new dependencies/venv; public clone remains BLOCKED by intentional private visibility |
| Frontend build/lint | PASS | 494 modules; 642.96kB main JS, 187.95kB gzip; non-failing chunk warning |
| Python compilation/pip check | PASS | No broken dependencies |
| Local FastAPI HTTP | PASS | 19 real loopback checks, no provider credentials |
| Local deployment route model | PASS | 24 checks, no hosted deployment from this command |
| Offline Chromium | PASS | 124 scenarios at390/768/1024/1280; doubles only in test harness |
| Week1-9 mapping | PARTIAL / SELECTED MATERIAL VERIFIED | Actual course PDFs inspected selectively; diagram-heavy pages have explicit limits |
| Reviewer access | PARTIAL | Anonymous live login usable; supervised/disposable access must be arranged; no arbitrary-signup promise |
| Final personal video | MISSING | Script/storyboard only plus short anonymous raw clip |
| Prompt Document | PARTIAL retained evidence | Original available prompts and follow-ups; missing history not fabricated |
| Three peer reviews | PENDING | Real URLs/access/screenshots/recommendations absent |
| Official rubric review | PASS review; PARTIAL fulfillment | All six pages read; PartA20/PartB20, no invented grade |

## Actual engineering changes

Comprehensively revised README with truthful live status, Windows/offline setup, own-project configuration, six screens/API fields, exact cents, idempotency, environment/security and evidence links. Added a read-only full-history privacy/secret gate and four offline detection regressions. Redacted unnecessary peer identifiers from five public-proposal working documents after preserving originals privately. Updated artifact validation to verify the now-found official brief and new reports. Preserved original final-engineering prompt and provenance.

No runtime frontend, backend business logic, API contract, deployed SQL, security setting or dependency version was changed. No personal financial writes, new login POST, SMTP configuration or deployment was performed automatically.

## Dependency advisories - triaged, not hidden

`npm audit --json` reports9 advisories (5high/4moderate): build-time Tailwind3 dependency chain (braces/chokidar/fast-glob/micromatch and selector parser) and React Router6 runtime advisories. [Sanitized audit](evidence/dependency-audit.json).

- Tailwind parsing/globbing is used on trusted repository source at build time, not uploaded user patterns in the deployed app. Remaining risk includes untrusted source/PR builds; do not run attacker-controlled builds with secrets. npm suggests Tailwind4 migration; not applied before submission.
- Router open-redirect advisory [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) concerns attacker-controlled navigation targets. Current App/NavLink targets are fixed internal paths; Login does not navigate to an untrusted return URL. This reduces the demonstrated attack surface, not the package vulnerability itself.
- SSR hydration advisory [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) concerns Router SSR error deserialization. This Vite app uses client createRoot/BrowserRouter, not Router SSR hydration. Upgrade remains a reviewed maintenance task; no broad Router7 migration or `npm audit fix --force` was run.

There is no zero-vulnerability claim. Existing Starlette/httpx deprecation and Vite chunk warning remain non-blocking local warnings. The full-history gate is deliberately BLOCKED for privacy and must not be turned green by removing detection.

## Exact commands executed

`npm ci`; `npm test`; `npm run lint`; `npm run build`; Python pytest with RUN_SUPABASE_LIVE_TESTS=0; compileall; pip check; C4 Chromium runner; verify-local-http.py; verify-deployment.py; current/staged/bundle/history scans; authenticated read-only deployment/DB inspections; anonymous Git access attempt. Final source synchronization/fresh private clone results are appended only after execution.

**ENGINEERING RELEASE PARTIAL**: local checks and public Preview routing pass, but public history/privacy and independent real Auth/full workflow remain incomplete. **ASM3 SUBMISSION PARTIAL**: required final video and peer reviews are absent. No universal security certification or full live persistence PASS is claimed.


## Executed private-clone result

Audited source commit `b481da0adcba08fee525e251212547ecf8aa2d7c` was committed and pushed normally to the verified PRIVATE exact repository; local and remote HEAD matched. Vercel project has no Git integration link, so this push did not trigger a deployment. A new authenticated clone outside the workspace installed fresh npm dependencies and Python3.12 virtual environment/runtime/development requirements. **PASS:** 152 frontend tests; 184 backend passed, two hosted skipped; lint/build/compile/pip check;19 local HTTP checks;24 routing checks; bundle/source scans; assessment artifact validation; exact README Uvicorn env-file startup using only the blank template, health200/financial401 and clean shutdown. No real credentials or existing dependencies were copied. The privacy gate correctly returned1 for historical peer identifiers. [Machine evidence](evidence/private-fresh-clone.json). This is PRIVATE reproducibility, not anonymous/public-clone PASS.

The fresh clone tested all runtime/test/tool source in b481da0. Subsequent follow-up changes are evidence/docs and focused read-only observer diagnostics; any such later observer change is explicitly separate from the tested runtime snapshot. The public switch remains blocked and unexecuted.


## Latest server-corroborated password login

A later read-only account check shows last_sign_in_at advanced beyond the email-confirmation session. Three Auth log rows were inspected around that timestamp. A matching-main-account structured event explicitly records **POST /token, grant_type=password, HTTP200**. Therefore **at least one genuine fresh password login is PASS server-side**. This is not merely the earlier verification/session event. The user's two sign-ins remain user-reported; the separate observer has not completed the two-login/reload/history/logout milestones. No claim of browser FastAPI plan/history retrieval, two observed logins or real financial mutation follows from the server event. The one plan/one purchase remain unchanged. See evidence/final-auth-log-corroboration.json and evidence/final-auth-readonly-check.json. SMTP stays PAUSED.


Actual changed paths are listed in `evidence/final-engineering-changed-files.json`; the candidate source inventory is separate. Existing C4 screenshot files were restored to their pre-run validated versions after this rerun; new machine results record the current124-case execution, and no newly captured financial screenshots are claimed. Actual anonymous Preview browser rerun passes all six routes at four widths with zero loopback requests.
