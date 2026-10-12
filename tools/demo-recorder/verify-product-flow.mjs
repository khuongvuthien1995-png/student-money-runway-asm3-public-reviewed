/**
 * @file tools/demo-recorder/verify-product-flow.mjs
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase Automated Product Demo Recorder
 * @createdAt 2026-09-17T01:34:47+10:00
 * @updatedAt 2026-09-17T01:51:25+10:00
 * @summary Verifies the required demo states through the rendered application before recording starts.
 * @responsibility Blocks recording when real UI interactions cannot prove the canonical financial flow.
 */

/* global console, process */

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
  login,
  previewPurchase,
  returnToPurchase,
  showLoginValidation,
  startOrReuseVite,
  startPurchaseCheck,
} from './recorder-utils.mjs'

let server
let browser

try {
  server = await startOrReuseVite()
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ baseURL: server.baseUrl, viewport: { width: 1440, height: 810 } })
  const page = await context.newPage()

  await showLoginValidation(page)
  await login(page)
  await completeSetup(page)
  await completeEssentials(page)
  await startPurchaseCheck(page)
  await previewPurchase(page)
  await assertText(page, 'Remaining runway')
  await assertText(page, 'AUD 55')
  await assertVisible(page.getByRole('button', { name: 'Mark as spent', exact: true }), 'confirmation action')

  await returnToPurchase(page)
  await previewPurchase(page, demoData.exceedsAmount)
  await assertText(page, 'Amount above runway')
  await assertText(page, 'AUD 85')
  await assertNoButton(page, 'Mark as spent')

  await editExceedingPurchase(page)
  await previewPurchase(page)
  await confirmPurchase(page)

  await context.close()
  console.log('PRODUCT_FLOW_VERIFIED=PASS')
} catch (error) {
  console.error(`AUTOMATED DEMO BLOCKED — APPLICATION STATE FAILED VERIFICATION\n${error.stack ?? error}`)
  process.exitCode = 1
} finally {
  await browser?.close()
  await server?.stop()
}
