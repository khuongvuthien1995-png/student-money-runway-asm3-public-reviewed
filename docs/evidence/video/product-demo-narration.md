# Product Demo Narration

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: Automated Product Demo Recorder
> Created: 2026-09-17T01:50:00+10:00
> Updated: 2026-09-17T01:50:00+10:00

Use this as live narration over the silent automated product clips. It describes a frontend-only student planning tool, not bank integration, real authentication, financial advice, or automatic spending decisions.

| Time | Narration |
|---|---|
| 0:00–0:30 | “Student Money Runway helps a student make a transparent short-horizon plan from the money they have entered. This is a frontend demo login that starts the local planning session. I first show the required and email-format validation, then use the demo credentials to continue.” |
| 0:30–1:25 | “In Runway Setup, I enter 950 dollars available, the planning date of 27 September 2026, and a 100 dollar safety buffer. The safety buffer is deliberately protected before discretionary money is calculated.” |
| 1:25–2:15 | “Next I enter fixed essentials of 455 dollars and flexible essentials of 180 dollars. The reusable AUD inputs are controlled fields, so the current page receives the entered text while the shared application state remains higher in the app. The visible protected total is 735 dollars: fixed essentials, flexible essentials, and the safety buffer.” |
| 2:15–3:00 | “The Runway Result presents the same figures factually. From 950 dollars available minus the 735 dollar protected total, the discretionary runway is 215 dollars. The page does not judge the student; it clearly shows the inputs and the derived result.” |
| 3:00–3:45 | “I now check a proposed purchase: a monthly public transport pass for 160 dollars. The current runway is shown alongside the form so the purchase can be considered in context.” |
| 3:45–4:30 | “This is a preview only. The application shows a runway before of 215 dollars, the 160 dollar purchase, and 55 dollars remaining. Both the within-runway message and the Back without saving action make clear that no available funds have changed yet.” |
| 4:30–4:55 | “I choose Back without saving. Returning to Purchase Check confirms the source figures remain unchanged, including the 215 dollar current runway.” |
| 4:55–5:30 | “For the boundary case, I change the proposal to 300 dollars. The application transparently shows that this is 85 dollars above the current discretionary runway. There is no Mark as spent confirmation action in this state.” |
| 5:30–6:20 | “I edit the proposal back to 160 dollars and return to the 55 dollar remaining-runway preview. Only after the explicit Mark as spent action does the application record the purchase. Available funds change from 950 to 790 dollars, and the updated discretionary runway is 55 dollars.” |
| 6:20–6:50 | “This separate 390 pixel mobile recording is the same responsive web application, not a separate mobile app. It shows the Login, Setup, Runway Result, and Purchase Preview with stacked content, bottom navigation, responsive summary rows, and touch-sized controls. Across both layouts, the purpose remains practical, readable, and non-judgmental.” |

The final assessment recording must add the manual IDE/Codex segment and any student-recorded narration audio separately.
