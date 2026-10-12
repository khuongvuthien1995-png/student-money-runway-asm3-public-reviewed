# Student Money Runway Demo Recorder

> Project: Student Money Runway — BUS4012 Assignment 02
> Student: Thien Khuong Vu
> Phase: Automated Product Demo Recorder
> Created: 2026-09-17T01:34:47+10:00
> Updated: 2026-09-17T01:50:00+10:00

This isolated Playwright tool records the real, frozen Student Money Runway MVP. It does not change `src/`, root dependencies, routes, validation, or financial state. The product clips are silent; record the spoken narration and authentic IDE/Codex segment manually.

## Prerequisites and installation

Run these commands in PowerShell:

```powershell
Set-Location C:\Dev\BUS4012\student-money-runway-mvp\tools\demo-recorder
npm install
npx playwright install chromium
```

Playwright is intentionally installed only in this directory. The application root `package.json` and `package-lock.json` are not used or changed by this tool.

## Commands

```powershell
# Verify every required business state before recording.
npm run verify

# Record the 1440 x 810 desktop product segment.
npm run record:desktop

# Record the separate 390 x 844 responsive mobile segment.
npm run record:mobile
```

The recorder reuses `http://127.0.0.1:5173` when it is already available. Otherwise it starts Vite from the repository root, waits for an HTTP-ready app, and stops only the child server it started.

## Output

Large evidence files are intentionally outside the MVP repository:

```text
C:\Dev\BUS4012\student-money-runway-evidence\video\
  raw\student-money-runway-desktop-demo.webm
  raw\student-money-runway-mobile-demo.webm
  metadata\product-demo-scenes.json
```

FFmpeg was not available on this machine when the recorder was created, so no MP4 conversion or merge is performed. Do not overwrite a captured deterministic file accidentally; archive or rename it before re-recording.

## Source-freeze rule

The scripts use Playwright `getByRole`, `getByLabel`, and `getByText` against the existing UI. They do not use DevTools state injection, DOM text replacement, fake authentication, or hard-coded React data. If the canonical assertions fail, the recorder exits non-zero and does not claim a successful product demo.
