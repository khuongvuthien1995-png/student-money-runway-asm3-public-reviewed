/**
 * @file tools/demo-recorder/record-mobile-demo.mjs
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase Automated Product Demo Recorder
 * @createdAt 2026-09-17T01:34:47+10:00
 * @updatedAt 2026-09-17T01:51:25+10:00
 * @summary Records the responsive mobile product journey using the same verified application flow.
 * @responsibility Produces a separate 390 by 844 WEBM proof of the responsive application, not a simulated mobile app.
 */

/* global console, process */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import {
  assertText,
  completeEssentials,
  completeSetup,
  ensureEvidenceDirectories,
  login,
  moveVideoTo,
  pauseForViewer,
  previewPurchase,
  showLoginValidation,
  startOrReuseVite,
  startPurchaseCheck,
  videoPaths,
  writeJson,
} from './recorder-utils.mjs'

const mobileTarget = path.join(videoPaths.raw, 'student-money-runway-mobile-demo.webm')
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
    viewport: { width: 390, height: 844 },
    recordVideo: { dir: videoPaths.raw, size: { width: 390, height: 844 } },
  })
  const page = await context.newPage()
  const video = page.video()

  await showLoginValidation(page, 2_000)
  await login(page, 2_000)
  await completeSetup(page, 3_000)
  await completeEssentials(page, 3_000)
  await assertText(page, 'AUD 215')
  await pauseForViewer(page, 4_000)
  await startPurchaseCheck(page)
  await previewPurchase(page)
  await assertText(page, 'Remaining runway')
  await assertText(page, 'AUD 55')
  await pauseForViewer(page, 14_000)

  await context.close()
  context = undefined
  const videoPath = await moveVideoTo(video, mobileTarget)
  let existingMetadata = { scenes: [] }
  try {
    existingMetadata = JSON.parse(await readFile(metadataTarget, 'utf8'))
  } catch {
    // The mobile recorder remains independently usable before the desktop recorder.
  }
  const mobileScene = {
    id: 'M01',
    name: 'Mobile-first Responsive Journey',
    start: '06:20',
    end: '06:50',
    route: '/login through /result',
    expectedEvidence: '390 by 844 Login, Setup, Runway AUD 215, Purchase Preview AUD 55, bottom navigation and stacked content.',
    actualStatus: 'RECORDED AND ASSERTED',
  }
  await writeJson(metadataTarget, {
    ...existingMetadata,
    generatedAt: new Date().toISOString(),
    mobileVideo: videoPath,
    mobileViewport: { width: 390, height: 844 },
    scenes: [...existingMetadata.scenes.filter((scene) => scene.id !== mobileScene.id), mobileScene],
  })
  console.log(`MOBILE_RECORDING=READY\nVIDEO=${videoPath}\nMETADATA=${metadataTarget}`)
} catch (error) {
  console.error(`AUTOMATED DEMO BLOCKED — APPLICATION STATE FAILED VERIFICATION\n${error.stack ?? error}`)
  process.exitCode = 1
} finally {
  await context?.close()
  await browser?.close()
  await server?.stop()
}
