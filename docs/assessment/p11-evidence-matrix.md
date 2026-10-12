# P11 — Assessment Evidence Matrix

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: P11 — Final QA + Assessment Evidence
> Created: 2026-09-16T02:31:09+10:00
> Updated: 2026-09-16T02:31:09+10:00

| Requirement | Evidence file | Code location | Video evidence | Prompt evidence | Status | Notes |
|---|---|---|---|---|---|---|
| Login and entry | P6/P11 implementation docs | `LoginPage.tsx` | Login screen and valid transition | P6 prompt | READY TO CAPTURE | Frontend-only wording is present. |
| Information entry | P6/P7/P8 docs | Setup, Essentials, Purchase pages | Show all three forms | P6–P8 prompts | READY TO CAPTURE | Labels and validation are present. |
| Results | P7/P8/P11 docs | RunwayResultPage, ResultPage | Canonical, shortfall, within, exceeds, confirmed | P7/P8 prompts | READY TO CAPTURE | Show facts, not financial advice. |
| Reusable FormSection | P2 matrix | Setup, Essentials, Purchase | Setup + Essentials | Missing dedicated P2 prompt file | PARTIAL | Source reuse is verified; original prompt evidence is absent. |
| Reusable MoneyInput | P2 matrix | Setup, Essentials, Purchase | Setup + Essentials + Purchase | Missing dedicated P2 prompt file | PARTIAL | Source reuse and controlled flow are verified. |
| Reusable SummaryRow | P2 matrix | Essentials, Runway, Purchase, Result | Essentials + Runway + Result | Missing dedicated P2 prompt file | PARTIAL | Source reuse is verified. |
| 21st.dev component | P3 records | StatusActionButton + ResultPage | Mark as spent action | P3 original prompt | READY TO CAPTURE | Ruixen UI Dynamic Status Button; framer-motion. |
| Props and callbacks | P5/P6/P11 docs | App, RunwaySetupPage, MoneyInput | Open symbols while narrating | P6 prompt | READY TO CAPTURE | App owns state; child reports raw input. |
| Responsive evidence | P9/P10 docs | AppShell and component classes | One 390px mobile and one desktop capture | P9 prompt | NEEDS CAPTURE | No screenshots are stored. |
| Cline Plan mode | None | N/A | Capture authentic Cline Plan view | Authentic Cline history | MISSING | Codex activity must not be relabelled as Cline. |
| Cline Act mode | None | N/A | Capture authentic Cline Act view | Authentic Cline history | MISSING | Perform a real review/refinement only if justified. |
| Prompt Document | This outline | `docs/prompts/` | Optional supporting capture | Master, P3, P6–P11 | PARTIAL | Missing authentic Cline chain and P2/P4/P5 prompt records. |
| ZIP submission | `.gitignore`, README | Repository root | Not applicable | N/A | NEEDS CREATION | Do not include node_modules, dist, .git, secrets, or IDE files. |

## Screenshot capture checklist

1. Login.
2. Setup desktop.
3. Protect Essentials.
4. Runway result at AUD 215.
5. Shortfall at AUD 84.
6. Purchase Check.
7. Within-runway preview showing AUD 55.
8. Exceeds-runway preview showing AUD 85 excess.
9. Confirmed result showing updated AUD 55 runway.
10. One mobile responsive state.
11. The three custom-component source files and their call sites.
12. 21st.dev source/prompt evidence and `StatusActionButton`.
13. Authentic Cline Plan mode.
14. Authentic Cline Act mode.
