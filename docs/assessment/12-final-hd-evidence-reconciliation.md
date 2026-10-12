# Final HD Evidence Reconciliation

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu (22135640)
> Phase: P12 — Final HD Evidence Recovery, Compliance Reconciliation and Submission-Source Hardening
> Created: 2026-09-17T22:04:56+10:00
> Updated: 2026-09-17T22:09:35+10:00

## Scope and evidence standard

This is a burden-of-proof reconciliation for final Word/PDF repair. No official AS02 brief or rubric file was located in the project-accessible directories, so the “official wording summary” column below records the P12 requirement label and any historical traceability support; it is not an independently verified quote from an official brief. Current source and actual files override stale P1–P11 prose. No Cline, lecturer approval, prompt, screenshot, video, or test result is inferred where a primary artifact is absent.

## Official Requirement Matrix

| Requirement | Official wording summary | Actual evidence | Evidence path | Status |
|---|---|---|---|---|
| Login | P12 requirement label; official brief unavailable | Validated frontend-only Login is implemented and D01 exists. | `src/pages/LoginPage.tsx`; `docs/evidence/screenshots/desktop/D01-login.png` | PROVEN |
| 2–3 information-entry screens | P12 requirement label; official brief unavailable | Three actual pages collect inputs: Setup, Essentials, and Purchase Check. | `src/pages/RunwaySetupPage.tsx`; `ProtectEssentialsPage.tsx`; `PurchaseCheckPage.tsx` | PROVEN |
| Final success / unsuccessful screen | P12 requirement label; official brief unavailable | Runway shortfall and confirmed-purchase branches are implemented and captured. | `RunwayResultPage.tsx`; `ResultPage.tsx`; `D05-shortfall-84.png`; `D10-confirmed-runway-55.png` | PROVEN |
| Three custom reusable components | P12 requirement label; official brief unavailable | FormSection, MoneyInput, and SummaryRow are current custom components. | `src/components/ui/` | PROVEN |
| Each custom component reused on at least two screens | P12 requirement label; official brief unavailable | Current imports and JSX show reuse on three or more named pages. | Component Reuse Matrix below | PROVEN |
| 21st.dev component | P12 requirement label; official brief unavailable | StatusActionButton carries 21st.dev/Ruixen provenance, uses framer-motion, and is rendered on Result. | `src/components/ui/StatusActionButton.tsx`; `src/pages/ResultPage.tsx`; `docs/prompts/p03-21st-dev-original-prompt.md` | PROVEN |
| Starting prompt | P12 requirement label; official brief unavailable | Preserved master context exists, but authentic Cline submission/interaction is not proven. | `docs/prompts/00-master-project-context.md`; `docs/assessment/02-starting-prompt-evidence.md` | PARTIALLY PROVEN |
| 3–5 sentence starting-prompt annotation | P12 requirement label; official brief unavailable | Four-sentence annotation covers strategy, constraints, intended output, and iterative control. | `docs/assessment/02-starting-prompt-evidence.md` | PROVEN |
| 2–3 follow-up prompts | P12 requirement label; official brief unavailable | P7, P8, and P10 prompts are preserved with implementation effects. | `docs/prompts/p07-protect-essentials-runway-result.md`; `p08-purchase-check-result-confirmation.md`; `p10-validation-accessibility-ethics-source-hygiene.md` | PROVEN |
| Three custom-component prompts | P12 requirement label; official brief unavailable | Dedicated original P2 prompt files are not retained; assessment source labels them reconstructed only. | `docs/assessment/08-prompt-document-source.md`; `p11-prompt-document-outline.md` | MISSING |
| 21st.dev prompt/instruction | P12 requirement label; official brief unavailable | Preserved original Dynamic Status Button instruction exists. | `docs/prompts/p03-21st-dev-original-prompt.md` | PROVEN |
| Parent-to-child props / callbacks-up | P12 requirement label; official brief unavailable | App owns state; Setup supplies controlled input props; MoneyInput forwards raw text. | `src/App.tsx:24–29, 90–98`; `src/pages/RunwaySetupPage.tsx:19–45, 88–131`; `src/components/ui/MoneyInput.tsx:14–18, 47–49, 67–79` | PROVEN |
| Cline | P12 requirement label; official brief unavailable | Project evidence identifies the actual workflow as ChatGPT EDU / Codex and contains no authentic Cline artifact. | `docs/assessment/01-development-tool-declaration.md` | MISSING |
| Cline Plan Mode | P12 requirement label; official brief unavailable | No authentic Plan Mode transcript, screenshot, or video evidence found. | Project docs/evidence search; `docs/assessment/p11-rubric-traceability.md` | MISSING |
| Cline Act Mode | P12 requirement label; official brief unavailable | No authentic Act Mode transcript, screenshot, or video evidence found. | Project docs/evidence search; `docs/assessment/p11-rubric-traceability.md` | MISSING |
| Final 10-minute video | P12 requirement label; official brief unavailable | Two silent automated product clips exist; no merged 10-minute assessment recording exists. | `C:\Dev\BUS4012\student-money-runway-evidence\video\raw\`; `docs/evidence/video/automated-demo-recording-report.md` | MISSING |
| Camera-visible requirement | P12 requirement label; official brief unavailable | No camera-visible artifact found. | Project/evidence search | MISSING |
| VS Code requirement | P12 requirement label; official brief unavailable | Manual IDE segment remains pending; no authentic VS Code capture found. | `docs/evidence/video/manual-ide-segment-runbook.md` | MISSING |
| Project ZIP without node_modules | P12 requirement label; official brief unavailable | P12 final source ZIP was created and verified to contain required source/docs with no forbidden generated or secret paths. | `C:\Dev\BUS4012\Student_Money_Runway_BUS4012_AS02_Project_FINAL.zip` | PROVEN |

## Custom Component Source Reconciliation

| Component | Source and props API | Responsibility / business-logic boundary | Imported and visibly rendered on | Reuse >= 2 |
|---|---|---|---|---|
| FormSection | `src/components/ui/FormSection.tsx:14–40`; `title`, `description?`, `children`, `className?` | Semantic titled grouping and optional description. No state, calculation, navigation, or financial logic. | Runway Setup, Protect Essentials, Purchase Check | YES |
| MoneyInput | `src/components/ui/MoneyInput.tsx:14–96`; `id`, `label`, `value`, `onChange`, `helperText?`, `error?`, `required?`, `disabled?`, `className?`, `onBlur?` | Controlled AUD text-field presentation, helper/error semantics, and raw text forwarding. It does not parse final business amounts, calculate, mutate central state, or navigate. | Runway Setup, Protect Essentials, Purchase Check | YES |
| SummaryRow | `src/components/ui/SummaryRow.tsx:14–56`; `label`, `value`, `supportingText?`, `emphasis?`, `className?` | Responsive label/value display with semantic emphasis. It has no formulas, mutations, routing, or advice. | Protect Essentials, Runway Result, Purchase Check, Result | YES |

## Component Reuse Matrix

| Component | Source | Setup | Essentials | Runway | Purchase | Result | Reuse PASS |
|---|---|---|---|---|---|---|---|
| FormSection | `src/components/ui/FormSection.tsx` | YES | YES | No | YES | No | YES |
| MoneyInput | `src/components/ui/MoneyInput.tsx` | YES | YES | No | YES | No | YES |
| SummaryRow | `src/components/ui/SummaryRow.tsx` | No | YES | YES | YES | YES | YES |

Current import/JSX evidence: `RunwaySetupPage.tsx:14–15, 83–133`; `ProtectEssentialsPage.tsx:14–16, 94–151`; `PurchaseCheckPage.tsx:15–17, 95–181`; `RunwayResultPage.tsx:14, 109–125`; and `ResultPage.tsx:14–15, 75–151`.

## Props / Callback Data Flow

```text
App.tsx owns RunwayState (lines 24–29)
  ↓ runwayState, onRunwayStateChange
