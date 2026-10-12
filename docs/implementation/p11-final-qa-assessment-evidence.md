# P11 — Final QA and Assessment Evidence

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P11 — Final QA + Assessment Evidence
> Created: 2026-09-16T02:31:09+10:00
> Updated: 2026-09-16T02:34:39+10:00

## Final QA scope

P11 reconciles the completed P1–P10 implementation, source quality, business rules, routes, reusable components, third-party provenance, and assessment evidence. It adds no product feature or financial-rule change.

## Git baseline

There was no commit history and no configured local or global Git email. A baseline commit was not created because an email must not be fabricated. The working tree therefore cannot yet provide a meaningful `git diff` baseline.

## Source and runtime audit

Seventeen human-authored `src` files were audited. P10's final source encoding check is clean. No debug logging, debugger statement, production TODO/FIXME placeholder, secret file, browser storage, or derived financial React state was found. `src/assets/hero.png` is unreferenced; it is a non-blocking unused starter asset and should be excluded or removed only after the student confirms it is not needed as coursework evidence.

The route contract is `/`, `/login`, `/setup`, `/essentials`, `/runway`, `/purchase`, and `/result`, with root and unknown routes redirecting to login. Fresh prerequisite-route checks redirect to Setup without NaN, Infinity, or runtime failure.

## Business regression

| Case | Actual | Result |
|---|---:|---|
| Protected total (455 + 180 + 100) | 735 | PASS |
| Runway from 950 | 215 | PASS |
| Shortfall for 650 against 734 | 84 | PASS |
| Purchase 160 from runway 215 | 55 remaining | PASS |
| Purchase 215 from runway 215 | 0 remaining; not exceeds | PASS |
| Purchase 300 from runway 215 | 0 remaining; 85 excess | PASS |
| Explicit confirmation | guarded 950 → 790 transition; updated runway 55 | PASS |

## Component, 21st.dev, and data-flow evidence

FormSection is reused in Setup, Essentials, and Purchase; MoneyInput is reused in those same three screens; SummaryRow is reused in Essentials, Runway, Purchase, and Result. All are custom project components.

StatusActionButton is a documented adaptation of Ruixen UI's 21st.dev Dynamic Status Button. Its source header, original prompt, P3 record, `framer-motion` dependency, reduced-motion handling, and real Result-screen `Mark as spent` use remain traceable.

The clearest props/callback example is `App.tsx → RunwaySetupPage.tsx → MoneyInput.tsx`: App owns `RunwayState`, passes `runwayState` and `onRunwayStateChange`, and MoneyInput reports raw text through `onChange`.

## Assessment evidence status

Code is ready for a walkthrough. Assessment evidence is not yet complete: no authentic Cline Plan/Act history, no retained dedicated P2 prompts, no captured screenshots, and no recorded video are present. A candidate ZIP was created at `C:\Dev\BUS4012\Student_Money_Runway_BUS4012_AS02_Project.zip`; its 85 entries contain source and package manifests and exclude `node_modules`, `dist`, `.git`, and environment files. The assessment planning documents under `docs/assessment/` identify the exact required captures and honest next actions.

## Final verdict

Code readiness: YES. Assessment readiness: NO, pending authentic evidence capture and packaging verification.
