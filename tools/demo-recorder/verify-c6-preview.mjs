/* global process, console, document, window, URL */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const origin = process.env.C6_PREVIEW_ORIGIN
assert.equal(origin, 'https://student-money-runway-asm3-preview.vercel.app')
const publicAccess = process.env.C6_PUBLIC_VERIFY === '1'
if (!publicAccess) assert.ok(process.env.C6_PREVIEW_OIDC)
const evidence = 'docs/implementation/evidence/c6'
await mkdir(evidence, { recursive: true })
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const width of [390, 768, 1024, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    // Scope the short-lived protection credential to this exact origin only.
    await context.route('**/*', async route => {
      if (!publicAccess && new URL(route.request().url()).origin === origin) {
        await route.continue({ headers: { ...route.request().headers(), 'x-vercel-trusted-oidc-idp-token': process.env.C6_PREVIEW_OIDC } })
      } else await route.continue()
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.name))
    let writes = 0
    page.on('request', request => { if (request.url().startsWith(`${origin}/api/`) && request.method() !== 'GET') writes++ })
    for (const path of ['/login', '/setup', '/essentials', '/runway', '/purchase', '/result']) {
      await page.goto(`${origin}${path}`)
      await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
      assert.equal(new URL(page.url()).pathname, '/login')
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    }
    await page.getByRole('button', { name: 'Create an account', exact: true }).click()
    await page.getByRole('heading', { name: 'Create account', exact: true }).waitFor()
    await page.getByRole('button', { name: 'Back to sign in', exact: true }).click()
    await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
    await page.screenshot({ path: `${evidence}/${width}-${publicAccess ? 'public' : 'preview'}-login.png`, fullPage: true })
    assert.equal(writes, 0)
    assert.deepEqual(errors, [])
    results.push({ width, anonymousRoutes: 6, signupToggle: true, horizontalOverflow: false, pageErrors: errors.length, financialWrites: writes })
    await context.close()
  }
} finally { await browser.close() }
await writeFile(`${evidence}/${publicAccess ? 'public' : 'preview'}-browser-results.json`, JSON.stringify({ origin, category: 'REAL HTTPS ANONYMOUS UI; NO AUTH OR FINANCIAL SUBMISSIONS', vercelProtectionCredential: !publicAccess, results }, null, 2))
console.log('Preview browser PASS: four widths, six routes each; zero financial writes/page errors/overflow.')
