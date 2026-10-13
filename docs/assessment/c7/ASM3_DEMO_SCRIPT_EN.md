# ASM3 individual narration — English

**Conditional recording script. Do not read successful-action statements until the matching live behavior and footage are verified.** A personal account is now confirmed; independent password-login and financial-footage gates remain pending; this document is a script, not a recorded video or live PASS.

Planned timeline: 300 seconds. Narration: 607 whitespace-delimited words; at 125 words/minute about 291 seconds, leaving screen-action pauses. Final exported duration must be measured; this estimate is not five-minute video compliance.

## 00:00–00:20 — Introduction

Hello, I am Thien Khuong Vu. This is Student Money Runway for BUS4012 Assignment Three. It helps students protect essential costs and a safety buffer before deciding whether a discretionary purchase fits their available money. It is a planning tool, with no bank connection.

## 00:20–00:35 — Public application

Here is the publicly accessible Vercel Preview. Visitors can open the website without a Vercel account. Personal financial screens still require Supabase authentication. This is a Preview release, and I am not presenting it as a Production release.

## 00:35–01:05 — Real authentication

Authentication uses the real Supabase client. New accounts require email confirmation. For this demonstration, I use a dedicated confirmed test account. I enter credentials off camera. After successful sign-in, the application loads that user’s saved plan. It never treats a nonempty password field as proof of authentication.

## 01:05–01:45 — Setup and Essentials

In Runway Setup, I enter nine hundred and fifty Australian dollars, a planning date, and a one hundred dollar safety buffer. Continuing changes only the draft. In Protect Essentials, fixed costs are four hundred and fifty-five dollars, and flexible costs are one hundred and eighty. Save sends exact integer cents through FastAPI. The button remains disabled while saving, and navigation waits for the returned plan.

## 01:45–02:05 — Saved runway

The saved plan protects seven hundred and thirty-five dollars: fixed essentials, flexible essentials and the safety buffer. Nine hundred and fifty minus seven hundred and thirty-five leaves two hundred and fifteen dollars of runway. If protected costs exceed funds, the screen shows a shortfall rather than negative spending capacity.

## 02:05–02:35 — Non-mutating purchase preview

I propose a one hundred and sixty dollar purchase. The Result screen previews fifty-five dollars remaining. Preview does not record a purchase or deduct funds. The proposal receives one stable idempotency key. If an uncertain confirmation needs a retry, the application keeps that key and the original payload together.

## 02:35–03:00 — Explicit confirmation

Only Mark as spent sends the purchase confirmation. FastAPI verifies the bearer token, derives ownership, and calls the database transaction. I wait for the actual response. The server’s returned plan now shows seven hundred and ninety dollars available and fifty-five dollars of runway. The browser does not perform a separate local deduction.

## 03:00–03:25 — Persistence, history and logout

I refresh to retrieve the persisted plan, then load the purchase history. The confirmed purchase remains visible with its saved amount. I log out and open a protected route again. The application returns to login and clears private state. These observations demonstrate persistence and access behavior only for this tested account.

## 03:25–03:45 — Supabase evidence

In the Supabase Table Editor, I show only the dedicated test records. The plan stores source values in integer cents, and the purchase references the same plan and owner. Runway and shortfall are derived, rather than stored as additional financial truth. I do not display credentials or unrelated student data.

## 03:45–04:05 — Architecture

The architecture is React and Vite, then FastAPI, then Supabase PostgreSQL. Supabase Auth supplies the user token. FastAPI checks its signature, issuer, audience and expiry before financial access. Database constraints and the restricted purchase procedure support integrity. Local tests and live observations are reported separately.

## 04:05–04:30 — GitHub and reproducibility

The private GitHub repository contains the frontend, Python API, schema migrations, tests and dependency manifests. The README provides Windows setup commands. A clean clone was installed and tested. Ignore rules exclude populated environment files, dependencies and build output. Marker access must be granted separately; I never make private credentials public.

## 04:30–04:50 — Prompt evidence

My Prompt Document links preserved instructions to implementation evidence and real commits. It labels reconstructed phase descriptions clearly. One live defect was a generic authentication message hiding an email-send rate limit. The repair now reports that provider condition truthfully, with regression tests and real Preview verification.

## 04:50–05:00 — Security and conclusion

Server secrets stay outside the browser. Financial actions require verified ownership. Thank you for reviewing Student Money Runway and its evidence.

## If Auth remains blocked at recording time

Replace the successful authentication/persistence sequence with an honest explanation: ?The public Preview loads and the personal organization-member account has confirmed successfully. The separate dedicated accounts remain unconfirmed; earlier attempts were rate-limited or rejected by recipient policy. I can show the implemented source and offline test evidence, but I cannot claim real authenticated persistence or a completed live transaction.? Label any source/test demonstration as local. This fallback does not fulfil the requested live functional demonstration; seek course guidance if the blocker remains. Do not describe the raw silent clip as the individual narrated submission.
