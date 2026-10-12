# Props and Callback Data Flow

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Status: Current source architecture
> Created: 2026-09-16T02:59:07+10:00
> Updated: 2026-09-16T02:59:07+10:00

```text
App.tsx owns RunwayState
  ↓ runwayState, onRunwayStateChange
RunwaySetupPage.tsx
  ↓ id, label, value, onChange
MoneyInput.tsx
  ↑ onChange(rawValue)
RunwaySetupPage.tsx
  ↑ onRunwayStateChange({ availableFunds: rawValue })
App.tsx updates source state
```

`App.tsx` owns the source state with `useState(INITIAL_RUNWAY_STATE)` and supplies `runwayState` plus `handleRunwayStateChange` to RunwaySetupPage. The page supplies the controlled value and `onChange` to MoneyInput. MoneyInput only forwards raw monetary text; it does not parse business values, calculate runway, mutate central state, or navigate. This keeps it reusable on Setup, Essentials, and Purchase Check.
