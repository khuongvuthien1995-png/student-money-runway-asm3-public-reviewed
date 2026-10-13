/* global process, console, URL */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const origin = 'https://student-money-runway-asm3-preview.vercel.app'
const action = process.env.C6_AUTH_ACTION ?? 'signup'
assert.ok(['signup', 'login'].includes(action))
assert.ok(process.env.C6_TEST_EMAIL && process.env.C6_TEST_PASSWORD)
const browser = await chromium.launch()
const results = { action, initialAlerts: [], providerResponses: [], pageErrors: 0, consoleErrors: 0, failedRequests: [] }
try {
  const context = await browser.newContext()
  const page = await context.newPage()
  page.on('pageerror', () => results.pageErrors++)
  page.on('console', message => { if (message.type() === 'error') results.consoleErrors++ })
  page.on('requestfailed', request => {
    const url = new URL(request.url())
    results.failedRequests.push({ origin: url.origin, path: url.pathname })
  })
  page.on('response', async response => {
    const url = new URL(response.url())
    if (url.pathname.startsWith('/auth/v1/')) {
      let code = null
      try { code = (await response.json()).code ?? null } catch { /* No raw body is retained. */ }
      results.providerResponses.push({ origin: url.origin, path: url.pathname, status: response.status(), code })
    }
  })
  await page.goto(`${origin}/login`)
  await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  results.initialAlerts = await page.getByRole('alert').allTextContents()
  if (action === 'signup') await page.getByRole('button', { name: 'Create an account', exact: true }).click()
  await page.getByLabel('Email', { exact: true }).fill(process.env.C6_TEST_EMAIL)
  await page.getByLabel('Password', { exact: true }).fill(process.env.C6_TEST_PASSWORD)
  await page.getByRole('button', { name: action === 'signup' ? 'Create account' : 'Continue', exact: true }).click()
  await page.waitForTimeout(2500)
  results.finalAlerts = await page.getByRole('alert').allTextContents()
  results.confirmationRequired = await page.getByText('Check your email and confirm your account before signing in.', { exact: true }).count() > 0
  results.route = new URL(page.url()).pathname
  await context.close()
} finally { await browser.close() }
await mkdir('docs/implementation/evidence/c6', { recursive: true })
await writeFile(`docs/implementation/evidence/c6/auth-${action}-results.json`, JSON.stringify(results, null, 2))
console.log(JSON.stringify(results))
