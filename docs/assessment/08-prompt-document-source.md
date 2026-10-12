# BUS4012 Assignment 02 — Prompt Document Source

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Development tool: ChatGPT EDU / Codex
> Status: Source prepared; final Word/PDF and screenshots pending
> Created: 2026-09-16T02:59:07+10:00
> Updated: 2026-09-16T02:59:07+10:00

## 1. Project

Student Money Runway is a manual, short-horizon planning MVP. It protects essential commitments and a safety buffer before showing a transparent discretionary runway and a reversible purchase-impact preview.

## 2. Starting Prompt

Preserved master evidence: `docs/prompts/00-master-project-context.md`.

## 3. Starting Prompt Annotation

The master prompt established a controlled, phase-based React development strategy. It required centralised visual tokens, reusable UI components, parent-owned source state, pure financial calculations, responsive presentation, and accessibility. It also constrained the MVP to frontend-only session behaviour with no backend, persistence, or speculative income. The implementation was kept factual and non-judgmental so calculated runway is shown as transparent information rather than financial advice.

## 4. Key Follow-Up Prompts

- P7: `docs/prompts/p07-protect-essentials-runway-result.md` — added validated protected-essentials input and derived runway/shortfall presentation.
- P8: `docs/prompts/p08-purchase-check-result-confirmation.md` — added reversible purchase preview and explicit guarded confirmation.
- P10: `docs/prompts/p10-validation-accessibility-ethics-source-hygiene.md` — hardened validation feedback, focus, ethics, and source hygiene.

## 5. Three Custom Components

- FormSection — reusable titled form grouping; Setup, Essentials, Purchase Check.
- MoneyInput — controlled AUD input; Setup, Essentials, Purchase Check.
- SummaryRow — repeated label/value summaries; Essentials, Runway, Purchase Check, Result.

Component prompt evidence is **RECONSTRUCTED FROM P2 DEVELOPMENT HISTORY** because dedicated original P2 prompt files are not retained in `docs/prompts/`. Do not present reconstructed summaries as original historical prompts.

## 6. 21st.dev Component

The separately sourced Dynamic Status Button by Ruixen UI is documented at `docs/prompts/p03-21st-dev-original-prompt.md` and adapted locally as `StatusActionButton.tsx`. It uses `framer-motion` and appears as the Result-page `Mark as spent` action.

## 7. Development Tool Compliance Note

The actual tool was ChatGPT EDU / Codex. **COMPLIANCE RISK — LECTURER CONFIRMATION REQUIRED** if the brief requires Cline-specific Plan/Act evidence or a Cline-only workflow. No such evidence is fabricated here.
