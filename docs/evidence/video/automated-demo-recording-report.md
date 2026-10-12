# Automated Demo Recording Report

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: Automated Product Demo Recorder
> Created: 2026-09-17T01:50:37+10:00
> Updated: 2026-09-17T01:51:25+10:00

## Recorder environment

- Playwright: 1.63.0, installed only at `tools/demo-recorder/node_modules`.
- Chromium: installed successfully by Playwright (`chromium-1243`, Chrome for Testing 153.0.8010.12).
- Vite URL: `http://127.0.0.1:5173`.
- FFmpeg on system PATH: not available. No conversion or merge was generated; raw WEBM is retained.

## Pre-record verification

`npm run verify` passed using real Playwright browser interaction with the existing Vite app. It verified:

- frontend demo Login and validation;
- protected total AUD 735;
- discretionary runway AUD 215;
- purchase AUD 160 leaves AUD 55;
- purchase AUD 300 is AUD 85 above runway and has no confirmation action;
- explicit confirmation changes available funds from AUD 950 to AUD 790;
- updated runway is AUD 55.

## Recorded output

| Clip | Path | Format / viewport | File size | Approximate duration | Status |
|---|---|---|---:|---|---|
| Desktop product demo | `C:\Dev\BUS4012\student-money-runway-evidence\video\raw\student-money-runway-desktop-demo.webm` | WEBM, 1440 by 810 | 18,698,258 bytes | 6 minutes 29 seconds | RECORDED |
| Mobile responsive demo | `C:\Dev\BUS4012\student-money-runway-evidence\video\raw\student-money-runway-mobile-demo.webm` | WEBM, 390 by 844 | 978,492 bytes | about 35 seconds | RECORDED |

Both files were checked after browser-context closure, exist at the deterministic paths, and are non-empty. Scene evidence is in `C:\Dev\BUS4012\student-money-runway-evidence\video\metadata\product-demo-scenes.json`.

## Source integrity

- `src/` modified by recorder work: no.
- Root `package.json` modified: no.
- Root `package-lock.json` modified: no.
- Playwright and its lockfile exist only under `tools/demo-recorder/`.

## Final validation

- Recorder JavaScript syntax checks: PASS.
- `npm run verify` from `tools/demo-recorder`: PASS.
- Root `npm run lint`: PASS.
- Root `npm run build`: PASS.

## Remaining manual work

The automatic clips are silent and contain only the product UI. The authentic VS Code / ChatGPT EDU / Codex segment, student narration, optional manual IDE clip, final merge, and final ten-minute review remain manual tasks. No final merged assessment video is claimed by this report.
