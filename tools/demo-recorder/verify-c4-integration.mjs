/* global console, process, window, document, getComputedStyle, URL */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { at, canonical, errorResponse, expect, gate, layout, login, makePurchase, plan, reachable, runway, scenario, startBrowserServer, summary } from './c4-fixtures.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const evidence = resolve(root, 'docs/implementation/evidence/c4')
const widths = process.env.C4_QA_WIDTHS ? process.env.C4_QA_WIDTHS.split(',').map(Number) : [390, 768, 1024, 1280]
const filter = process.env.C4_QA_CASE ?? ''
const cases = []
const add = (name, options, run) => cases.push({ name, options, run })
async function restored(s) { await s.visit('/runway'); await runway(s.page) }
async function record(page) { await expect(page.getByRole('heading', { name: 'Purchase recorded' })).toBeVisible() }
async function confirm(page) { await page.getByRole('button', { name: /Mark as spent/ }).click() }
async function screenshot(s, width, state) { await s.page.screenshot({ path: resolve(evidence, `${width}-${state}.png`), fullPage: true }) }
const restoredAuth = { restoredUser: 'A' }

async function tabTo(page, locator) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    if (await locator.evaluate((el) => el === document.activeElement)) {
      await expect(locator).toBeFocused()
      assert.equal(await locator.evaluate((el) => {
        const style = getComputedStyle(el)
        return el.matches(':focus-visible') && (style.boxShadow !== 'none' || (style.outlineStyle !== 'none' && style.outlineWidth !== '0px'))
      }), true, 'Keyboard focus indicator')
      return
    }
    await page.keyboard.press('Tab')
  }
  throw new Error('Control was not reachable in the keyboard tab order.')
}

add('keyboard-only login, edit/save, preview/confirm and logout', {}, async (s) => {
  const { page } = s; await s.visit('/login')
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
  await tabTo(page, page.getByLabel('Email', { exact: true })); await page.keyboard.type('user-a@example.invalid')
  await tabTo(page, page.getByLabel('Password', { exact: true })); await page.keyboard.type('c4-test-only-password')
  await tabTo(page, page.getByRole('button', { name: 'Continue', exact: true })); await page.keyboard.press('Enter'); await runway(page)
  await tabTo(page, page.locator('nav:visible').getByRole('link', { name: 'Edit plan' })); await page.keyboard.press('Enter'); await at(page, '/setup')
  await tabTo(page, page.getByLabel(/Money available/)); await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type('960')
  await tabTo(page, page.getByRole('button', { name: 'Continue to essentials' })); await page.keyboard.press('Space'); await at(page, '/essentials')
  await tabTo(page, page.getByRole('button', { name: 'Calculate my runway' })); await page.keyboard.press('Enter'); await runway(page)
  await tabTo(page, page.getByRole('button', { name: 'Check a purchase', exact: true })); await page.keyboard.press('Enter'); await at(page, '/purchase')
  await tabTo(page, page.getByLabel('Purchase name', { exact: true })); await page.keyboard.type('Keyboard expense')
  await tabTo(page, page.getByLabel(/Purchase amount/)); await page.keyboard.type('160')
  await tabTo(page, page.getByRole('button', { name: 'Preview impact' })); await page.keyboard.press('Enter'); await at(page, '/result')
  assert.equal(s.requests('POST').length, 0)
  await tabTo(page, page.getByRole('button', { name: /Mark as spent/ })); await page.keyboard.press('Space'); await record(page)
  await tabTo(page, page.getByRole('button', { name: 'View updated runway' })); await page.keyboard.press('Enter'); await runway(page)
  await summary(page, 'Available funds', 'AUD 800'); assert.equal(s.requests('POST').length, 1)
  await tabTo(page, page.getByRole('button', { name: 'Sign out' })); await page.keyboard.press('Space'); await at(page, '/login')
})

