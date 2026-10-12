# P7 â€” Protect Essentials and Runway Result

> Project: Student Money Runway â€” BUS4012 Assignment 02  
> Student: Thien Khuong Vu  
> Phase: P7 â€” Protect Essentials + Runway Result  
> Created: 2026-09-16T01:21:01+10:00  
> Updated: 2026-09-16T01:21:11+10:00

## 1. P7 scope

P7 implements the controlled Protect Essentials form and the calculated Runway Result screen only. Purchase Check, purchase preview, confirmation, and mutation remain deferred to P8.

## 2. Protect Essentials field model

Fixed Essentials and Flexible Essentials remain raw `string` values in `RunwayState`. Both fields use the shared `MoneyInput` component. Safety Buffer is collected once in Runway Setup and is shown as read-only context here.

## 3. State ownership

`App.tsx` owns `RunwayState` through `useState(INITIAL_RUNWAY_STATE)`. Pages receive state and `RunwayStatePatch`; no duplicate financial state or browser storage was introduced.

## 4. Money validation strategy

`src/utils/moneyValidation.ts` centralises the P6 contract: required values, non-negative decimal syntax with at most two decimal places, finite conversion, and valid zero. The existing Runway Setup behaviour now uses this same utility.

## 5. Props-down flow

```text
App.tsx
  -> ProtectEssentialsPage { runwayState, onRunwayStateChange }
    -> MoneyInput { value, onChange, error, required }
```

## 6. Callback-up flow

```text
MoneyInput onChange(rawValue)
  -> ProtectEssentialsPage
    -> onRunwayStateChange({ fixedEssentials: rawValue })
    -> App.tsx merges the typed patch into RunwayState
```

The flexible field follows the same path with `flexibleEssentials`.

## 7. Protected Total derivation

When all three protected inputs are valid, the page calls `calculateProtectedTotal(fixed, flexible, safetyBuffer)`. The result is rendered but never persisted in state.

## 8. Runway derivation

`RunwayResultPage` safely converts the valid source strings and calls `calculateRunway(available, fixed, flexible, safetyBuffer)`. The P5 formula remains unchanged.

## 9. Shortfall derivation

The result page calls `calculateProtectedShortfall(...)`. A positive value renders the factual shortfall branch; runway remains the P5-clamped non-negative value.

## 10. Source-state vs derived-data rule

Stored source values: available funds, planning date, safety buffer, fixed essentials, flexible essentials, and later purchase fields. Derived values—protected total, runway, and shortfall—are calculated directly during render and are not mutable state.

## 11. Canonical result

For available `950`, fixed `455`, flexible `180`, and buffer `100`: protected total is `735`, discretionary runway is `215`, and shortfall is `0`.

## 12. Shortfall result

For available `650` and protected total `734`: runway is `0` and shortfall is `84`. The UI states that entered protected amounts exceed available funds by the calculated difference.

## 13. Direct-route prerequisite handling

Direct `/runway` access redirects to `/setup` when setup values are incomplete. If setup is complete but either essentials amount is missing or invalid, it redirects to `/essentials`. This prevents `NaN`, `Infinity`, and misleading zero values without introducing a route-guard framework.

## 14. Normal Runway Result state

The primary display is Discretionary Runway with a SummaryRow breakdown for available funds, fixed essentials, flexible essentials, safety buffer, protected total, and runway. `Check a purchase` navigates to the existing P4 Purchase Check skeleton.

## 15. Zero-runway/no-shortfall boundary

When available funds equal protected total, the P5 functions produce runway `0` and shortfall `0`. The shortfall alert is therefore not shown.

## 16. Shortfall state

When shortfall is positive, the page presents a text-and-border alert plus `Review protected amounts`. The message is factual and does not provide financial advice.

## 17. Component reuse matrix

| Component | Screen 1 | Screen 2 | Role |
| --- | --- | --- | --- |
| FormSection | Runway Setup | Protect Essentials | Section structure |
| MoneyInput | Runway Setup | Protect Essentials | Controlled monetary input |
| SummaryRow | Protect Essentials | Runway Result | Financial summary display |

## 18. Figma references

Inspected `p03-protect-essentials-hifi.png`, `mp03-mobile-protect-essentials-hifi.png`, `p04-runway-dashboard-hifi.png`, `mp04-mobile-runway-dashboard-hifi.png`, `failure-protected-shortfall-desktop.png`, `ds-03-forms-core-controls.png`, `ds-04-financial-components.png`, `ds-06-feedback-accessibility.png`, `ds-08-responsive-architecture.png`, and the Figma reference manifest.

## 19. Responsive verification

The pages use the existing responsive Tailwind contract: stacked mobile layout and two-column desktop layout from `lg`. Browser verification covered approximately 390px and 1280px widths without horizontal overflow.

## 20. Accessibility decisions

Protect Essentials uses a semantic form, one h1, labelled controlled inputs, required semantics, visible focus rings, inline text errors, and keyboard submit. Result values are readable text; shortfall is communicated with heading, text, border, and action rather than colour alone.

## 21. Ethical-language decisions

Copy reports entered values and deterministic differences. It avoids recommendations, judgement, and claims that a purchase is safe or unsafe. Future income is not included.

## 22. P8 boundary

P8 still owns Purchase Check fields, purchase calculations, within/exceeds branches, Back Without Saving, StatusActionButton final integration, Mark as spent, and `purchaseConfirmed` mutation.
