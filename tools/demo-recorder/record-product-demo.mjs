/**
 * @file tools/demo-recorder/record-product-demo.mjs
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase Automated Product Demo Recorder
 * @createdAt 2026-09-17T01:34:47+10:00
 * @updatedAt 2026-09-17T01:51:25+10:00
 * @summary Records the desktop product-demo journey using verified real browser interactions.
 * @responsibility Produces the silent desktop WEBM and scene metadata without modifying the frozen application.
 */

/* global console, process */

import path from 'node:path'
import { chromium } from 'playwright'
import {
  assertNoButton,
  assertText,
  assertVisible,
  completeEssentials,
  completeSetup,
  confirmPurchase,
  demoData,
  editExceedingPurchase,
  ensureEvidenceDirectories,
  login,
  moveVideoTo,
  pauseForViewer,
  previewPurchase,
  returnToPurchase,
  showLoginValidation,
  startOrReuseVite,
  startPurchaseCheck,
  videoPaths,
  writeJson,
} from './recorder-utils.mjs'

const scenes = [
  { id: 'D01', name: 'Login and validation', start: '00:00', end: '00:30', route: '/login', expectedEvidence: 'Required and invalid-email validation; frontend demo session start.' },
  { id: 'D02', name: 'Runway Setup', start: '00:30', end: '01:25', route: '/setup', expectedEvidence: 'Available funds 950, planning date 2026-09-27, safety buffer 100.' },
  { id: 'D03', name: 'Protect Essentials', start: '01:25', end: '02:15', route: '/essentials', expectedEvidence: 'Fixed 455, flexible 180, protected total AUD 735.' },
  { id: 'D04', name: 'Runway Result', start: '02:15', end: '03:00', route: '/runway', expectedEvidence: 'Protected total AUD 735 and discretionary runway AUD 215.' },
  { id: 'D05', name: 'Purchase Check', start: '03:00', end: '03:45', route: '/purchase', expectedEvidence: 'Monthly public transport pass for AUD 160.' },
  { id: 'D06', name: 'Within-runway Preview', start: '03:45', end: '04:30', route: '/result', expectedEvidence: 'Runway 215, purchase 160, remaining 55, reversible preview.' },
  { id: 'D07', name: 'Back Without Saving', start: '04:30', end: '04:55', route: '/purchase', expectedEvidence: 'Return to purchase check with source runway still AUD 215.' },
  { id: 'D08', name: 'Exceeds Boundary', start: '04:55', end: '05:30', route: '/result', expectedEvidence: 'AUD 300 proposal, amount above runway AUD 85, no confirmation control.' },
  { id: 'D09', name: 'Explicit Confirmation', start: '05:30', end: '06:20', route: '/result then /runway', expectedEvidence: 'AUD 160 confirmation, available funds 950 to 790, updated runway 55.' },
]

const desktopTarget = path.join(videoPaths.raw, 'student-money-runway-desktop-demo.webm')
const metadataTarget = path.join(videoPaths.metadata, 'product-demo-scenes.json')
let server
let browser
let context

try {
  await ensureEvidenceDirectories()
  server = await startOrReuseVite()
  browser = await chromium.launch({ headless: true })
  context = await browser.newContext({
    baseURL: server.baseUrl,
    viewport: { width: 1440, height: 810 },
    recordVideo: { dir: videoPaths.raw, size: { width: 1440, height: 810 } },
  })
  const page = await context.newPage()
  const video = page.video()

  await showLoginValidation(page, 8_000)
  await login(page, 10_000)
  await pauseForViewer(page, 12_000)

  await completeSetup(page, 25_000)
  await pauseForViewer(page, 15_000)

  await completeEssentials(page, 20_000)
  await pauseForViewer(page, 30_000)

  await pauseForViewer(page, 45_000)
  await startPurchaseCheck(page)
  await pauseForViewer(page, 45_000)

  await previewPurchase(page)
  await assertText(page, 'Remaining runway')
  await assertText(page, 'AUD 55')
  await assertVisible(page.getByRole('button', { name: 'Mark as spent', exact: true }), 'confirmation action')
  await assertVisible(page.getByRole('button', { name: 'Back without saving', exact: true }), 'reversible preview action')
  await pauseForViewer(page, 45_000)

  await returnToPurchase(page)
  await pauseForViewer(page, 25_000)

  await previewPurchase(page, demoData.exceedsAmount)
  await assertText(page, 'Amount above runway')
  await assertText(page, 'AUD 85')
  await assertNoButton(page, 'Mark as spent')
  await pauseForViewer(page, 35_000)

  await editExceedingPurchase(page)
  await previewPurchase(page)
  await assertText(page, 'AUD 55')
  await pauseForViewer(page, 20_000)
  await confirmPurchase(page)
  await pauseForViewer(page, 30_000)

  await context.close()
  context = undefined
  const videoPath = await moveVideoTo(video, desktopTarget)
  await writeJson(metadataTarget, {
    generatedAt: new Date().toISOString(),
    recorder: 'Playwright desktop recorder',
    baseUrl: server.baseUrl,
    video: videoPath,
    viewport: { width: 1440, height: 810 },
    scenes: scenes.map((scene) => ({ ...scene, actualStatus: 'RECORDED AND ASSERTED' })),
  })
  console.log(`DESKTOP_RECORDING=READY\nVIDEO=${videoPath}\nMETADATA=${metadataTarget}`)
} catch (error) {
  console.error(`AUTOMATED DEMO BLOCKED — APPLICATION STATE FAILED VERIFICATION\n${error.stack ?? error}`)
  process.exitCode = 1
} finally {
  await context?.close()
  await browser?.close()
  await server?.stop()
}
