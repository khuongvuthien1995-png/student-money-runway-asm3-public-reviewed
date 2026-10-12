# ASM2 Requirements Traceability

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Status: Authoritative assessment requirement map
> Created: 2026-09-16T02:59:07+10:00
> Updated: 2026-09-16T02:59:07+10:00

| Requirement | Current implementation | Evidence | Status |
|---|---|---|---|
| Login screen | Frontend-only validated entry | `src/pages/LoginPage.tsx` | PASS |
| Three information-entry screens | Setup, Essentials, Purchase Check | `src/pages/*Page.tsx` | PASS |
| Result / confirmation | Runway result, purchase preview, recorded result | `RunwayResultPage.tsx`, `ResultPage.tsx` | PASS |
| Responsive frontend | Tailwind tokens, AppShell navigation, responsive classes | P1/P9 docs; `AppShell.tsx` | PASS |
| Three custom reusable components | FormSection, MoneyInput, SummaryRow | `src/components/ui/` | PASS |
| Reuse across two screens | Actual imports/rendering across Setup, Essentials, Purchase, Runway, Result | `src/pages/` | PASS |
| 21st.dev component | Ruixen UI Dynamic Status Button adaptation | StatusActionButton, P3 prompt/docs | PASS |
| Props and callbacks | App-owned state, page patch callback, MoneyInput raw-string callback | App, Setup, MoneyInput | PASS |
| Ethical handling | Factual copy, reversible preview, explicit confirmation, no persistence | P10; Result and Purchase pages | PASS |
| Prompt evidence | Master and P3/P6–P11 prompts retained | `docs/prompts/` | PARTIAL |
| Development-tool compliance | Actual tool is ChatGPT EDU / Codex, not Cline | `01-development-tool-declaration.md` | COMPLIANCE RISK |
| Screenshots | Capture plan exists; no images claimed | `09-screenshot-capture-plan.md` | PENDING CAPTURE |
| Video | Recording source exists; no video claimed | `10-video-recording-source.md` | PENDING RECORDING |
| Project ZIP | Candidate exists but must be re-audited after final documentation changes | `11-final-submission-readiness.md` | PENDING |
