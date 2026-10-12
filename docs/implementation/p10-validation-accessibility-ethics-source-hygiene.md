# P10 — Validation, Accessibility, Ethics and Source Hygiene

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P10 — Validation + Accessibility + Ethics + Source Hygiene
> Created: 2026-09-16T02:21:24+10:00
> Updated: 2026-09-16T02:21:24+10:00

## 1. Scope

P10 hardens validation feedback, accessible form semantics, focus visibility, source-header encoding, and ethical/privacy safeguards. It does not alter routes, shared state ownership, financial formulas, persistence, or product scope.

## 2. Source files audited

Seventeen human-authored TypeScript, TSX, and CSS files under `src/` were inventoried. The binary runtime asset `src/assets/hero.png` is not a human-authored source file and was not included in the header audit.

| File | Encoding issue | Header issue | Comment issue | Material P10 change | Result |
|---|---|---|---|---|---|
| `src/App.tsx` | Double-encoded em dash | `@project`, `@phase` | NONE | No | PASS |
| `src/main.tsx` | NONE | NONE | NONE | No | PASS |
| `src/index.css` | NONE | NONE | NONE | No | PASS |
| `src/components/layout/AppShell.tsx` | NONE | NONE | NONE | No | PASS |
| `src/components/ui/FormSection.tsx` | NONE | NONE | NONE | No | PASS |
| `src/components/ui/MoneyInput.tsx` | NONE | NONE | NONE | Yes | PASS |
| `src/components/ui/StatusActionButton.tsx` | NONE | NONE; 21st.dev source retained | NONE | No | PASS |
| `src/components/ui/SummaryRow.tsx` | NONE | NONE | NONE | No | PASS |
| `src/pages/LoginPage.tsx` | NONE | NONE | NONE | Yes | PASS |
| `src/pages/RunwaySetupPage.tsx` | NONE | NONE | NONE | Yes | PASS |
| `src/pages/ProtectEssentialsPage.tsx` | Double-encoded em dash | `@project`, `@phase` | NONE | No | PASS |
| `src/pages/RunwayResultPage.tsx` | NONE | NONE | NONE | No | PASS |
| `src/pages/PurchaseCheckPage.tsx` | Double-encoded em dash | `@project`, `@phase` | Yes | Yes | PASS |
| `src/pages/ResultPage.tsx` | Double-encoded em dash | `@project`, `@phase` | NONE | No | PASS |
| `src/types/runway.ts` | NONE | NONE | NONE | No | PASS |
| `src/utils/moneyValidation.ts` | Double-encoded em dash | `@project`, `@phase` | NONE | No | PASS |
| `src/utils/runwayCalculations.ts` | NONE | NONE | NONE | No | PASS |

## 3. Encoding, headers, and comments

The initial source sweep found five files containing a double-encoded em dash in `@project` and/or `@phase`: `App.tsx`, `ProtectEssentialsPage.tsx`, `PurchaseCheckPage.tsx`, `ResultPage.tsx`, and `moneyValidation.ts`. Each was corrected to the UTF-8 em dash (`—`). A final code-point search for `U+00C3`, `U+00C2`, and `U+FFFD` across all 17 audited files returned clean.

All source headers now use repository-relative paths, the correct project and student fields, and an implementation-appropriate phase. Existing `@createdAt` values were preserved. Header-only fixes preserved their substantive `@updatedAt` values. No redundant or misleading inline comments were found; the existing 21st.dev provenance remains on `StatusActionButton.tsx`.

## 4. Material P10 corrections

- `MoneyInput.tsx`: removed focus-ring clipping from the control wrapper and gave visible error text `role="alert"`.
- `LoginPage.tsx`: gave submitted email and password error text `role="alert"`.
- `RunwaySetupPage.tsx`: added native `required` semantics to Planning Date and gave its visible error text `role="alert"`.
- `PurchaseCheckPage.tsx`: gave the purchase-name error text `role="alert"`.

