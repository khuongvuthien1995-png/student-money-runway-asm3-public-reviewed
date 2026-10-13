/* global console, document, window, URL */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const origin = 'https://student-money-runway-asm3-preview.vercel.app'
const folder = 'docs/assessment/c7/evidence'
await mkdir(folder, { recursive: true })
const browser = await chromium.launch()
const results = []
try {
  for (const width of [390, 768, 1024, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 800 },
      ...(width === 1280 ? { recordVideo: { dir: `${folder}/raw`, size: { width: 1280, height: 800 } } } : {}) })
    const page = await context.newPage()
    const video = page.video()
    const errors = []
    let financialWrites = 0
    let localhostRequests = 0
    page.on('pageerror', error => errors.push(error.name))
    page.on('request', request => {
      const url = new URL(request.url())
      if (['localhost', '127.0.0.1'].includes(url.hostname)) localhostRequests++
      if (url.origin === origin && url.pathname.startsWith('/api/') && request.method() !== 'GET') financialWrites++
    })
    await page.goto(`${origin}/login`)
    await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
    await page.screenshot({ path: `${folder}/${width}-live-login.png`, fullPage: true })
    await page.waitForTimeout(width === 1280 ? 4000 : 100)
    await page.getByRole('button', { name: 'Create an account', exact: true }).click()
    await page.getByRole('heading', { name: 'Create account', exact: true }).waitFor()
    await page.screenshot({ path: `${folder}/${width}-live-signup-empty.png`, fullPage: true })
    await page.waitForTimeout(width === 1280 ? 4000 : 100)
    await page.goto(`${origin}/runway`)
    await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
    assert.equal(new URL(page.url()).pathname, '/login')
    await page.reload()
    await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    await page.waitForTimeout(width === 1280 ? 4000 : 100)
    assert.deepEqual(errors, [])
    assert.equal(financialWrites, 0)
    assert.equal(localhostRequests, 0)
    await context.close()
    if (video) {
      await video.saveAs(`${folder}/raw-live-preview-anonymous.webm`)
      await video.delete()
    }
    results.push({ width, login: true, signupForm: true, anonymousRouteGuard: true, refresh: true,
      noOverflow: true, pageErrors: errors.length, financialWrites, localhostRequests })
  }
} finally { await browser.close() }
await writeFile(`${folder}/live-browser-results.json`, JSON.stringify({ origin, mocks: false,
  credentialsEntered: false, video: 'raw-live-preview-anonymous.webm', narration: false, finalDemo: false, results }, null, 2))
console.log('C7 real anonymous browser capture PASS: four widths, eight screenshots and one silent raw clip. No financial writes or Auth submissions.')
