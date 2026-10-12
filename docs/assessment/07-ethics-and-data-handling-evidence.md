# Ethics and Data Handling Evidence

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Status: Current source evidence
> Created: 2026-09-16T02:59:07+10:00
> Updated: 2026-09-16T02:59:07+10:00

| Principle | Source evidence |
|---|---|
| Factual rather than advisory language | Runway and Result pages use labels such as Available Funds, Protected Total, Discretionary Runway, and Exceeds your current discretionary runway. |
| No safe/unsafe or affordability judgement | `PurchaseCheckPage.tsx` and `ResultPage.tsx` describe calculated impact, not whether a user should buy. |
| Transparent calculation | `runwayCalculations.ts` provides deterministic protected total, runway, shortfall, remaining, exceeds, and excess utilities. |
| Future income excluded | `RunwayState` has no future-income field; current inputs are the only calculation sources. |
| Reversible preview | Purchase preview is calculated in ResultPage without mutating available funds. |
| Explicit confirmation | Only `App.tsx` `handlePurchaseConfirmation` changes available funds, after the explicit `Mark as spent` action. |
| Back without saving | ResultPage provides `Back without saving`, returning to the purchase draft without a financial mutation. |
| Minimal data and privacy | LoginPage state remains local; no backend, bank integration, localStorage, sessionStorage, IndexedDB, or remote API is used. |

P10 reviewed ethics, validation, accessibility, and privacy controls. This MVP is a planning aid, not financial advice.