The material files retain their original `@createdAt` values and record P10 `@phase` and substantive Melbourne timestamps.

## 5. Validation audit

| Area | Issue | Fix | Result |
|---|---|---|---|
| Login | Required and reasonable email syntax checks already present | None | PASS |
| Setup | Planning Date was visually required but lacked native required semantics | Added `required` | PASS |
| AUD fields | Shared raw-text validation already rejects empty, negative, malformed, non-finite, and over-precision input | None | PASS |
| Zero handling | Buffer and essentials accept zero; purchase amount rejects zero | None | PASS |
| Purchase name | Whitespace-only input is rejected | None | PASS |
| Error priority | Required, format, then purchase domain rule are shown one at a time | None | PASS |

No domain-sensitive invalid-to-zero coercion was found. Raw monetary source values remain strings.

## 6. Accessibility and keyboard audit

All routed screens have one primary `h1`, labelled fields, native forms/buttons/links, logical heading order, and appropriate button types. Errors are associated through `aria-invalid` and `aria-describedby`; their text now also uses restrained alert semantics when shown. Global and component-specific focus styles remain visible, and the MoneyInput wrapper no longer clips its focus ring.

Navigation uses named `nav` landmarks. Mobile icons are `aria-hidden` because their visible labels supply the accessible name. The StatusActionButton remains a native button with disabled/busy semantics, a useful polite live message, keyboard activation, and reduced-motion handling. Shortfall, within-runway, exceeds-runway, and confirmed states all include textual communication rather than colour alone.

## 7. Ethics, privacy, and security

Case-insensitive source searches covered: safe, unsafe, good, bad, smart, stupid, responsible, irresponsible, afford, affordable, recommend, purchase-choice language, financial advice, going broke, risky, risk-free, secure, encrypted, bank-level, and authenticated. No user-facing financial advice, affordability claim, judgemental spending copy, or unsupported authentication/security claim required change.

The purchase preview remains explicitly non-mutating; `Mark as spent` is the sole confirmation mutation. Future income is not represented. Searches found no sensitive console logging, browser storage, IndexedDB, remote API, credential persistence, or password inclusion in `RunwayState`.

## 8. Business and direct-route regression

| Case | Expected | Actual | Result |
|---|---:|---:|---|
| Protected total: 455 + 180 + 100 | 735 | 735 | PASS |
| Runway: 950 - 735 | 215 | 215 | PASS |
| Canonical shortfall | 0 | 0 | PASS |
| Shortfall: 650 against 734 protected | 84 | 84 | PASS |
| Purchase 160 from runway 215 | 55 remaining | 55 | PASS |
| Purchase 215 from runway 215 | 0; exceeds false | 0; false | PASS |
| Purchase 300 from runway 215 | 0 remaining; 85 excess | 0; 85 | PASS |
| Exact protection: 735 available / 735 protected | runway 0; shortfall 0 | 0; 0 | PASS |
| Confirmed purchase | 950 to 790; runway 55 | guarded single mutation in App | PASS |

The source guards keep fresh direct visits to `/runway`, `/purchase`, and `/result` on deterministic prerequisite redirects before any amount is rendered. No derived financial result is mutable React state and no calculation synchronization effect exists.

## 9. Responsive regression and limitations

The P10 DOM and class changes preserve the existing responsive tokens and do not add fixed-width controls. Source review confirms the changed controls retain full-width mobile behaviour and desktop layout compatibility at 390px and 1280px. Browser/runtime verification is limited to manual local development checks; this is an accessibility audit, not WCAG certification or a comprehensive automated accessibility test.

## 10. P11 boundary

P11 work is explicitly deferred: final full-application QA, rubric traceability, Cline evidence audit, prompt-document evidence assembly, reusable-component and 21st.dev evidence capture, video walkthrough planning, submission ZIP audit, node_modules exclusion, and final assessment-readiness decision.
