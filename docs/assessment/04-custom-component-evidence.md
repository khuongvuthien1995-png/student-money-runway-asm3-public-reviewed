# Custom Component Evidence

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Status: Actual source-reuse evidence
> Created: 2026-09-16T02:59:07+10:00
> Updated: 2026-09-16T02:59:07+10:00

| Component | Source and role | Current props | Actual reuse | Prompt provenance |
|---|---|---|---|---|
| FormSection | `src/components/ui/FormSection.tsx`; titled grouping with optional description and children | `title`, `description?`, `children`, `className?` | Runway Setup, Protect Essentials, Purchase Check | RECONSTRUCTED FROM P2 DEVELOPMENT HISTORY; no dedicated preserved P2 prompt file. |
| MoneyInput | `src/components/ui/MoneyInput.tsx`; controlled AUD text input with helper/error states | `id`, `label`, `value`, `onChange`, helper/error/required/disabled/className/onBlur options | Runway Setup, Protect Essentials, Purchase Check | RECONSTRUCTED FROM P2 DEVELOPMENT HISTORY; no dedicated preserved P2 prompt file. |
| SummaryRow | `src/components/ui/SummaryRow.tsx`; label/value financial summary presentation | `label`, `value`, `supportingText?`, `emphasis?`, `className?` | Protect Essentials, Runway Result, Purchase Check, Result | RECONSTRUCTED FROM P2 DEVELOPMENT HISTORY; no dedicated preserved P2 prompt file. |

All three are custom project components. StatusActionButton is intentionally excluded because it is the separately documented 21st.dev-sourced component.