add('first-time six-screen keyboard/save/preview/confirm/logout', { saved: false }, async (s, width) => {
  const { page } = s
  await s.visit('/setup'); await at(page, '/login')
  await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible()
  await screenshot(s, width, 'login')
  await page.getByLabel('Email', { exact: true }).fill('user-a@example.invalid')
  await page.getByLabel('Password', { exact: true }).fill('c4-test-only-password')
  await page.getByLabel('Password', { exact: true }).press('Tab')
  const submit = page.getByRole('button', { name: 'Continue', exact: true })
  await expect(submit).toBeFocused()
  assert.equal(await submit.evaluate((el) => el.matches(':focus-visible') && getComputedStyle(el).boxShadow !== 'none'), true)
  await page.keyboard.press('Enter'); await at(page, '/setup')
  await page.getByLabel(/Money available/).fill('950'); await page.getByLabel('Planning date', { exact: true }).fill('2026-10-12')
  await page.getByLabel(/Emergency reserve/).fill('100'); await layout(page, 'setup'); await screenshot(s, width, 'setup')
  await reachable(page, page.getByRole('button', { name: 'Continue to essentials' }), 'setup CTA')
  await page.getByRole('button', { name: 'Continue to essentials' }).click(); await at(page, '/essentials')
  assert.equal(s.requests('PUT').length, 0)
  await page.getByLabel(/^Fixed essentials/).fill('455'); await page.getByLabel(/^Flexible essentials/).fill('180')
  await summary(page, 'Protected total', 'AUD 735')
  const pending = gate(); s.enqueue('PUT', { body: { plan: plan() }, gate: pending })
  await reachable(page, page.getByRole('button', { name: 'Calculate my runway' }), 'save CTA')
  await page.getByRole('button', { name: 'Calculate my runway' }).click()
  await expect(page.getByRole('button', { name: /Saving plan/ })).toBeDisabled()
  await expect(page.getByLabel(/^Fixed essentials/)).toBeDisabled()
  await expect(page.getByRole('status')).toContainText('Saving')
  await expect.poll(() => s.requests('PUT').length).toBe(1)
  assert.deepEqual(s.requests('PUT')[0].body, canonical)
  s.plans.A = plan(); pending.release(); await runway(page)
  await summary(page, 'Available funds', 'AUD 950'); await summary(page, 'Protected total', 'AUD 735')
  await layout(page, 'runway'); await screenshot(s, width, 'runway')
  const navigation = page.locator('nav:visible')
  await expect(navigation).toHaveCount(1)
  assert.equal(await navigation.evaluate((el) => getComputedStyle(el).position), width < 1024 ? 'fixed' : 'static')
  await makePurchase(page)
  await summary(page, 'Runway before', 'AUD 215'); await summary(page, 'Remaining runway', 'AUD 55')
  assert.equal(s.requests('POST').length, 0); assert.equal(s.plans.A.availableFundsCents, 95000)
  await screenshot(s, width, 'preview'); await layout(page, 'preview')
  const processing = gate()
  s.enqueue('POST', ({ body, plans, history, keys }) => {
    const purchase = { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', planId: plans.A.id, userId: plans.A.userId, name: body.name, amountCents: body.amountCents, createdAt: plans.A.createdAt }
    plans.A = plan({ ...canonical, availableFundsCents: 79000 }); history.push(purchase); keys.set(body.idempotencyKey, { body, user: 'A', purchase })
    return { status: 201, body: { plan: plans.A, purchase, replayed: false }, gate: processing }
  })
  const mark = page.getByRole('button', { name: /Mark as spent/ })
  await reachable(page, mark, 'confirmation CTA'); await mark.focus(); await page.keyboard.press('Space')
  await expect(page.locator('button[aria-busy="true"]')).toBeDisabled()
  await page.locator('button[aria-busy="true"]').evaluate((el) => { el.click(); el.click() })
  await expect.poll(() => s.requests('POST').length).toBe(1)
  await expect(page.locator('[aria-live="polite"]')).toContainText('processing')
  assert.equal(await page.locator('svg.animate-spin').evaluate((el) => getComputedStyle(el).animationName), 'none')
  await screenshot(s, width, 'processing'); await layout(page, 'processing')
  processing.release(); await record(page); await summary(page, 'Updated discretionary runway', 'AUD 55')
  await screenshot(s, width, 'confirmed')
  await page.getByRole('button', { name: 'View updated runway' }).click(); await runway(page)
  await summary(page, 'Available funds', 'AUD 790')
  await page.getByRole('button', { name: 'Load purchase history' }).click(); await expect(page.getByText('C4 test purchase', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Sign out' }).click(); await at(page, '/login')
  await login(page, 'B'); await runway(page); await summary(page, 'Available funds', 'AUD 1,200')
  await expect(page.getByText('C4 test purchase', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Load purchase history' }).click(); await expect(page.getByText('No confirmed purchases yet.')).toBeVisible()
})

add('restoration loading, refresh and browser back/forward', { auth: { ...restoredAuth, restoreDelayMs: 700 } }, async (s, width) => {
  const { page } = s; await s.visit('/runway')
  await expect(page.getByRole('status')).toContainText('Restoring')
  await expect(page.getByText('AUD 950', { exact: true })).toHaveCount(0)
  await runway(page); await summary(page, 'Available funds', 'AUD 950')
  await page.reload(); await runway(page); await summary(page, 'Available funds', 'AUD 950')
  await page.locator('nav:visible').getByRole('link', { name: 'Edit plan' }).click(); await at(page, '/setup')
  await page.getByRole('button', { name: 'Continue to essentials' }).click(); await at(page, '/essentials')
  await page.goBack(); await at(page, '/setup'); await page.goForward(); await at(page, '/essentials')
  await expect(page.getByLabel(/^Fixed essentials/)).toHaveValue('455.00'); await layout(page, 'restored forms')
  await screenshot(s, width, 'restored-essentials')
})

add('invalid login and confirmation-required signup', {}, async (s) => {
  const { page } = s; await s.visit()
  await page.getByLabel('Email', { exact: true }).fill('invalid@example.invalid')
  await page.getByLabel('Password', { exact: true }).fill('c4-test-only-password')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('email or password'); assert.equal(s.records.length, 0)
  await page.getByRole('button', { name: 'Create an account' }).click()
  await page.getByLabel('Email', { exact: true }).fill('user-a@example.invalid')
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('confirm your account'); await at(page, '/login')
  assert.equal(s.records.length, 0); assert.equal(await page.evaluate(() => window.__C4_AUTH__.user()), null)
})

add('Auth bootstrap failure never fabricates a session', { auth: { authUnavailable: true } }, async (s) => {
  await s.visit('/result'); await at(s.page, '/login')
  await expect(s.page.getByRole('alert')).toContainText('Authentication is unavailable')
  await expect(s.page.getByRole('button', { name: 'Continue', exact: true })).toBeDisabled()
  assert.equal(s.records.length, 0)
})

add('anonymous access to every protected route stays at login', {}, async (s) => {
  for (const path of ['/setup', '/essentials', '/runway', '/purchase', '/result']) {
    await s.visit(path); await at(s.page, '/login')
    await expect(s.page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible()
    await expect(s.page.getByText('AUD 950', { exact: true })).toHaveCount(0)
  }
  assert.equal(s.records.length, 0)
})

add('pending initial plan GET does not flash setup or private amounts', { auth: restoredAuth }, async (s) => {
  const pending = gate(); s.enqueue('GET', { body: { plan: plan() }, gate: pending })
  await s.visit('/runway'); await expect(s.page.getByRole('status')).toContainText('Loading your saved plan')
  await expect(s.page.getByRole('heading', { name: 'Set up your runway' })).toHaveCount(0)
  await expect(s.page.getByText('AUD 950', { exact: true })).toHaveCount(0)
  pending.release(); await runway(s.page)
})

for (const [name, response] of [['network interruption', { abort: true }], ['unrelated 404', errorResponse(404, 'RESOURCE_NOT_FOUND')]]) {
  add(`initial ${name} is a retryable error rather than no plan`, { auth: restoredAuth }, async (s) => {
    s.enqueue('GET', response); await s.visit('/runway')
    await expect(s.page.getByRole('alert')).toBeVisible()
    await expect(s.page.getByRole('button', { name: 'Retry loading plan' })).toBeVisible()
    await expect(s.page.getByRole('heading', { name: 'Set up your runway' })).toHaveCount(0)
    await s.page.getByRole('button', { name: 'Retry loading plan' }).click(); await runway(s.page)
  })
}

for (const code of ['SERVICE_UNAVAILABLE', 'AUTH_VERIFICATION_UNAVAILABLE']) add(`${code} 503 is not an empty plan or logout`, { auth: restoredAuth }, async (s, width) => {
  s.enqueue('GET', errorResponse(503, code)); await s.visit('/runway')
  await expect(s.page.getByRole('button', { name: 'Retry loading plan' })).toBeVisible()
  await expect(s.page.getByRole('heading', { name: 'Set up your runway' })).toHaveCount(0)
  await expect(s.page.getByRole('heading', { name: 'Sign in', exact: true })).toHaveCount(0)
  await screenshot(s, width, `error-${code.toLowerCase()}`)
  await s.page.getByRole('button', { name: 'Retry loading plan' }).click(); await runway(s.page)
})

add('plan editing, failed save, draft preservation and safe retry', { auth: restoredAuth }, async (s, width) => {
  const { page } = s; await restored(s)
  await page.locator('nav:visible').getByRole('link', { name: 'Edit plan' }).click(); await at(page, '/setup')
  await expect(page.getByLabel(/Money available/)).toHaveValue('950.00')
  await page.getByLabel(/Money available/).fill('960.01'); await page.getByRole('button', { name: 'Continue to essentials' }).click()
  await page.getByLabel(/^Fixed essentials/).fill('450.01')
  s.enqueue('PUT', errorResponse(503, 'DATABASE_OPERATION_FAILED'))
  await page.getByRole('button', { name: 'Calculate my runway' }).click(); await expect(page.getByRole('alert')).toContainText('unavailable')
  await expect(page.getByLabel(/^Fixed essentials/)).toHaveValue('450.01'); await at(page, '/essentials')
  assert.equal(s.plans.A.availableFundsCents, 95000)
  await layout(page, 'save failure'); await screenshot(s, width, 'save-error')
  await reachable(page, page.getByRole('button', { name: 'Calculate my runway' }), 'retry save CTA')
  await page.getByRole('button', { name: 'Calculate my runway' }).click(); await runway(page)
  await summary(page, 'Available funds', 'AUD 960.01')
  assert.equal(s.requests('PUT')[1].body.availableFundsCents, 96001)
  await page.reload(); await runway(page); await summary(page, 'Available funds', 'AUD 960.01')
})

add('strict form input, empty date and cents conversion', { saved: false, auth: restoredAuth }, async (s) => {
  const { page } = s; await s.visit('/setup'); await expect(page.getByLabel(/Money available/)).toBeVisible()
  await page.getByRole('button', { name: 'Continue to essentials' }).click(); await expect(page.getByRole('alert')).toHaveCount(3)
  await page.getByLabel('Planning date', { exact: true }).fill('2026-10-12'); await page.getByLabel(/Emergency reserve/).fill('0')
  for (const amount of ['-1', '0.001', '1,000', '1e3', '1000000.01']) {
    await page.getByLabel(/Money available/).fill(amount); await page.getByRole('button', { name: 'Continue to essentials' }).click()
    await at(page, '/setup'); await expect(page.getByRole('alert')).toBeVisible(); assert.equal(s.requests('PUT').length, 0)
  }
  await page.getByLabel(/Money available/).fill('0.03'); await page.getByLabel('Planning date', { exact: true }).fill('')
  await page.getByRole('button', { name: 'Continue to essentials' }).click(); await expect(page.getByRole('alert')).toContainText('planning date')
  await page.getByLabel('Planning date', { exact: true }).fill('2026-10-12')
  await page.getByRole('button', { name: 'Continue to essentials' }).click()
  await page.getByLabel(/^Fixed essentials/).fill('0.01'); await page.getByLabel(/^Flexible essentials/).fill('0.01')
  await page.getByRole('button', { name: 'Calculate my runway' }).click(); await runway(page)
  assert.deepEqual(s.requests('PUT')[0].body, { planningDate: '2026-10-12', availableFundsCents: 3, safetyBufferCents: 0, fixedEssentialsCents: 1, flexibleEssentialsCents: 1 })
})

add('excess preview, exact runway, success remount and new UUID', { auth: restoredAuth }, async (s) => {
  const { page } = s; await restored(s); await makePurchase(page, '300')
  await summary(page, 'Amount above runway', 'AUD 85'); await expect(page.getByRole('button', { name: /Mark as spent/ })).toHaveCount(0)
  assert.equal(s.requests('POST').length, 0)
  await page.getByRole('button', { name: 'Edit purchase' }).click(); await page.getByLabel(/Purchase amount/).fill('215')
  await page.getByRole('button', { name: 'Preview impact' }).click(); await summary(page, 'Remaining runway', 'AUD 0')
  await confirm(page); await record(page); await summary(page, 'Updated discretionary runway', 'AUD 0')
  await page.goBack(); await at(page, '/purchase'); await page.goForward(); await record(page)
  assert.equal(s.requests('POST').length, 1)
  await page.getByRole('button', { name: 'Check another purchase' }).click()
  await expect(page.getByLabel('Purchase name', { exact: true })).toHaveValue('')
  // A new user-approved proposal is previewed but cannot spend beyond the exhausted runway.
  await page.getByLabel('Purchase name', { exact: true }).fill('New proposal'); await page.getByLabel(/Purchase amount/).fill('1')
  await page.getByRole('button', { name: 'Preview impact' }).click()
  await expect(page.getByRole('button', { name: 'Edit purchase' })).toBeVisible(); assert.equal(s.requests('POST').length, 1)
})

add('new eligible purchase has a distinct UUID', { auth: restoredAuth }, async (s) => {
  await restored(s); await makePurchase(s.page); await confirm(s.page); await record(s.page)
  await s.page.getByRole('button', { name: 'Check another purchase' }).click()
  await s.page.getByLabel('Purchase name', { exact: true }).fill('Second purchase'); await s.page.getByLabel(/Purchase amount/).fill('1')
  await s.page.getByRole('button', { name: 'Preview impact' }).click(); await confirm(s.page); await record(s.page)
  assert.notEqual(s.requests('POST')[0].body.idempotencyKey, s.requests('POST')[1].body.idempotencyKey)
})

add('confirmed server balance overrides a local subtraction estimate', { auth: restoredAuth }, async (s) => {
  await restored(s); await makePurchase(s.page)
  s.enqueue('POST', ({ body, plans }) => {
    plans.A = plan({ ...canonical, availableFundsCents: 77700 })
    return { status: 201, body: { plan: plans.A, replayed: false,
      purchase: { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', planId: plans.A.id, userId: plans.A.userId,
        name: body.name, amountCents: body.amountCents, createdAt: plans.A.createdAt } } }
  })
  await confirm(s.page); await record(s.page); await summary(s.page, 'Updated discretionary runway', 'AUD 42')
  await s.page.getByRole('button', { name: 'View updated runway' }).click(); await runway(s.page)
  await summary(s.page, 'Available funds', 'AUD 777'); assert.equal(s.requests('POST').length, 1)
})

add('purchase history failure and retry preserves authoritative runway', { auth: restoredAuth }, async (s) => {
  await restored(s); s.enqueue('GET', errorResponse(503, 'DATABASE_OPERATION_FAILED'), 'A', '/api/plans/current/purchases')
  await s.page.getByRole('button', { name: 'Load purchase history' }).click()
  await expect(s.page.getByRole('alert')).toBeVisible(); await summary(s.page, 'Available funds', 'AUD 950')
  await s.page.getByRole('button', { name: 'Load purchase history' }).click()
  await expect(s.page.getByText('No confirmed purchases yet.')).toBeVisible()
})

add('timeout after mock commit, immutable retry and replay 200', { auth: { ...restoredAuth, requestTimeoutMs: 300 } }, async (s, width) => {
  const { page } = s; await restored(s); await makePurchase(page)
  const pending = gate()
  s.enqueue('POST', ({ body, plans, history, keys }) => {
    const purchase = { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', planId: plans.A.id, userId: plans.A.userId, name: body.name, amountCents: body.amountCents, createdAt: plans.A.createdAt }
    plans.A = plan({ ...canonical, availableFundsCents: 79000 }); history.push(purchase); keys.set(body.idempotencyKey, { body, user: 'A', purchase })
    return { status: 201, body: { purchase, plan: plans.A, replayed: false }, gate: pending }
  })
  await confirm(page); await expect(page.getByRole('button', { name: 'Retry same confirmation' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Purchase recorded' })).toHaveCount(0)
  await summary(page, 'Runway before', 'AUD 215'); await expect(page.getByRole('button', { name: 'Back without saving' })).toBeDisabled()
  await page.locator('nav:visible').getByRole('link', { name: 'Check', exact: true }).click(); await at(page, '/result')
  await page.locator('nav:visible').getByRole('link', { name: 'Edit plan' }).click(); await at(page, '/result')
  await screenshot(s, width, 'uncertain'); await layout(page, 'uncertain')
  await page.getByRole('button', { name: 'Refresh saved plan' }).click(); await summary(page, 'Runway before', 'AUD 55')
  await expect(page.getByRole('heading', { name: 'Purchase recorded' })).toHaveCount(0)
  pending.release(); await reachable(page, page.getByRole('button', { name: 'Retry same confirmation' }), 'uncertain retry CTA')
  await page.getByRole('button', { name: 'Retry same confirmation' }).click(); await record(page)
  await expect(page.getByRole('status')).toContainText('No second deduction')
  assert.deepEqual(s.requests('POST')[0].body, s.requests('POST')[1].body)
  assert.equal(s.requests('POST')[1].status, 200); assert.equal(s.history.length, 1); assert.equal(s.plans.A.availableFundsCents, 79000)
})

add('uncertain refresh returns safely without automatic POST', { auth: restoredAuth }, async (s) => {
  await restored(s); await makePurchase(s.page); s.enqueue('POST', { abort: true }); await confirm(s.page)
  await expect(s.page.getByRole('button', { name: 'Retry same confirmation' })).toBeVisible()
  await s.page.reload(); await at(s.page, '/purchase')
  await expect(s.page.getByLabel('Purchase name', { exact: true })).toHaveValue('')
  await expect(s.page.getByRole('heading', { name: 'Purchase recorded' })).toHaveCount(0)
  assert.equal(s.requests('POST').length, 1)
})

for (const [status, code] of [[409, 'IDEMPOTENCY_KEY_REUSED'], [422, 'INVALID_REQUEST'], [503, 'DATABASE_OPERATION_FAILED']]) {
  add(`purchase error ${status} ${code}`, { auth: restoredAuth }, async (s) => {
    await restored(s); await makePurchase(s.page); s.enqueue('POST', errorResponse(status, code)); await confirm(s.page)
    await expect(s.page.getByRole('alert')).toBeVisible(); await expect(s.page.getByRole('heading', { name: 'Purchase recorded' })).toHaveCount(0)
    assert.equal(s.plans.A.availableFundsCents, 95000); assert.equal(s.requests('POST').length, 1)
    if (status === 409) { await expect(s.page.getByRole('button', { name: /Mark as spent/ })).toBeDisabled(); await expect(s.page.getByRole('button', { name: 'Back without saving' })).toBeDisabled() }
    if (status === 503) await expect(s.page.getByRole('button', { name: 'Retry same confirmation' })).toBeEnabled()
    if (status === 422) await expect(s.page.getByRole('button', { name: /Mark as spent/ })).toBeEnabled()
  })
}

add('stale saved balance causes 409 reconciliation and safe edit', { auth: restoredAuth }, async (s) => {
  await restored(s); await makePurchase(s.page)
  s.plans.A = plan({ ...canonical, availableFundsCents: 79000 })
  await confirm(s.page); await expect(s.page.getByRole('alert')).toContainText('too low')
  await summary(s.page, 'Runway before', 'AUD 55')
  await s.page.getByRole('button', { name: 'Edit purchase' }).click()
  await expect(s.page.getByLabel(/Purchase amount/)).toHaveValue('160')
  assert.equal(s.history.length, 0)
})

add('altered successful replay identity/payload cannot claim success', { auth: restoredAuth }, async (s) => {
  await restored(s); await makePurchase(s.page)
  s.enqueue('POST', ({ plans }) => ({ body: { replayed: true, plan: plan({ ...canonical, availableFundsCents: 79000 }),
    purchase: { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', planId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', userId: plans.B.userId,
      name: 'Different purchase', amountCents: 1, createdAt: plans.A.createdAt } } }))
  await confirm(s.page); await expect(s.page.getByRole('button', { name: 'Retry same confirmation' })).toBeVisible()
  await expect(s.page.getByRole('heading', { name: 'Purchase recorded' })).toHaveCount(0)
  await summary(s.page, 'Runway before', 'AUD 215'); assert.equal(s.requests('POST').length, 1)
})

for (const method of ['GET', 'PUT', 'POST']) add(`401 session expiration at ${method}`, { auth: restoredAuth }, async (s) => {
  if (method === 'GET') s.enqueue('GET', errorResponse(401, 'INVALID_ACCESS_TOKEN'))
  await s.visit(method === 'PUT' ? '/essentials' : '/runway')
  if (method !== 'GET') {
    if (method === 'PUT') { await expect(s.page.getByLabel(/^Fixed essentials/)).toBeVisible(); s.enqueue('PUT', errorResponse(401, 'INVALID_ACCESS_TOKEN')); await s.page.getByRole('button', { name: 'Calculate my runway' }).click() }
    else { await runway(s.page); await makePurchase(s.page); s.enqueue('POST', errorResponse(401, 'INVALID_ACCESS_TOKEN')); await confirm(s.page) }
  }
  await at(s.page, '/login'); await expect(s.page.getByRole('alert')).toContainText('session expired')
  await expect(s.page.getByText('AUD 950', { exact: true })).toHaveCount(0)
  assert.equal(await s.page.evaluate(() => window.__C4_AUTH__.user()), null)
})

for (const method of ['GET', 'POST']) add(`late User A ${method} response cannot overwrite User B`, { auth: restoredAuth }, async (s) => {
  const pending = gate()
  if (method === 'GET') s.enqueue('GET', { body: { plan: plan() }, gate: pending }, 'A')
  await s.visit('/runway')
  if (method === 'POST') {
    await runway(s.page); await makePurchase(s.page)
    s.enqueue('POST', ({ body }) => ({ body: { plan: plan({ ...canonical, availableFundsCents: 79000 }), replayed: false,
      purchase: { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', planId: plan().id, userId: plan().userId, name: body.name, amountCents: body.amountCents, createdAt: plan().createdAt } }, status: 201, gate: pending }))
    await confirm(s.page)
  }
  await expect.poll(() => s.requests(method).length).toBeGreaterThan(0)
  await s.page.evaluate(() => window.__C4_AUTH__.emit('B'))
  if (method === 'POST') { await at(s.page, '/purchase'); await s.page.locator('nav:visible').getByRole('link', { name: 'Runway', exact: true }).click() }
  await runway(s.page); await summary(s.page, 'Available funds', 'AUD 1,200')
  pending.release(); await s.page.waitForTimeout(80)
  await summary(s.page, 'Available funds', 'AUD 1,200')
  await expect(s.page.getByText('C4 test purchase', { exact: true })).toHaveCount(0)
})

add('deep links, logout back navigation and invalid result cannot write', { auth: restoredAuth }, async (s) => {
  await s.visit('/result'); await at(s.page, '/purchase'); assert.equal(s.requests('POST').length, 0)
  await s.page.locator('nav:visible').getByRole('link', { name: 'Runway', exact: true }).click(); await runway(s.page)
  await s.page.getByRole('button', { name: 'Sign out' }).click(); await at(s.page, '/login')
  await s.page.goBack(); await at(s.page, '/login'); await expect(s.page.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible()
  await s.visit('/unknown'); await at(s.page, '/login'); assert.equal(s.requests('POST').length, 0)
})

add('shortfall and maximum financial display fit', { auth: restoredAuth, seed: { ...canonical, availableFundsCents: 65000, fixedEssentialsCents: 45400 } }, async (s, width) => {
  await restored(s); await expect(s.page.getByRole('alert')).toContainText('AUD 84')
  await expect(s.page.locator('p.text-money')).toHaveText('AUD 0')
  s.plans.A = plan({ ...canonical, availableFundsCents: 100000000, safetyBufferCents: 0, fixedEssentialsCents: 0, flexibleEssentialsCents: 0 })
  await s.page.reload(); await runway(s.page); await summary(s.page, 'Available funds', 'AUD 1,000,000')
  await makePurchase(s.page, '1000000', 'x'.repeat(120)); await layout(s.page, 'maximum purchase display')
  await reachable(s.page, s.page.getByRole('button', { name: /Mark as spent/ }), 'maximum display confirmation CTA')
  await screenshot(s, width, 'maximum-preview')
  await confirm(s.page); await record(s.page); await layout(s.page, 'maximum confirmed display')
  await s.page.getByRole('button', { name: 'View updated runway' }).click(); await runway(s.page)
  await s.page.getByRole('button', { name: 'Load purchase history' }).click()
  await expect(s.page.getByText('x'.repeat(120), { exact: true })).toBeVisible()
  await layout(s.page, 'maximum purchase history display')
  await screenshot(s, width, 'maximum-history')
})

await mkdir(evidence, { recursive: true })
const { server, base } = await startBrowserServer(root)
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const width of widths) for (const item of cases.filter((entry) => entry.name.includes(filter))) {
    const started = Date.now(); const s = await scenario(browser, base, width, item.options)
    let failure = null
    try { await item.run(s, width); await layout(s.page, item.name) }
    catch (error) { failure = String(error); await s.page.screenshot({ path: resolve(evidence, `${width}-failure-${results.length}.png`), fullPage: true }).catch(() => {}) }
    try { await s.close() } catch (error) { failure ??= String(error) }
    results.push({ name: item.name, width, result: failure ? 'FAIL' : 'PASS', durationMs: Date.now() - started,
      requests: s.records, error: failure, warnings: [...new Set(s.warnings)], blockedExternalOrigins: [...s.blockedExternal],
      pageErrors: s.errors, mode: 'OFFLINE AUTH / INTERCEPTED HTTP; NO HOSTED DATA' })
    console.log(`${width}px ${failure ? 'FAIL' : 'PASS'}: ${item.name}${failure ? '\n' + failure.slice(0, 800) : ''}`)
  }
} finally {
  await browser.close(); await server.close()
  const failed = results.filter((item) => item.result === 'FAIL').length
  await writeFile(resolve(evidence, 'browser-results.json'), JSON.stringify({ mode: 'OFFLINE E2E ONLY; FALLBACK FONT; NO LIVE SUPABASE CLAIM',
    passed: results.length - failed, failed, skipped: 0, results }, null, 2))
  console.log(`C4 offline browser results: ${results.length - failed} passed, ${failed} failed, 0 skipped.`)
  if (failed) process.exitCode = 1
}
