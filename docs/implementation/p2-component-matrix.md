# P2 — Custom Reusable Component Matrix

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P2 — Custom Reusable UI Kit
> Created: 2026-09-15T22:14:43+10:00
> Updated: 2026-09-15T22:25:02+10:00

## FormSection

| Item                        | Decision                                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Assessment role             | Custom Reusable Component #1                                                                                                        |
| Responsibility              | Standardises repeated form-section structure, heading presentation, optional explanatory text, spacing, and desktop card treatment. |
| Actual props                | `title: string`, `description?: string`, `children: ReactNode`, `className?: string`                                                |
| Planned visible reuse       | Runway Setup; Protect Essentials                                                                                                    |
| Purchase Check              | Not planned for reuse. Its Hi-Fi reference is a single consolidated purchase form rather than repeated form sections.               |
| React concepts demonstrated | Reusable component, props, children, and composition.                                                                               |

### Reuse evidence

- **Runway Setup:** wraps related Funding & Timeline and Safety Buffer content groups.
- **Protect Essentials:** wraps Fixed Essentials and Flexible Essentials groups.

On mobile, the component keeps the same readable document structure while the desktop card treatment is deferred to the `lg` breakpoint. This matches the Figma references, where form groups become vertically focused at mobile widths.

### Semantic heading contract

`FormSection` renders an `h2`. A consuming page must provide its page-level `h1` before using the component. This keeps the props API small while providing a predictable heading hierarchy on the two planned screens.

## MoneyInput

| Item                        | Decision                                                                                                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Assessment role             | Custom Reusable Component #2                                                                                                                                                                   |
| Responsibility              | Presents a controlled AUD monetary field with label, currency affordance, helper text, error text, and disabled state.                                                                         |
| Actual props                | `id: string`, `label: string`, `value: string`, `onChange: (value: string) => void`, `helperText?: string`, `error?: string`, `required?: boolean`, `disabled?: boolean`, `className?: string` |
| Controlled-input strategy   | `value` remains raw text so empty, partial, and decimal input are represented without coercion or `NaN`. The parent performs any later parsing and validation.                                 |
| Planned visible reuse       | Runway Setup (Available Funds, Safety Buffer); Protect Essentials (Fixed Essentials, Flexible Essential Allowance); Purchase Check (Purchase Amount).                                          |
| React concepts demonstrated | Props down and callback up through a controlled input.                                                                                                                                         |

### Data-flow evidence

`RunwaySetupPage` supplies `label`, `value`, `error`, and configuration props to `MoneyInput`. `MoneyInput` calls `onChange(newValue)` with raw user-entered text. The parent page owns the financial state and all business validation.

### Accessibility behaviour

- The visible label is associated with the input through `htmlFor` and `id`.
- `required`, `disabled`, `aria-invalid`, and `aria-describedby` are applied when relevant.
- Helper and error text are available to assistive technology; error text does not rely on colour alone.
- The control has the P1 48px minimum height and supports decimal keyboards through `inputMode="decimal"`.

## SummaryRow

| Item                        | Decision                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Assessment role             | Custom Reusable Component #3                                                                                                                                             |
| Responsibility              | Presents a label, display-ready value, optional supporting text, and a small set of Figma-supported emphasis treatments. It does not calculate or mutate financial data. |
| Actual props                | `label: string`, `value: ReactNode`, `supportingText?: string`, `emphasis?: 'default'                                                                                    | 'strong' | 'positive' | 'warning' | 'danger'`, `className?: string` |
| Supported emphasis          | `default` for ordinary values; `strong` for primary financial outcomes; `positive`, `warning`, and `danger` for existing P1 semantic states.                             |
| Planned visible reuse       | Protect Essentials; Runway Result; Result / Confirmation.                                                                                                                |
| React concepts demonstrated | Reusable presentational component with props-down display data.                                                                                                          |

### Reuse evidence

- **Protect Essentials:** Fixed Essentials, Flexible Essentials, Safety Buffer, and Protected Total.
- **Runway Result:** Available Funds, Protected Total, and Discretionary Runway.
- **Result / Confirmation:** Runway Before, Purchase Amount, and Remaining Runway.

### Accessibility behaviour

- The row uses valid generic grouping markup, so multiple instances can be safely composed in cards, lists, or other parent structures.
- Label, value, and supporting text remain separate readable text nodes; long labels and values can wrap without overflow.
- Emphasis is visual only. Parents must supply factual supporting text whenever a state needs to be communicated, so meaning is not conveyed by colour alone.
