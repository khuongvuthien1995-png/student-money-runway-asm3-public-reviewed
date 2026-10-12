# P9 — Responsive and Figma QA

> Project: Student Money Runway — BUS4012 Assignment 02  
> Student: Thien Khuong Vu  
> Phase: P9 — Responsive + Figma Matching  
> Created: 2026-09-16T02:03:54+10:00  
> Updated: 2026-09-16T02:03:54+10:00

## 1. Scope

P9 improves responsive composition and Figma-aligned visual consistency only. No business rules, calculation utilities, source-state ownership, routes, or confirmation semantics were changed.

## 2. References inspected

The audit used the P1–P8 implementation documents, the master context, Figma manifest, desktop/mobile P1–P6 screens, protected-shortfall and confirmed-success states, bottom-navigation reference, and DS-01/02/03/04/06/08.

## 3. Breakpoint contract

Mobile is below 768px, tablet spans 768px–1024px, and desktop is above 1024px. Content continues to use the existing 1280px maximum and 390px mobile reference.

## 4. Corrections

- AppShell mobile navigation now uses icon-plus-label items and a top active-state border; desktop retains text-first top navigation.
- SummaryRow uses responsive wrapping and word-breaking so long labels, supporting text, and larger AUD values remain readable.
- StatusActionButton is full-width on mobile but content-width on desktop action rows.
- Login aligns naturally from the top on mobile, while retaining centred desktop presentation.
- Result purchase names wrap instead of forcing a narrow-screen overflow.

## 5. Route QA matrix

| Route | 390px | 768px | 1024px | 1280px |
| --- | --- | --- | --- | --- |
| /login | PASS | PASS | PASS | PASS |
| /setup | PASS | PASS | PASS | PASS |
| /essentials | PASS | PASS | PASS | PASS |
| /runway | PASS | PASS | PASS | PASS |
| /purchase | PASS | PASS | PASS | PASS |
| /result | PASS | PASS | PASS | PASS |

## 6. Route-specific findings

Login keeps a bounded form width on desktop and practical gutters on mobile. Setup and Essentials retain focused wizard headers, mobile stacking, and their desktop form/summary balance. Runway retains a prominent money display in normal, zero, and shortfall states. Purchase Check preserves the form/context layout. Result keeps within, exact, exceeds, and confirmed branches readable with responsive action layout.

## 7. Navigation and overflow

The fixed mobile nav remains inside AppShell with existing bottom content space. Summary rows and long purchase names now wrap rather than overlap. The layout avoids fixed content widths and uses mobile-first stacking with the approved breakpoints.

## 8. Large-value and long-text checks

The SummaryRow changes support values such as AUD 9,999.99 and AUD 99,999.99 without fixed-width clipping. Long purchase text such as “Monthly public transport pass” wraps in the Result preview heading.

## 9. Business regression

| Case | Expected | Actual | Result |
| --- | ---: | ---: | --- |
| Protected Total | 735 | 735 | PASS |
| Runway | 215 | 215 | PASS |
| Protected Shortfall | 84 | 84 | PASS |
| Purchase 160 remaining | 55 | 55 | PASS |
| Purchase 300 excess | 85 | 85 | PASS |
| Confirmed Available Funds | 790 | 790 | PASS |
| Updated Runway | 55 | 55 | PASS |

Preview remains non-mutating; explicit confirmation remains the sole purchase mutation; direct-route guards remain in place.

## 10. Component-level changes

AppShell, SummaryRow, StatusActionButton, LoginPage, and ResultPage received visual-only class/markup changes. FormSection and MoneyInput required no P9 changes.

## 11. Deferred P10 scope

P10 remains responsible for final validation consistency, comprehensive keyboard and accessibility audit, semantic/ARIA hardening, final contrast review, ethics-language search, and edge-case validation hardening.
