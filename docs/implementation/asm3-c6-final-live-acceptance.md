# C6 final live acceptance and C7 handoff - 14 October 2026

Scope: real HTTPS and authorized read-only database checks. Custom SMTP remains PAUSED. No Auth configuration, financial data, deployment or Git remote was changed.

## Current verified source and deployment

Local main and remote main both resolve to `bcbad4dfb09c68ddae55eaad258604ee6aa79001`. Authenticated GitHub inspection confirms the exact repository remains PRIVATE. The existing READY Preview serves the public alias; its deployed runtime is the previously verified `08c2f38` source, while subsequent commits contain evidence/tools. No new deployment was made.

Fresh anonymous HTTPS: `/login` and direct `/runway` return HTML 200 without a Vercel access redirect; `/api/health` returns exactly the expected JSON at 200; plan and history GET return 401 without a bearer. These HTTP checks do not independently establish browser assets or authenticated persistence; earlier real browser evidence covers anonymous assets.

## Real workflow matrix

| Workflow | Status | Evidence and limitation |
|---|---|---|
| Signup and email confirmation | PASS for the main account | Earlier read-only account/log inspection corroborates normal confirmation. Unrestricted registration remains PENDING. |
| Fresh password login | PASS server-side for at least one login | Later structured Auth event corroborates matching-main POST /token, grant_type=password, HTTP200. |
| Two fresh observed browser sign-ins | PENDING independently; USER-REPORTED PASS | Observer has not completed its first plan/reload/history milestone. Its older checkpoint file is not a live event counter. No Auth failure inferred. |
| Auth session/browser reload | PENDING | Observer has no authenticated reload milestone. |
| Existing saved plan/history | PASS for read-only database existence | One real plan and one purchase, scoped to the confirmed main identity. Browser API/UI retrieval remains PENDING. |
| Setup, Essentials, Save via FastAPI | PENDING; intentionally not executed | User explicitly chose preserve records and read-only checks. No PUT authorized. |
| Runway and persisted reload UI | PENDING independent browser verification | Database existence alone does not prove the rendered/API workflow. |
| Purchase preview, zero mutation | LOCAL PASS; live preview PENDING | No financial writes were performed. No genuine live preview milestone captured by this observer. |
| Confirm purchase and authoritative updated balance | PENDING; intentionally not executed | No POST authorized; existing purchase is not proof of a newly tested confirmation. |
| Browser history, logout and second sign-in | PENDING independent verification | User reports sign-ins; no observer milestones yet. |
| Missing bearer rejection | PASS live | Current real HTTPS plan/history GET return 401. |
| Record preservation | PASS live | Full scoped rows compared against private baseline: unchanged, one plan/one purchase. No private financial values or identity exported into evidence. |
| Two-user isolation | PENDING live | Dedicated A/B remain unconfirmed; local tests are separate. |
| General nonmember registration | PENDING | Built-in sender eligibility remains unchanged. SMTP stays paused. |

## Evidence and tools

- `evidence/c6/final-readonly-https.json`: actual HTTPS statuses and private-repository verification.
- `evidence/c6/main-account-db-preflight.json` and `main-account-db-postcheck.json`: scoped counts and unchanged-row result, with private values withheld.
- `evidence/c6/fresh-password-login-results.json`: actual observer state, not a manufactured success.
- `tools/demo-recorder/verify-c6-fresh-login.mjs`: real headed Chromium; human password entry, no mocks, screenshots, traces, video, Auth body logging or session export. It checks fresh password grants, authenticated plan/history, reload, logout and re-login when the observed window receives those actions.

The server account still records the earlier confirmation-associated `last_sign_in_at`; this check did not independently corroborate a new password login. It is not proof the student's report is false. The exact browser/window discrepancy needs resolution before the observer can establish PASS. No repeat email or login request was sent automatically.

## C7 handoff

The English script, 300-second storyboard, Vietnamese rehearsal guide, shot list and traceable Prompt Document exist. Three named peer templates remain pending actual URLs, five genuine annotated screenshots and three grounded recommendations each. The official brief/rubric is missing; compliance is provisional. Only a short silent anonymous clip exists, not a complete personal narrated demo.

Preserve personal records for all recording. Canonical 950/455/180/100 and 160 purchase script steps require a separate permitted disposable account/fixture; never execute those steps on this main account. Capture passwords only outside recording, and obtain permission before recording personal financial screens. No full submission-ready claim is made.

**C7 PARTIAL - SPECIFIC DELIVERABLES REMAIN**


## Observer-window clarification and resumption

The student identified the labelled monitored window. The original observer had already reached its 15-minute participation timeout without capturing a password grant or financial request; its exit code 1 does not establish an Auth defect. Reopened a fresh monitored Chromium context, restored the explicit READ ONLY window title and brought it to the foreground. The observer is ready for human credential entry and allows 30 minutes per login. Source now distinguishes an unobserved-login participation timeout (PENDING) from a failed assertion after an observed password request (FAIL). No password was obtained and no automated login or financial write was submitted. Lint passed after this focused test-tool change. Current browser evidence remains PENDING until real observed milestones complete.


## Latest server-corroborated password login

A later read-only account check shows last_sign_in_at advanced beyond the email-confirmation session. Three Auth log rows were inspected around that timestamp. A matching-main-account structured event explicitly records **POST /token, grant_type=password, HTTP200**. Therefore **at least one genuine fresh password login is PASS server-side**. This is not merely the earlier verification/session event. The user's two sign-ins remain user-reported; the separate observer has not completed the two-login/reload/history/logout milestones. No claim of browser FastAPI plan/history retrieval, two observed logins or real financial mutation follows from the server event. The one plan/one purchase remain unchanged. See ../assessment/c7/evidence/final-auth-log-corroboration.json and ../assessment/c7/evidence/final-auth-readonly-check.json. SMTP stays PAUSED.


Observer tooling now checkpoints sanitized password/API response statuses on each event with serialized JSON writes. Earlier output was checkpointed at phase boundaries; an initial PENDING file alone was insufficient to prove zero internal events. No production Auth fix or new live attempt is claimed for that diagnostic repair.
