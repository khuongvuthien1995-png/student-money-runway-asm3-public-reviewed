# ASM3 C6 — Authorized SMTP repair preparation

> Updated: 2026-10-14 Australia/Sydney
> SMTP CONFIGURATION PENDING — PRIVATE GOOGLE APP CREDENTIAL REQUIRED

The user authorized custom SMTP only for project `mnjmugwkjtihqswssiwa`, free service selection and autonomous setup while preserving required confirmation and all existing accounts/security. No paid subscription is authorized or created.

## Definitive current diagnosis

Authenticated Management API readback establishes ACTIVE_HEALTHY project, no SMTP host/user/password/sender, no send-email hook, two-email/hour limit and 60-second minimum mail interval. Neither dedicated account email belongs to the organization. Supabase's built-in sender restricts recipients to organization members, independently of the quota. Earlier real resend calls returned `email_address_invalid`; real signup returned `over_email_send_rate_limit`; latest C7 logins return `email_not_confirmed`. This is not a claim that an external SMTP server bounced mail. [Supabase SMTP policy](https://supabase.com/docs/guides/auth/auth-smtp), [rate limits](https://supabase.com/docs/guides/auth/rate-limits).

## Selected no-subscription option

For this low-volume educational demo, selected the student's permitted Gmail SMTP account. No new service account, sender domain purchase, billing or DNS change is needed. Gmail requires account-controlled authentication; a Google app password requires 2-Step Verification and may be unavailable under some account policies. The user must perform that account-verification/private-credential step. The agent cannot create it or assume it exists. This is demo preparation, not a production mail-delivery guarantee. [Google app passwords](https://support.google.com/accounts/answer/185833), [official SMTP settings](https://support.google.com/mail/answer/7104828), [Gmail sending limits](https://support.google.com/mail/answer/22839).

Compared current official documentation: Brevo has free transactional sends but account/sender verification and SMTP activation; SMTP2GO's current quick-start requires a work/owned-domain signup address; Resend's normal sending requires verified domain setup. Those are not configured or billed here. Gmail reduces new account/domain setup for the current dedicated test-email task. Any unavailable Google app-password option must be reported before selecting an alternative.

## Concrete prepared configuration

| Hosted field | Prepared value |
|---|---|
| `smtp_host` | `smtp.gmail.com` |
| `smtp_port` | `587` (STARTTLS; string for Management API schema) |
| `smtp_user` | Privately entered permitted Gmail address |
| `smtp_pass` | Privately entered Google app password; not normal account password |
| `smtp_admin_email` | Same authenticated Gmail sender |
| `smtp_sender_name` | `Student Money Runway` |
| `rate_limit_email_sent` | 30/hour, within the authorized SMTP plan; Google's daily/abuse limits still apply |

No other field is included in the patch. Existing HTTPS Site URL/allowlist must match, signup must remain enabled and automatic confirmation disabled. Unexpected existing custom SMTP is not overwritten. No user account/password, JWT/RLS or financial setting is changed.

## Actual implementation and checks

`tools/configure_supabase_smtp.py` reads only ignored/untracked `.env.smtp.local`, supports local checks and explicit `--apply`, and targets the hard-coded approved Management API endpoint. It obtains the existing authorized CLI credential in process memory, validates TLS and SMTP login before a hosted patch, then independently reads back settings and compares all unrelated Auth fields. It sends no email, performs no signup and creates no financial data. Safe locally authored errors are separate from suppressed provider errors; credential objects suppress their repr.

The ignored credential file was created with blank `SMTP_USERNAME` and `SMTP_PASSWORD`, preserving any existing values. No private configuration was pushed to source or Vercel. Repository and client-bundle scanners now inspect this file's private values, including app-password forms with formatting spaces removed.

Added nine offline safety cases in `backend/tests/test_smtp_setup.py`: restricted patch scope/owned sender; preserved configuration; confirmation/signup/URL drift refusal; foreign existing SMTP refusal; injected-field refusal; missing/wrong credentials rejected without echoing values. **9 focused passed; full backend 180 passed, two hosted skipped (4.09s)**. Lint and Python compilation passed; five production files checked with zero unsafe paths; working/staged secret checks passed. No real SMTP authentication or hosted SMTP patch has run.

## Human checkpoint and resumption

The Google app-password page and ignored credential file were linked to the student. Automatic approval review rejected the combined Notepad/browser launch with “blocked by policy”; no more-specific reason was provided. Local file creation and independent implementation/testing succeeded. The student must open the official Google page, complete verification and enter only the Gmail address/app password directly into `.env.smtp.local`; never send values in chat.

After the student saves: the agent checks privately, validates TLS/login, applies only the authorized fields, independently verifies readback, sends supported confirmation resends for the two existing accounts and verifies outcomes. Successful send acceptance is not inbox delivery. Ask the student to open confirmation links only after a send is accepted/received. Actual email-confirmed login and the guarded authorized live suite must pass before financial demo claims. No accounts are recreated, no confirmation bypass occurs and no Production deployment is performed.

**CURRENT: PREPARED AND TESTED LOCALLY; SMTP CREDENTIALS / LIVE AUTH PENDING.**
