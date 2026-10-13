# C6 Auth read-only reassessment — 14 October 2026

> CUSTOM SMTP PAUSED at the user's explicit request
> Personal registration/confirmation supported by server evidence; unrestricted public registration not established

## Scope and current configuration

Performed only authenticated GET inspections of the exact project `mnjmugwkjtihqswssiwa`: Auth configuration, organization membership, Auth-user records and recent Auth logs. No signup, resend, password-login POST, SMTP login, Auth PATCH, account/password change, financial write or deployment was performed. No app password is requested or created. Previous SMTP setup authorization is suspended; do not run its prepared tool with `--apply` unless the user explicitly resumes that work.

| Read-only observation | Actual result |
|---|---|
| Custom SMTP host/user/password | All absent |
| Send-email hook | Disabled |
| Email quota | 2/hour |
| Minimum email interval | 60 seconds |
| Required email confirmation | Enabled |
| Site URL | Approved public Preview origin |
| Newly registered account | Organization-member identity; confirmed |
| Dedicated accounts A/B | Neither is an organization member; neither is confirmed |

Current configuration is Supabase's built-in sender, with no configured custom provider or email hook. This matches the earlier before-send inspection as well. The user's received inbox email is user-reported evidence; successful signup/confirmation/session events are independently corroborated server-side. No raw inbox headers were provided, so no separate header-level transport attribution is claimed.

## Newly registered account and precise sign-in boundary

Read-only account record:

- Created: **14 October 01:58:20 AEDT** (`2026-10-13T14:58:20.648972Z`).
- Confirmation send timestamp: **01:58:20 AEDT**; this alone is a send-attempt marker, not inbox delivery.
- `email_confirmed_at`: **01:59:22 AEDT** (`2026-10-13T14:59:22.165379Z`).
- `last_sign_in_at`: **01:59:22 AEDT** (`2026-10-13T14:59:22.17563Z`).

Logs correlate the same account with signup **HTTP 200**, verification **HTTP 303**, and a **login event**. Therefore registration, normal email confirmation and Auth-session creation succeeded for this organization-member identity. This is stronger evidence than merely receiving an email. An independent password sign-in through the Preview was **not** performed: its password/session is not available to the agent, and this reassessment is read-only. Do not infer a fresh password-login result or financial API acceptance from the login event accompanying verification.

## Dedicated accounts and recent sanitized logs

A/B each retain null `email_confirmed_at` and null `last_sign_in_at`. Their old `confirmation_sent_at` values do not prove mail reached their inboxes. Neither address matches an organization-member email. Addresses, IDs, tokens, links and raw log bodies were not printed or persisted.

The supported logs endpoint returned **200**, with **32 Auth rows inspected in a six-hour window**. Sanitized category matches: 10 `email_not_confirmed`, 3 `over_email_send_rate_limit`, 2 `email_address_invalid`, one signup event and one login event. Category matches may overlap within a row and are not distinct-user counts. Relevant HTTP events include two `/resend` **400** recipient rejections, three `/signup` **429** quota rejections, then the confirmed account's `/signup` **200** and `/verify` **303**. An initial logs query failed ISO timestamp validation; corrected timestamps produced the successful query. That inspection error was not an Auth-delivery failure.

## Explanation and recommended next action

Supabase's [built-in SMTP documentation](https://supabase.com/docs/guides/auth/auth-smtp) restricts recipients to organization-member addresses; its [rate-limit documentation](https://supabase.com/docs/guides/auth/rate-limits) describes the built-in two-email/hour quota. The confirmed main account is an allowed recipient, while A/B are not. That explains why personal registration can work while the dedicated recipients are rejected. The observed 429s are a separate transient quota condition, not proof that all Auth email sending is permanently broken. The later 200/verification confirms the distinction. Exact historical quota-counter values are not available; no counter-reset time is invented.

**Custom SMTP is not necessary for the already successful personal organization-member test.** Keep working settings unchanged. Use that confirmed identity for the next explicitly permitted demo/sign-in verification; do not overwrite its financial data. For agent-run password verification, private access would be needed, and authenticated financial demo writes require their own applicable authorization.

**An authorized custom mail provider/send-email hook is needed for general nonmember registration under the current built-in policy.** That is distinct from the student's successful personal flow. Do not add test users to the project's organization merely to bypass the restriction. A/B remain unsuitable for unrestricted built-in delivery; waiting for quota reset does not change their recipient eligibility. Only revisit a reviewed custom-provider configuration if the user chooses broader registration; no SMTP change is requested or applied now.

Current sanitized evidence: `docs/assessment/c7/evidence/auth-readonly-reassessment.json`. C7 scripts, prompt evidence and peer templates remain available; full live financial footage, personal narration, peer URLs/reviews and the official rubric are still pending.
