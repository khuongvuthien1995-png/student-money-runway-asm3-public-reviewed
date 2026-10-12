# Final Runtime Test Report

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Test time: 2026-09-17T01:08:21+10:00 to 2026-09-17T01:14:45+10:00
> Browser: Headless Chrome 152 via Chrome DevTools Protocol
> Vite URL: http://127.0.0.1:5173/

## Preflight

- npm run lint: PASS
- npm run build: PASS
- Runtime start and /login HTTP smoke check: PASS
- Browser console: no new application runtime errors observed. Existing React Router v6 future-flag warnings remain informational.

## Runtime and validation matrix

| Test | Scenario | Actual | Status |
|---|---|---|---|
| L01 | Empty login submit | Email and password required errors shown | PASS |
| L02 | Invalid email abc | Email format error shown | PASS |
| L03 | student@example.com / demo1234 | Navigated to /setup | PASS |
| S01 | Empty setup submit | Available funds, date, and buffer errors shown | PASS |
| S02/S03 | Negative available funds / buffer | Non-negative error shown | PASS |
| S04 | Valid zero safety buffer | Navigated to /essentials | PASS |
| S05 | Canonical 950 / 2026-09-27 / 100 | Navigated to /essentials | PASS |
| E01 | Empty essentials submit | Fixed and flexible required errors shown | PASS |
| E04 | Valid 0 fixed / 0 flexible essentials | Navigated to /runway | PASS |
| E05 | Canonical 455 / 180 | Protected total 735; navigated to /runway | PASS |
| R01 | Canonical runway | AUD 215 and AUD 735 shown | PASS |
| R02 | Shortfall 650 / 454 / 180 / 100 | Runway 0; protected shortfall AUD 84 shown | PASS |
| P01 | Empty purchase submit | Name and amount errors shown | PASS |
| P04 | Negative amount -1 | `Enter an amount of 0 or more.` shown | PASS |
| P05 | Malformed amount 1.234 | `Enter a valid amount.` shown | PASS |
| P02–P05 | Whitespace name, zero, negative, malformed money contract | Rejected by current validation rules | PASS |
| P06 | Monthly public transport pass / 160 | Navigated to /result; AUD 55 and within-runway text shown | PASS |
| B01 | Back Without Saving | Returned without mutation; runway stayed AUD 215 | PASS |
| P07 | Exact purchase 215 | AUD 0; Mark as spent available | PASS |
| P08 | Exceeds purchase 300 | AUD 85 excess; no Mark as spent action | PASS |
| C01 | Confirm canonical 160 | Purchase recorded; updated runway AUD 55 | PASS |
| C02 | Next purchase | Draft reset; available funds remained 790; current runway 55 | PASS |
| C03 | Rapid double Mark as spent activation | One confirmed result; updated runway remained AUD 55 | PASS |
| D01–D03 | Fresh direct /runway, /purchase, /result | Redirected to /setup; no NaN or Infinity | PASS |

## Business regression

| Case | Expected | Actual | Status |
|---|---:|---:|---|
| Protected total | 735 | 735 | PASS |
| Runway | 215 | 215 | PASS |
| Shortfall | 84 | 84 | PASS |
| Purchase 160 remaining | 55 | 55 | PASS |
| Purchase 215 | 0; not exceeds | 0; confirmation available | PASS |
| Purchase 300 | 85 excess | 85 excess; confirmation absent | PASS |
| Confirmation | 950 → 790 | Confirmed branch rendered with updated runway 55 | PASS |

## Responsive checks

The actual browser reported no horizontal document overflow at 390px, 768px, 1024px, and 1280px. Product screenshots were captured at 1280×900 and 390×844; representative captures were visually inspected.

## Interaction rehearsal note

The browser test focused the native `Mark as spent` button successfully. CDP-generated Enter key events in the headless session did not invoke the browser's native default button activation, so a one-time Enter/Space check in a visible browser remains a recording-rehearsal task. This is an automation-environment limitation, not a source change or a claimed application defect.

## Evidence boundary

This report verifies browser-rendered UI interactions and screenshots. It does not claim a final assessment video, IDE code screenshots, ChatGPT EDU/Codex history screenshots, or lecturer approval evidence.
