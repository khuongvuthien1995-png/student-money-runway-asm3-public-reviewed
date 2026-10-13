/** Offline browser integration only: no cloud sessions, database writes or real credentials. */
/* global URL, process, fetch, setTimeout, document, getComputedStyle, console */
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('../../', import.meta.url))
const evidence = resolve(root, 'docs/implementation/evidence/c2')
const fixture = JSON.parse(await readFile(resolve(root, 'src/tests/fixtures/api.json'), 'utf8'))
const base = 'http://127.0.0.1:5192'
const server = spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '5192', '--strictPort'],
  { cwd: root, windowsHide: true, stdio: 'ignore' })
let browser
const results = []
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if ((await fetch(`${base}/tests/browser/index.html`)).ok) break } catch { /* Local server starting. */ }
    if (attempt === 99) throw new Error('Local browser test server did not start.')
    await new Promise((done) => setTimeout(done, 100))
  }
  await mkdir(evidence, { recursive: true })
  browser = await chromium.launch({ headless: true })
  for (const width of [390, 768, 1024, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const calls = []
    let savedPlan = null
    let firstGet = true
    let firstPost = true
    await context.route('**/*', async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      if (url.origin !== base) return route.abort()
      if (!url.pathname.startsWith('/api/')) return route.continue()
      const method = request.method()
      const payload = request.postDataJSON()
      calls.push({ method, path: url.pathname, payload })
      assert.equal(request.headers().authorization, 'Bearer test-only-browser-token')
      await new Promise((done) => setTimeout(done, 450))
      const respond = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
      if (method === 'GET' && firstGet) {
        firstGet = false
        return respond({ error: { code: 'SERVICE_UNAVAILABLE', message: 'Offline test service unavailable.' } }, 503)
      }
      if (method === 'GET') return savedPlan ? respond({ plan: savedPlan }) : respond({ error: { code: 'PLAN_NOT_FOUND', message: 'No saved plan.' } }, 404)
      if (method === 'PUT') { assert.deepEqual(payload, fixture.saveRequest); savedPlan = fixture.plan.plan; return respond({ plan: savedPlan }) }
      if (firstPost) { firstPost = false; return route.abort('failed') }
      savedPlan = fixture.confirmation.plan
      return respond(fixture.confirmation, 201)
    })
    const checkOverflow = async (screen) => {
      const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
      assert.ok(size.scroll <= size.viewport, `${width} ${screen}: horizontal overflow ${JSON.stringify(size)}`)
    }
    await page.goto(`${base}/tests/browser/index.html`)
    await page.getByLabel('Email', { exact: true }).fill('browser-test@example.invalid')
    await page.getByLabel('Password', { exact: true }).fill('test-only-browser-password')
    await checkOverflow('login')
    // Actual keyboard submission and focus, rather than synthetic handler invocation.
    await page.getByLabel('Password', { exact: true }).press('Tab')
    assert.equal(await page.getByRole('button', { name: 'Continue', exact: true }).evaluate((el) => el === document.activeElement), true)
    await page.keyboard.press('Enter')
    await page.getByText(/Loading your saved plan/).waitFor()
    await checkOverflow('loading')
    await page.getByRole('alert').waitFor()
    assert.equal(await page.getByRole('heading', { name: 'Set up your runway' }).count(), 0)
    await page.screenshot({ path: resolve(evidence, `${width}-load-error.png`), fullPage: true })
    await page.getByRole('button', { name: 'Retry loading plan' }).click()
    await page.getByRole('heading', { name: 'Set up your runway' }).waitFor()
    await page.getByLabel(/Money available/).fill('950')
    await page.getByLabel('Planning date', { exact: true }).fill('2026-10-12')
    await page.getByLabel(/Emergency reserve/).fill('100')
    await checkOverflow('setup')
    await page.getByRole('button', { name: 'Continue to essentials' }).click()
    await page.getByLabel(/^Fixed essentials/).fill('455')
    await page.getByLabel(/^Flexible essentials/).fill('180')
    await checkOverflow('essentials')
    await page.getByRole('button', { name: 'Calculate my runway' }).click()
    assert.equal(await page.getByRole('button', { name: /Saving plan/ }).isDisabled(), true)
    assert.equal(await page.getByLabel(/^Fixed essentials/).isDisabled(), true)
    await page.getByRole('heading', { name: 'Your discretionary runway' }).waitFor()
    const visibleNavigation = page.locator('nav:visible')
    assert.equal(await visibleNavigation.count(), 1)
    assert.equal(await visibleNavigation.getByRole('link', { name: 'Edit plan' }).count(), 1)
    assert.equal(await visibleNavigation.evaluate((el) => getComputedStyle(el).position), width < 1024 ? 'fixed' : 'static')
    await checkOverflow('runway')
    await page.screenshot({ path: resolve(evidence, `${width}-runway.png`), fullPage: true })
    await visibleNavigation.getByRole('link', { name: 'Check', exact: true }).click()
    await page.getByLabel('Purchase name', { exact: true }).fill('Test Purchase')
    await page.getByLabel(/Purchase amount/).fill('160')
    await checkOverflow('purchase')
    await page.getByRole('button', { name: 'Preview impact' }).click()
    await page.getByRole('heading', { name: 'Purchase impact preview' }).waitFor()
    assert.equal(calls.filter((call) => call.method === 'POST').length, 0)
    await checkOverflow('result')
    await page.screenshot({ path: resolve(evidence, `${width}-preview.png`), fullPage: true })
    const confirmation = page.getByRole('button', { name: /Mark as spent/ })
    await confirmation.click()
    assert.equal(await page.locator('button[aria-busy="true"]').isDisabled(), true)
    await page.getByRole('button', { name: 'Retry same confirmation' }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Back without saving' }).isDisabled(), true)
    await checkOverflow('uncertain')
    await page.getByRole('button', { name: 'Retry same confirmation' }).click()
    await page.getByRole('heading', { name: 'Purchase recorded' }).waitFor()
    await checkOverflow('success')
    const posts = calls.filter((call) => call.method === 'POST')
    assert.equal(posts.length, 2); assert.deepEqual(posts[0].payload, posts[1].payload)
    assert.equal(calls.filter((call) => call.method === 'PUT').length, 1)
    await page.screenshot({ path: resolve(evidence, `${width}-confirmed.png`), fullPage: true })
    await page.getByRole('button', { name: 'View updated runway' }).click()
    await page.getByRole('heading', { name: 'Your discretionary runway' }).waitFor()
    assert.equal(await page.getByText('AUD 790', { exact: true }).count(), 1)
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
    assert.equal(await page.getByText('AUD 790', { exact: true }).count(), 0)
    assert.deepEqual(errors, [])
    results.push({ width, result: 'OFFLINE BROWSER PASS', sixScreens: true, horizontalOverflow: false, keyboardSubmit: true,
      initial503Retry: true, pendingButtonsDisabled: true, previewPosts: 0, puts: 1, confirmationAttempts: 2,
      identicalRetryPayload: true, logoutClearsData: true, pageErrors: 0 })
    await context.close()
    console.log(`${width}px: offline six-screen flow, layout, navigation, keyboard, failures and retry PASS`)
  }
  await writeFile(resolve(evidence, 'browser-results.json'), JSON.stringify({ mode: 'TEST-ONLY AUTH / INTERCEPTED API; NO LIVE CLOUD CLAIM', results }, null, 2))
} finally {
  await browser?.close()
  server.kill()
}
