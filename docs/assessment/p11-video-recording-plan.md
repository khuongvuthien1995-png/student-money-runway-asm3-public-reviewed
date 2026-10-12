# P11 — Video Recording Plan

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P11 — Final QA + Assessment Evidence
> Created: 2026-09-16T02:31:09+10:00
> Updated: 2026-09-16T02:31:09+10:00

| Time | Demonstration | Evidence and narration |
|---|---|---|
| 0:00–0:30 | Product introduction | Explain short-horizon runway planning, protected commitments, manual input, and transparent outcomes. |
| 0:30–1:10 | Login | Show required/format validation and explain that it is frontend-only, not authentication. |
| 1:10–2:00 | Runway Setup | Enter 950, 100, and a planning date. Show `FormSection` and `MoneyInput`. |
| 2:00–2:50 | Protect Essentials | Enter 455 and 180. Show reusable `FormSection`, `MoneyInput`, and the protected total. |
| 2:50–3:40 | Runway Result | Show protected total 735 and runway 215. Explain that calculation utilities derive values. |
| 3:40–4:50 | Purchase Check and within preview | Enter a named AUD 160 purchase and show remaining runway 55. State that preview does not mutate funds. |
| 4:50–5:30 | Exceeds branch | Enter AUD 300 and show amount above runway 85; point out there is no confirmation action. |
| 5:30–6:20 | Explicit confirmation | Return to AUD 160, use `Mark as spent`, and show available funds 790 and updated runway 55. |
| 6:20–7:00 | Responsive and ethics | Show one mobile view; explain factual language, Back Without Saving, no storage, no bank integration, and no future-income assumption. |
| 7:00–8:00 | Cline evidence | **NEED EVIDENCE:** show only authentic Cline Plan/Act history and prompts once obtained. Do not present Codex activity as Cline. |
| 8:00–9:00 | Custom components | Open `FormSection.tsx`, `MoneyInput.tsx`, `SummaryRow.tsx`; show their actual multiple-screen use. |
| 9:00–9:40 | Props and callbacks | Open `App.tsx`, `RunwaySetupPage.tsx`, and `MoneyInput.tsx`. Explain props down and raw-string callback up. |
| 9:40–10:00 | 21st.dev component | Show `StatusActionButton.tsx`, its 21st.dev header/provenance, and its real Result-page use. |

## Required legitimate evidence before recording

1. Capture the browser states in the evidence matrix.
2. Open the project in Cline and retain authentic Plan and Act records.
3. Perform only a genuine review or justified small refinement in Cline; do not recreate historical work.
4. Capture the original prompt/follow-up history that Cline actually records.

## Component reuse pairs

- FormSection: Runway Setup and Protect Essentials (also Purchase Check).
- MoneyInput: Runway Setup, Protect Essentials, and Purchase Check.
- SummaryRow: Protect Essentials, Runway Result, Purchase Check, and Result.
