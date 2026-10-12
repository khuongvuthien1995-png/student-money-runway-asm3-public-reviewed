# P5 — State Model and Business Logic

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P5 — State Model + Business Logic
> Created: 2026-09-16T00:01:29+10:00
> Updated: 2026-09-16T00:02:58+10:00

## State ownership and update strategy

`App.tsx` owns one `RunwayState` with React `useState`. It remains mounted while React Router changes pages, so source values can persist for the active browser session without a state library or permanent storage.

`handleRunwayStateChange(patch: RunwayStatePatch)` merges a small typed patch into the current state. This is intentionally simpler than a reducer or context provider. The P4 Login route uses a child-to-parent `onStartSession` callback to reset the in-memory state to the reusable empty initial value before its existing temporary route navigation.

## Source state

| Field | Type | Purpose | Why it is source state |
| --- | --- | --- | --- |
| `availableFunds` | `string` | Raw available-funds text | Entered by the user. |
| `planningDate` | `string` | Raw selected date | Entered by the user. |
| `safetyBuffer` | `string` | Raw safety-buffer text | Entered by the user. |
| `fixedEssentials` | `string` | Raw fixed-essentials text | Entered by the user. |
| `flexibleEssentials` | `string` | Raw flexible-essentials text | Entered by the user. |
| `purchaseName` | `string` | Raw purchase label | Entered by the user. |
| `purchaseAmount` | `string` | Raw purchase-amount text | Entered by the user. |
| `purchaseConfirmed` | `boolean` | Future explicit confirmation flag | Source event state; unused in P5. |

`INITIAL_RUNWAY_STATE` keeps all raw fields empty. The canonical AUD example is a verification case, not a silent user-session default.

### Raw form text and validated domain numbers

`MoneyInput` continues to receive and return `string` values. Empty text, partially entered decimal text, and valid monetary text are therefore all representable without `NaN` entering React state. P6–P8 will validate and convert the raw strings before they call the calculation functions. The calculation module never parses user text or renders validation errors.

## Derived values

| Value | Derived from | Function |
| --- | --- | --- |
| Protected total | Fixed essentials, flexible essentials, safety buffer | `calculateProtectedTotal` |
| Discretionary runway | Available funds and protected amounts | `calculateRunway` |
| Protected shortfall | Available funds and protected amounts | `calculateProtectedShortfall` |
| Purchase remaining | Current runway and purchase amount | `calculatePurchaseRemaining` |
| Purchase exceeds runway | Current runway and purchase amount | `doesPurchaseExceedRunway` |
| Purchase excess | Current runway and purchase amount | `calculatePurchaseExcess` |

Derived values are not stored in `RunwayState`, avoiding duplicate mutable sources of truth.

## Pure calculation contracts

All functions in `src/utils/runwayCalculations.ts` accept validated, finite, non-negative numeric domain values. Validation is deliberately deferred to page-level P6–P8 interactions.

```text
Protected Total = F + V + B
Runway = MAX(0, A - F - V - B)
Shortfall = MAX(0, F + V + B - A)
Purchase Remaining = MAX(0, R - P)
Purchase Exceeds = P > R
Purchase Excess = MAX(0, P - R)
```

## Props down and callbacks up

```text
App.tsx
│
│ owns RunwayState and handleRunwayStateChange(patch)
│
├── LoginPage
│      ↑ onStartSession()
│
├── RunwaySetupPage
│      ↓ runwayState
│      │
│      └── MoneyInput (P6 connection)
│             ↑ onChange(rawValue)
│
├── ProtectEssentialsPage
├── RunwayResultPage
├── PurchaseCheckPage
└── ResultPage

runwayCalculations.ts
└── receives validated numbers only; independent of React rendering
```

P5 establishes the parent ownership, typed patch callback, and Setup state prop. P6 will complete the visible `RunwaySetupPage → MoneyInput → onRunwayStateChange → App` connection rather than creating a temporary debug input in P5.

## Canonical verification cases

| Case | Expected | Actual |
| --- | --- | --- |
| Protected total: `455 + 180 + 100` | `735` | `735` |
| Runway: `950 - 455 - 180 - 100` | `215` | `215` |
| Shortfall: protected `734`, available `650` | `84`; runway `0` | `84`; runway `0` |
| Purchase `160` against runway `215` | remaining `55`; exceeds `false` | remaining `55`; exceeds `false` |
| Purchase `215` against runway `215` | remaining `0`; exceeds `false` | remaining `0`; exceeds `false` |
| Purchase `300` against runway `215` | remaining `0`; exceeds `true`; excess `85` | remaining `0`; exceeds `true`; excess `85` |

The cases were verified with the existing TypeScript compiler and Node runtime; no test framework was added.

## Preview versus confirmation

Purchase-preview utilities are read-only. P5 does not change `purchaseConfirmed`, mutate financial inputs, or connect `StatusActionButton`. Explicit purchase confirmation and its effect belong exclusively to P8.

## Deliberately deferred to P6–P8

- Login validation and final frontend login interaction.
- Controlled setup, essentials, and purchase fields with validation UX.
- Conversion of valid raw input strings into calculation inputs.
- Calculated financial presentation and purchase-impact status.
- Purchase confirmation, mutation, and final result behaviour.

## Assessment video candidate

Use the eventual P6 path: `App` owns `availableFunds`; `RunwaySetupPage` receives it as a prop; reusable `MoneyInput` receives `value`, label, and configuration; `MoneyInput.onChange(rawValue)` reports upward through `RunwaySetupPage` to `App`’s typed patch callback. This demonstrates props down, callbacks up, controlled inputs, and business-logic separation without making `MoneyInput` responsible for runway formulas.
