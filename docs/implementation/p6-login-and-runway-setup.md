# P6 - Login and Runway Setup

> Project: Student Money Runway - BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P6 - Login + Runway Setup
> Created: 2026-09-16T00:16:07+10:00
> Updated: 2026-09-16T00:25:13+10:00

## Scope implemented

P6 converts Login and Runway Setup from structural skeletons into the first functional frontend flow:

```text
/login  ->  valid frontend form  ->  /setup  ->  valid controlled setup form  ->  /essentials
```

No backend authentication, final Essentials form, runway result UI, purchase flow, or confirmation mutation was added.

## Login implementation

`LoginPage` owns `email`, `password`, touched flags, and submission state locally. Credentials never enter `RunwayState`, URL parameters, browser storage, or any service.

The semantic form contains labelled `email` and `password` controls with `name`, `id`, `type`, and autocomplete attributes. Validation is intentionally small:

- Email is required and must match a simple email-like pattern.
- Password is required and non-empty.
- Errors appear after blur or submit, not on the initial render.
- Valid submission calls App's `onStartSession` callback and navigates synchronously to `/setup`.

This is a frontend MVP entry point, not real account authentication. The UI does not claim an account exists or report backend credential failures.

## Runway Setup implementation

`RunwaySetupPage` receives `runwayState` and `onRunwayStateChange` from `App.tsx`.

- Available Funds uses the existing `MoneyInput` component with `value={runwayState.availableFunds}`.
- Safety Buffer uses the existing `MoneyInput` component with `value={runwayState.safetyBuffer}`.
- Planning Date uses a controlled native `input type="date"`.
- Every edit forwards a typed `Partial<RunwayState>` patch to App.
- Local touched/submitted flags control when field errors are shown.
- Valid money accepts whole numbers, zero, and up to two decimal places; negative, empty, malformed, and non-finite values are rejected.
- Planning Date is required and must contain a native date value. No unsupported date-range rule was added.
- Invalid submission stays on `/setup`; valid submission navigates synchronously to `/essentials`.

Money values remain raw strings while editing. The page validates them but does not rewrite formatting or pass invalid values to calculation utilities. No P5-derived value is stored or displayed here.

## Small component contract extension

P6 adds optional `onBlur?: () => void` to `MoneyInputProps`. The existing required props and controlled `value`/`onChange` contract remain unchanged. This lets the reusable field report blur interaction to the page's touched-validation layer while retaining presentation-only responsibility.

## Data flow

```text
App.tsx
  | owns RunwayState and handleRunwayStateChange(patch)
  |
  +-- LoginPage
  |      +-- onStartSession() callback resets the empty session
  |
  +-- RunwaySetupPage
         +-- runwayState.availableFunds --props down--> MoneyInput.value
         +-- runwayState.safetyBuffer ----props down--> MoneyInput.value
         +-- MoneyInput.onChange(rawValue)
         +-- onRunwayStateChange(patch) --callback up--> App.tsx
```

The parent owns authoritative shared values. `MoneyInput` only presents the control and reports raw text. Login password state remains page-local.

## Accessibility and responsive behaviour

- Both screens use semantic forms or native controls and one clear page-level `h1`.
- Labels are associated with controls using `htmlFor`/`id`.
- Invalid fields expose `aria-invalid` and `aria-describedby` connected to visible error text.
- Focus remains visible through the existing global focus foundation and explicit control focus styles.
- Controls use the P1 minimum interaction height.
- Setup sections remain stacked on small screens and use the approved `lg` two-column structure on desktop.
- No validation meaning relies on colour alone; every error includes text.

## Verification matrix

| Case | Expected result | Result |
| --- | --- | --- |
| L1 empty email/password | Stay on `/login`; show required errors after submit | PASS by form validation path |
| L2 invalid email, non-empty password | Stay on `/login`; show email-format error | PASS by validation path |
| L3 valid email/password | Reset session and navigate to `/setup` | PASS by submit handler |
| L4 keyboard submission | Email -> password -> submit; Enter submits | PASS by native form semantics |
| S1 empty setup | Stay on `/setup`; show required errors after submit | PASS by setup validation |
| S2 negative available funds | Reject with non-negative error | PASS |
| S3 negative safety buffer | Reject with non-negative error | PASS |
| S4 valid whole numbers/date | Preserve strings and navigate to `/essentials` | PASS |
| S5 valid decimals | Accept raw decimal strings and navigate | PASS |
| S6 zero buffer | Accept `0` | PASS |
| S7 back navigation | App-owned values remain mounted during route changes | PASS structurally |

The existing project has no test runner, so no test framework was installed. Lint and build are the automated project checks for this phase.

## Deferred work

P7 owns the final Protect Essentials form, fixed/flexible essential values, protected-total display, and Runway Result integration. Purchase Check, purchase impact, `StatusActionButton` confirmation, and "Mark as spent" mutation remain deferred to P8.
