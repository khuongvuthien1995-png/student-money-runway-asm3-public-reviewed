/* global process, console, URL */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const origin = 'https://student-money-runway-asm3-preview.vercel.app'
const expectedUser = process.env.C6_CONFIRMED_USER_ID
assert.ok(expectedUser)
const browser = await chromium.launch({ headless: false })
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
// No video, trace, storage-state export, password extraction or Auth body logging.
const page = await context.newPage()
const result = { origin, category: 'REAL HTTPS; HUMAN PASSWORD ENTRY; READ-ONLY FINANCIAL CHECKS',
  milestones: [], financialWrites: 0, passwordGrantStatuses: [], status: 'PENDING', phase: 'first password login' }
const evidence = 'docs/implementation/evidence/c6/fresh-password-login-results.json'
await mkdir('docs/implementation/evidence/c6', { recursive: true })
async function save() { await writeFile(evidence, JSON.stringify(result, null, 2)) }
page.on('request', request => {
  const url = new URL(request.url())
  if (url.origin === origin && url.pathname.startsWith('/api/') && request.method() !== 'GET') result.financialWrites++
})
page.on('response', response => {
  const url = new URL(response.url())
  if (url.hostname === 'mnjmugwkjtihqswssiwa.supabase.co' && url.pathname === '/auth/v1/token'
    && url.searchParams.get('grant_type') === 'password') result.passwordGrantStatuses.push(response.status())
})
async function planAfterLogin() {
  const response = await page.waitForResponse(r => new URL(r.url()).origin === origin
    && new URL(r.url()).pathname === '/api/plans/current' && r.request().method() === 'GET', { timeout: 1800000 })
  assert.equal(response.status(), 200)
  const { plan } = await response.json()
  assert.equal(plan.userId, expectedUser)
  await page.getByRole('heading', { name: 'Your discretionary runway', exact: true }).waitFor()
  return plan
}
try {
  await page.goto(origin + '/login')
  await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  await save()
  console.log('READY: sign in manually in the new Chromium window. Password entry is not recorded.')
  const first = await planAfterLogin()
  assert.ok(result.passwordGrantStatuses.includes(200))
  result.milestones.push({ step: 'fresh password login and verified FastAPI plan GET', status: 'PASS' })
  result.phase = 'reload'
  const reloadResponse = page.waitForResponse(r => new URL(r.url()).origin === origin
    && new URL(r.url()).pathname === '/api/plans/current' && r.request().method() === 'GET')
  await page.reload()
  const response = await reloadResponse
  assert.equal(response.status(), 200)
  assert.deepEqual((await response.json()).plan, first)
  await page.getByRole('heading', { name: 'Your discretionary runway', exact: true }).waitFor()
  result.milestones.push({ step: 'authenticated browser reload preserves saved plan', status: 'PASS' })
  result.phase = 'history'
  const historyResponse = page.waitForResponse(r => new URL(r.url()).origin === origin
    && new URL(r.url()).pathname === '/api/plans/current/purchases' && r.request().method() === 'GET')
  await page.getByRole('button', { name: 'Load purchase history', exact: true }).click()
  const history = await historyResponse
  assert.equal(history.status(), 200)
  const { purchases } = await history.json()
  assert.ok(purchases.every(p => p.userId === expectedUser && p.planId === first.id))
  result.milestones.push({ step: 'persisted purchase history GET', status: 'PASS', rowCount: purchases.length })
  result.phase = 'logout'
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  await page.goto(origin + '/runway')
  await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  assert.equal(new URL(page.url()).pathname, '/login')
  result.milestones.push({ step: 'logout prevents protected route access', status: 'PASS' })
  result.phase = 'second password login'
  await save()
  console.log('FIRST LOGIN/RELOAD/HISTORY/LOGOUT PASS. Please sign in again in the same window.')
  const second = await planAfterLogin()
  assert.deepEqual(second, first)
  assert.ok(result.passwordGrantStatuses.filter(status => status === 200).length >= 2)
  result.milestones.push({ step: 'fresh password login again retrieves unchanged plan', status: 'PASS' })
  assert.equal(result.financialWrites, 0)
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  result.status = 'PASS'
} catch {
  result.status = result.passwordGrantStatuses.length === 0 ? 'PENDING' : 'FAIL'
  result.reason = result.passwordGrantStatuses.length === 0
    ? 'No password grant observed before the browser participation window ended; Auth failure not established.'
    : 'Observed workflow did not complete its assertions; private details withheld.'
  console.log('Read-only live check failed or timed out at the recorded phase; private response details withheld.')
} finally {
  await save()
  await context.close()
  await browser.close()
}
console.log(JSON.stringify(result))
if (result.status !== 'PASS') process.exitCode = 1