RunwaySetupPage.tsx receives typed props (lines 19–30)
  ↓ value, onChange
MoneyInput.tsx receives controlled string value (lines 14–18, 67–79)
  ↑ onChange(event.target.value) (lines 47–49)
RunwaySetupPage updateField creates { [field]: value } (lines 44–45)
  ↑ onRunwayStateChange(partial patch)
App merges that patch into source state (lines 27–28)
```

The narrow `string` input boundary preserves empty and partial decimal text without inserting `NaN` into React state. Calculation functions remain in `src/utils/runwayCalculations.ts`, outside the reusable visual components.

## Recommended Code Screenshot Captures

### C01 — MoneyInput controlled component

- Source path and symbol: `src/components/ui/MoneyInput.tsx`, `MoneyInputProps` and `MoneyInput`.
- Approximate lines: 14–18 for the required controlled props; 47–49 for `onChange(event.target.value)`; 67–79 for the actual controlled input.
- Required visible code: `value: string`, `onChange: (value: string) => void`, `value={value}`, and `onChange={handleChange}`.
- Crop instruction: show only the interface, forwarding function, and input element; keep the VS Code file tab and line numbers visible.
- Caption: “MoneyInput is a reusable controlled AUD field: the parent provides a raw string value and receives raw user-entered text through onChange.”
- Report insertion section: custom-component evidence / props-and-callback explanation.

### C02 — Props down / callbacks up

- Source paths and symbols: `src/App.tsx` `App` and `handleRunwayStateChange` (lines 24–29, 90–98); `src/pages/RunwaySetupPage.tsx` `RunwaySetupPageProps`, `updateField`, and `MoneyInput` call site (lines 19–45, 88–96).
- Preferred presentation: authentic VS Code split view with App on the left and RunwaySetupPage on the right.
- Required visible code: App’s `useState(INITIAL_RUNWAY_STATE)`, its merge callback, `runwayState` / `onRunwayStateChange` props, and `onChange={(value) => updateField('availableFunds', value)}`.
- Caption: “App owns source state; props move down through RunwaySetupPage, while a typed partial patch returns through the callback.”
- Purpose: direct evidence of the React parent-to-child and callback-up architecture.

## Original Component Prompt Recovery

The legitimate project-accessible search covered `docs/prompts/`, `docs/implementation/`, `docs/assessment/`, README files, and retained project text. No dedicated original P2 prompt file or authentic transcript/export for FormSection, MoneyInput, or SummaryRow was found. `docs/assessment/08-prompt-document-source.md` explicitly labels the current component-prompt evidence as “RECONSTRUCTED FROM P2 DEVELOPMENT HISTORY.”

| Component | Classification | Exact evidence path | Consequence |
|---|---|---|---|
| FormSection | RECONSTRUCTED ONLY | `docs/assessment/08-prompt-document-source.md`; `docs/assessment/p11-prompt-document-outline.md` | Do not call any present summary an original prompt. |
| MoneyInput | RECONSTRUCTED ONLY | `docs/assessment/08-prompt-document-source.md`; `docs/assessment/p11-prompt-document-outline.md` | Do not call any present summary an original prompt. |
| SummaryRow | RECONSTRUCTED ONLY | `docs/assessment/08-prompt-document-source.md`; `docs/assessment/p11-prompt-document-outline.md` | Do not call any present summary an original prompt. |

ORIGINAL P2 COMPONENT PROMPT GAP REMAINS. No `docs/assessment/13-authentic-component-prompt-evidence.md` is created because no authentic verbatim P2 component prompt was found.

## Starting and Follow-Up Prompt Audit

The preserved master context is a substantive development prompt: it defines phased strategy, source constraints, design authority, state/calculation boundaries, accessibility, and intended MVP scope. The annotation in `docs/assessment/02-starting-prompt-evidence.md` contains four sentences and covers the requested strategy, constraints, intended outcome, and iterative control. It does not prove a Cline interaction.

| Preserved prompt | Problem addressed | Current implementation effect | Verification evidence | Meaningful iteration |
|---|---|---|---|---|
| `docs/prompts/p07-protect-essentials-runway-result.md` | Protected amounts, shortfall, and derived runway | Essentials form and pure protected/runway/shortfall result | `ProtectEssentialsPage.tsx`; `RunwayResultPage.tsx`; runtime report R01/R02 | Adds the protected-essentials stage and deterministic result evidence. |
| `docs/prompts/p08-purchase-check-result-confirmation.md` | Reversible preview and explicit confirmation | Purchase Check, within/exceeds branches, guarded single mutation | `PurchaseCheckPage.tsx`; `ResultPage.tsx`; `App.tsx`; runtime P06–P08/C01–C03 | Separates preview from the only financial mutation. |
| `docs/prompts/p10-validation-accessibility-ethics-source-hygiene.md` | Validation, focus, error text, privacy, ethics, source hygiene | Visible validation, semantic states, factual copy, source review | `docs/implementation/p10-validation-accessibility-ethics-source-hygiene.md`; validation screenshots | Hardens completed interaction rather than adding unrelated features. |

## 21st.dev Audit

- Third-party source: 21st.dev.
- Component: Dynamic Status Button.
- Author/library: Ruixen / Ruixen UI.
- Local component: `src/components/ui/StatusActionButton.tsx`.
- Dependency: `framer-motion` in `package.json`.
- Final usage: `src/pages/ResultPage.tsx:182`, as the eligible `Mark as spent` action.
- Provenance classification: **PROMPT-BASED LOCAL ADAPTATION**. `docs/prompts/p03-21st-dev-original-prompt.md` preserves the official Markdown instruction and records that direct registry source retrieval returned HTTP 403; the local source therefore must not be described as a direct source copy.

## Cline / Codex Compliance Audit

- Authentic Cline evidence: **MISSING / NOT PROVEN**.
- Cline Plan Mode: **MISSING / NOT PROVEN**.
- Cline Act Mode: **MISSING / NOT PROVEN**.
- Lecturer approval for ChatGPT EDU / Codex as a Cline substitute: **MISSING / NOT PROVEN**.
- Actual documented workflow: ChatGPT EDU / Codex, as stated in `docs/assessment/01-development-tool-declaration.md`.
- La Trobe ChatGPT Edu invitation: **MISSING / NOT PROVEN** in project-accessible evidence. If supplied later, it can establish only institutional tool provenance; it cannot establish Codex equals Cline or lecturer substitution approval.

## Ethics Gap Reconciliation

| Area | Current source/evidence | Remaining gap or limit |
|---|---|---|
| Data minimisation / privacy | Local React state only; no backend, bank integration, browser storage, or remote API. | No formal privacy notice or deletion workflow; the MVP is not a production data system. |
| Transparency | Pure utilities and visible calculation rows show factual inputs/results. | No independent financial validation or financial-advice service is claimed. |
| User control | Preview is non-mutating; Back without saving is available; only explicit Mark as spent mutates available funds. | Confirmation is a session-only UI transition, not a real payment record. |
| Future income | No future-income field exists in `RunwayState`. | User must manually update funds when income is actually received. |
| Language | P10 evidence documents factual, non-judgmental copy and no affordability/safety claims. | This is a planning aid, not personalised financial advice. |
| Consent | No external data transfer exists in the current MVP. | There is no explicit consent/policy UI; any future persistence or integration would require it. |

## Novelty and Competitor Evidence

The Assignment 01 folder accessible in this project contains design/image artifacts, not a textual competitor-research record proving specific constraints for Frollo, YNAB, PocketSmith, Sparrow, PocketGuard, or SafeSpend. Therefore competitor-specific claims are **MISSING / NOT PROVEN**. Do not claim budgeting itself is novel.

The defensible differentiation supported by current source and preserved prompts is: an international-student context; a selected short planning horizon; protected essentials and a safety buffer; exclusion of future income until received; transparent deterministic runway calculation; and a reversible purchase-impact preview before explicit recording.

## Required-Flow Screenshot Manifest

All listed files exist and are non-empty; desktop and validation images are 1280×900, and the named mobile images are 390×844.

| Evidence | Actual path |
|---|---|
| D01 Login | `docs/evidence/screenshots/desktop/D01-login.png` |
| D02 Runway Setup | `docs/evidence/screenshots/desktop/D02-runway-setup.png` |
| D03 Protect Essentials | `docs/evidence/screenshots/desktop/D03-protect-essentials.png` |
| D04 Runway 215 | `docs/evidence/screenshots/desktop/D04-runway-215.png` |
| D06 Purchase Check | `docs/evidence/screenshots/desktop/D06-purchase-check.png` |
| D07 Purchase 160 leaves 55 | `docs/evidence/screenshots/desktop/D07-preview-remaining-55.png` |
| D09 Purchase 300 / excess 85 | `docs/evidence/screenshots/desktop/D09-preview-excess-85.png` |
| D10 Confirmed runway 55 | `docs/evidence/screenshots/desktop/D10-confirmed-runway-55.png` |
| Mobile Runway 215 | `docs/evidence/screenshots/mobile/M04-runway-215-390.png` |
| Mobile confirmed runway 55 | `docs/evidence/screenshots/mobile/M10-confirmed-runway-55-390.png` |
| Validation example | `docs/evidence/screenshots/validation/V01-login-required.png` |

## Final Video Evidence

| File | Verified facts | Not proven |
|---|---|---|
| `C:\Dev\BUS4012\student-money-runway-evidence\video\raw\student-money-runway-desktop-demo.webm` | Exists, 18,698,258 bytes, 1440×810, approximately 6:29; metadata asserts product scenes D01–D09. | Audio is absent according to the recording report. No camera, VS Code, Cline Plan/Act, component-code demonstration, 21st.dev explanation, or props/data-flow explanation is proven in the file evidence. |
| `C:\Dev\BUS4012\student-money-runway-evidence\video\raw\student-money-runway-mobile-demo.webm` | Exists, 978,492 bytes, 390×844, approximately 0:35; metadata asserts mobile product flow. | Audio, camera, VS Code, Cline Plan/Act, and code explanation are not proven. |

`C:\Dev\BUS4012\student-money-runway-evidence.zip` contains these two WEBM files and metadata only. Final video status: **PRODUCT DEMO ONLY**. It is not evidence of a final merged 10-minute assessment video.

## Current Project ZIP and Submission-Source Status

`C:\Dev\BUS4012\Student_Money_Runway_BUS4012_AS02_Project.zip` is stale: it has 85 entries and contains `src/assets/hero.png`, although the final source tree has no such file. It excludes `node_modules`, `dist`, `.git`, `.env`, and video binaries, but predates final evidence/documentation and cannot be treated as the current final project ZIP. The current final source ZIP is `C:\Dev\BUS4012\Student_Money_Runway_BUS4012_AS02_Project_FINAL.zip`: it has 134 file entries under one root, contains all required source/manifest/P12 paths, and was verified free of `node_modules`, `dist`, `.git`, `.env`, `hero.png`, raw video files, and detected secret patterns. The review pack at `C:\Dev\BUS4012\Student_Money_Runway_BUS4012_AS02_REVIEW_PACK.zip` remains separate reviewer material.

## Final Word Repair Inputs

1. Component reuse is source-proven exactly as shown in the Component Reuse Matrix.
2. The exact props/callback path is App → RunwaySetupPage → MoneyInput → raw-value callback → typed partial state patch → App.
3. FormSection, MoneyInput, and SummaryRow original component prompts are **RECONSTRUCTED ONLY**; the original P2 prompt gap remains.
4. 21st.dev provenance is **PROMPT-BASED LOCAL ADAPTATION**, not direct registry source copy.
5. Cline, Plan Mode, and Act Mode are **MISSING / NOT PROVEN**.
6. Codex-substitution lecturer approval is **MISSING / NOT PROVEN**.
7. Ethics evidence supports minimisation, local session state, transparency, reversible preview, explicit confirmation, future-income exclusion, and factual language; policy/consent and production-data safeguards remain out of scope.
8. Novelty should be framed as the documented short-horizon protected-runway workflow, not as a claim that budgeting is novel; named competitor constraints are **MISSING / NOT PROVEN**.
9. Required product, mobile, and validation screenshot paths are listed above and exist.
10. Final video status is **PRODUCT DEMO ONLY**, not a verified ten-minute assessment recording.
11. The previous project ZIP is stale and must not be described as final; `Student_Money_Runway_BUS4012_AS02_Project_FINAL.zip` is the verified current source ZIP.

## Final Gap Classification

| Priority | Gap | Evidence consequence / next handling |
|---|---|---|
| P0 blockers | Official brief absent from accessible project; Cline Plan/Act and lecturer substitution approval not proven; final camera/VS Code-inclusive 10-minute video not proven. | Obtain official brief/lecturer guidance and only authentic external evidence where available. Do not fabricate. |
| P1 likely mark loss | Original P2 component prompts are unavailable; named competitor research is not evidenced in accessible text. | State the gap transparently; use only reconstructed classification and defensible novelty wording. |
| P2 polish | Historical P10/P11 prose still describes the now-removed `hero.png` as unreferenced; source is correct. | Use this reconciliation note rather than rewriting development history. |
| P3 optional | Final video merge/narration and manual IDE segment could be completed if authentic materials are supplied. | Keep automated product clips separate; do not claim them as the final assessment recording. |

## Maximum Defensible Evidence Status

Current application code, reusable-component reuse, calculations, screenshots, runtime verification, and prompt/21st.dev records are strong and traceable. Assessment compliance evidence is incomplete where it depends on unavailable official brief wording, original P2 prompts, authentic Cline Plan/Act records, lecturer substitution approval, named competitor research, and a final camera/VS Code-inclusive assessment video. This reconciliation does not guarantee any mark; it identifies the maximum defensible evidence available from the current project.
