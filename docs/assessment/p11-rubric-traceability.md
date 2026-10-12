# P11 — BUS4012 ASM2 Rubric Traceability

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P11 — Final QA + Assessment Evidence
> Created: 2026-09-16T02:31:09+10:00
> Updated: 2026-09-16T02:31:09+10:00

| Rubric area | Assessment status | Repository evidence | Remaining evidence |
|---|---|---|---|
| App structure and UI | STRONG | Routes and pages in `src/App.tsx` and `src/pages/`; responsive token evidence in P1/P9 documentation | Capture browser screenshots at the planned states. |
| Workflow and results | STRONG | Login, Setup, Essentials, Runway, Purchase, Result, explicit confirmation; pure utilities in `src/utils/runwayCalculations.ts` | Record the complete browser walkthrough. |
| Ethics and transparency | STRONG | Factual labels, non-mutating preview, explicit `Mark as spent`, no persistence; P10 audit | Explain these choices during recording. |
| Novelty | ADEQUATE | Short-horizon planning, protected commitments, safety buffer, reversible purchase preview | Frame as workflow differentiation, not a claim that budgeting is unique. |
| Three custom components | STRONG | `FormSection`, `MoneyInput`, `SummaryRow` are custom and actually reused | Capture their source and screen reuse in the video. |
| React data flow | STRONG | `App → RunwaySetupPage → MoneyInput`; typed props and callbacks | Narrate the identified source symbols during video. |
| 21st.dev integration | STRONG | `StatusActionButton.tsx`, original prompt, P3 integration record, `framer-motion` | Capture source/provenance and the Result-screen action. |
| Prompting evidence | PARTIAL | Master context, P3, P6–P11 prompts retained | P2/P4/P5 prompt files are not in the repository; authenticate the starting/follow-up record. |
| Cline evidence | GAP | No Cline Plan/Act transcript, screenshots, or provenance is present | Obtain legitimate Cline Plan and Act evidence before recording. |
| Submission package | ADEQUATE | `.gitignore` excludes `node_modules/`, `dist/`, and env files; manifests are present | Create and inspect the final ZIP before submission. |

## Traceable code examples

- Props down / callbacks up: `App.tsx` owns `runwayState` and passes `runwayState` plus `handleRunwayStateChange` to `RunwaySetupPage`. That page passes raw `value` and `onChange` to `MoneyInput`; the callback returns the raw text to the parent.
- Financial rules: `src/utils/runwayCalculations.ts` is the sole source for protected total, runway, shortfall, remaining amount, exceeds status, and excess.
- 21st.dev: `StatusActionButton.tsx` retains its `@source 21st.dev — Ruixen UI / Dynamic Status Button` header and is rendered in `ResultPage.tsx` for `Mark as spent`.

## Honest assessment conclusion

The code and traceable technical evidence are strong. Assessment readiness is blocked by evidence that cannot be manufactured from this repository: authentic Cline Plan/Act interactions, authentic prompt history for the missing component prompt files, browser screenshots, and a validated final ZIP.
