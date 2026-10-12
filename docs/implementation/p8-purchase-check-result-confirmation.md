# P8 — Purchase Check, Result and Confirmation

> Project: Student Money Runway — BUS4012 Assignment 02  
> Student: Thien Khuong Vu  
> Phase: P8 — Purchase Check + Result + Explicit Confirmation  
> Created: 2026-09-16T01:42:49+10:00  
> Updated: 2026-09-16T01:42:49+10:00

## 1. P8 scope

P8 implements the controlled Purchase Check form, non-mutating Purchase Impact Preview, exceeds-runway branch, and explicit confirmation flow. P9 responsive parity work remains deferred.

## 2. Purchase Check fields

Purchase Name is a controlled text input bound to `runwayState.purchaseName`. Purchase Amount uses the reusable `MoneyInput` bound to `runwayState.purchaseAmount`.

## 3. Purchase validation rules

The name must contain non-whitespace text. Purchase Amount reuses the established decimal-money contract, rejects empty/malformed/negative/non-finite values, and additionally requires a value greater than zero. Zero is not a meaningful purchase preview.

## 4. Props-down flow

~~~
App.tsx
  -> PurchaseCheckPage { runwayState, onRunwayStateChange }
    -> MoneyInput { value, onChange, error, required }
~~~

## 5. Callback-up flow

~~~
MoneyInput onChange(rawValue)
  -> PurchaseCheckPage
    -> onRunwayStateChange({ purchaseAmount: rawValue })
    -> App.tsx merges the raw string into RunwayState
~~~

## 6. Current Runway derivation

Purchase Check converts validated source strings and calls `calculateRunway(...)`. It does not store a runway copy in React state.

## 7. Preview architecture

`/purchase` validates the draft and navigates to `/result`. Result derives current runway, remaining runway, exceeds status, and excess using the P5 purchase utilities.

## 8. Preview-is-not-mutation invariant

Preview navigation changes no financial source fields. `availableFunds` and `purchaseConfirmed` remain unchanged until the explicit confirmation callback runs.

## 9. Within-runway branch

When purchase amount is less than or equal to current runway, Result shows “Within your current discretionary runway”, runway before, purchase amount, remaining runway, and the `StatusActionButton` labelled “Mark as spent”.

## 10. Exact-runway boundary

For runway `215` and purchase `215`, `doesPurchaseExceedRunway` is false and remaining runway is `0`. Confirmation remains available.

## 11. Exceeds-runway branch

When the purchase exceeds runway, Result shows the factual excess amount and provides Edit Purchase / Back Without Saving. “Mark as spent” is not rendered.

## 12. Purchase Excess calculation

`calculatePurchaseExcess(currentRunway, purchaseAmount)` owns the excess calculation. For `215` and `300`, the result is `85`.

## 13. Back Without Saving behaviour

Back Without Saving navigates to `/purchase` without changing source state. The draft remains available for editing, and no confirmation flag is set.

## 14. StatusActionButton final integration

The existing P3 21st.dev-derived `StatusActionButton` is used for the eligible confirmation action. Its API remains unchanged; the page supplies `state="idle"` and the typed confirmation callback. The synchronous source update rerenders the confirmed branch, so no artificial delay or fake network state is introduced. Existing reduced-motion handling is preserved.

## 15. Explicit confirmation callback

~~~
ResultPage
  -> StatusActionButton “Mark as spent”
    -> onConfirmPurchase()
      -> App.tsx defensive validation and eligibility check
        -> availableFunds -= purchaseAmount
        -> purchaseConfirmed = true
~~~

## 16. Available Funds mutation

Only App mutates `availableFunds`, using cents-safe rounding before serialising the new raw string. For the canonical case, `950 - 160` becomes `"790"`.

## 17. Why Runway itself is not mutated

Runway remains a deterministic result of source state. After confirmation, the reduced available funds naturally derive the updated runway.

## 18. Double-subtraction protection

The confirmed Result branch renders the runway derived from already-reduced available funds. It does not call purchase-remaining arithmetic, so it cannot calculate `55 - 160`.

## 19. Double-confirmation protection

App returns the unchanged state when `purchaseConfirmed` is already true. The confirmed branch replaces the active confirmation control, preventing a second subtraction.

## 20. Confirmed-success branch

The success branch reports Purchase recorded, the recorded name and amount, and the updated discretionary runway. It offers View updated runway and Check another purchase.

## 21. Component reuse

| Component | Actual rendered reuse |
| --- | --- |
| FormSection | Runway Setup, Protect Essentials, Purchase Check |
| MoneyInput | Runway Setup, Protect Essentials, Purchase Check |
| SummaryRow | Protect Essentials, Runway Result, Purchase Check, Result |
| StatusActionButton | Result within-runway confirmation |

## 22. Figma references

Inspected `p05-purchase-check-hifi.png`, `mp05-mobile-purchase-check-hifi.png`, `p06-purchase-impact-preview-hifi.png`, `mp06-mobile-purchase-impact-preview-hifi.png`, success dashboard desktop/mobile references, DS-03, DS-04, DS-06, DS-08, and the Figma manifest.

## 23. Accessibility

Purchase Check uses a semantic form, labels, required controls, touched/submission-aware text errors, associated descriptions, visible focus, and keyboard submission. Preview status is communicated with text, not colour alone. StatusActionButton remains a semantic keyboard-accessible button with disabled and reduced-motion behavior from P3.

## 24. Ethical language

The preview uses factual “within” and “exceeds” language. It does not claim that a purchase is safe, recommended, affordable, good, or bad, and does not provide financial advice.

## 25. Responsive verification

The implementation uses the existing responsive Tailwind contract, stacked actions on smaller widths, and minimum control heights. Runtime smoke checks were performed through the Vite URL; detailed cross-screen parity remains P9 work.

## 26. P9 boundary

P9 owns final responsive/Figma parity, spacing polish, typography parity, navigation parity, overflow checks, and breakpoint consistency. No P9 implementation is included here.
