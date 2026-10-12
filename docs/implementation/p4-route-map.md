# P4 — Route Map and Page Architecture

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P4 — Router + Page Skeletons
> Created: 2026-09-15T23:23:08+10:00
> Updated: 2026-09-15T23:25:56+10:00

## Route table

| Route | Page | File | P4 purpose |
| --- | --- | --- | --- |
| `/login` | LoginPage | `src/pages/LoginPage.tsx` | Establishes the entry and future login-action location. |
| `/setup` | RunwaySetupPage | `src/pages/RunwaySetupPage.tsx` | Establishes the first focused setup step. |
| `/essentials` | ProtectEssentialsPage | `src/pages/ProtectEssentialsPage.tsx` | Establishes protected-expense regions. |
| `/runway` | RunwayResultPage | `src/pages/RunwayResultPage.tsx` | Establishes discretionary-runway result regions. |
| `/purchase` | PurchaseCheckPage | `src/pages/PurchaseCheckPage.tsx` | Establishes proposed-purchase and preview regions. |
| `/result` | ResultPage | `src/pages/ResultPage.tsx` | Establishes the purchase-impact preview and confirmation region. |

## Route handling

- `BrowserRouter` has one owner: `src/main.tsx`, surrounding `App` at the application root.
- `App.tsx` contains the `Routes` composition only.
- `/` redirects with `replace` to `/login`.
- The wildcard route redirects with `replace` to `/login`, keeping unknown URLs deterministic without creating a separate error route.

## Main route flow

```text
/login
  ↓
/setup
  ↓
/essentials
  ↓
/runway
  ↓
/purchase
  ↓
/result
```

P4 links are temporary structural navigation, not evidence that forms or authentication have succeeded.

## Back navigation map

| From | Back target |
| --- | --- |
| `/setup` | `/login` |
| `/essentials` | `/setup` |
| `/runway` | `/essentials` |
| `/purchase` | `/runway` |
| `/result` | `/purchase` |

## Desktop and mobile navigation

`AppShell` is used on the ongoing application contexts: Runway Result, Purchase Check, and Purchase Impact Result. It provides a top navigation bar at `lg` (1024px) and a fixed three-item text bottom navigation below `lg`, following the responsive navigation references. The focused setup and essentials wizard steps retain their own contextual Back/step navigation; Login remains a focused entry screen.

This is one responsive route system. Page regions stack naturally at small widths and use the P1 `lg` breakpoint for desktop columns.

## AppShell decision

Created: **YES** — `src/components/layout/AppShell.tsx` has one structural responsibility: repeated navigation and content boundaries for the product-context pages. It is not an assessed P2 component and does not contain financial presentation or business logic.

## P4 scope exclusions

- No authoritative financial state, form input values, or purchase state.
- No runway, protected-total, purchase-impact, or shortfall calculations.
- No login validation, authentication, persistence, backend, or packages.
- No real purchase mutation and no `StatusActionButton` confirmation integration.

## P5 hand-off

P5 can introduce the shared frontend state model and pure financial calculation utilities. P6–P8 can then replace each skeleton region with controlled forms and factual calculated presentation without changing the route contract.
