/* global URL, setTimeout, document, window */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { expect } from 'playwright/test'

export { expect }
export const canonical = { planningDate: '2026-10-12', availableFundsCents: 95000, safetyBufferCents: 10000, fixedEssentialsCents: 45500, flexibleEssentialsCents: 18000 }
const owners = { A: '11111111-1111-4111-8111-111111111111', B: '22222222-2222-4222-8222-222222222222' }
export function plan(body = canonical, user = 'A') {
  const protectedTotalCents = body.safetyBufferCents + body.fixedEssentialsCents + body.flexibleEssentialsCents
  return { ...body, id: user === 'A' ? 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' : 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', userId: owners[user],
    protectedTotalCents, runwayCents: Math.max(0, body.availableFundsCents - protectedTotalCents), shortfallCents: Math.max(0, protectedTotalCents - body.availableFundsCents),
    createdAt: '2026-10-12T00:00:00Z', updatedAt: '2026-10-12T00:00:00Z' }
}
export function gate() { let release; const promise = new Promise((done) => { release = done }); return { promise, release } }
export const errorResponse = (status, code) => ({ status, body: { error: { code, message: `Offline test ${code}` } } })

export async function startBrowserServer(root) {
  const { createServer } = await import(pathToFileURL(resolve(root, 'node_modules/vite/dist/node/index.js')).href)
  const html = await readFile(resolve(root, 'tests/browser/c4.html'), 'utf8')
  const server = await createServer({ root, cacheDir: resolve(root, 'node_modules/.vite-c4-qa'),
    configFile: resolve(root, 'vite.config.ts'), server: { host: '127.0.0.1', port: 5193, strictPort: true, forwardConsole: false },
    plugins: [{ name: 'c4-test-only-entry', configureServer(vite) {
      vite.middlewares.use(async (request, response, next) => {
        const path = new URL(request.url, 'http://127.0.0.1').pathname
        if (!['/', '/login', '/setup', '/essentials', '/runway', '/purchase', '/result', '/unknown'].includes(path)) return next()
        try { response.setHeader('Content-Type', 'text/html'); response.end(await vite.transformIndexHtml(path, html)) } catch (error) { next(error) }
      })
    } }],
  })
  await server.listen()
  assert.equal(server.config.server.proxy['/api'].target, 'http://127.0.0.1:8000')
  return { server, base: 'http://127.0.0.1:5193' }
}

export async function scenario(browser, base, width, options = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: options.motion ?? 'reduce' })
  await context.addInitScript((value) => { window.__C4_OPTIONS__ = value }, options.auth ?? {})
  const page = await context.newPage()
  const errors = [], warnings = [], blockedExternal = new Set()
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (!['error', 'warning'].includes(message.type())) return
    const text = message.text()
    // Migration notices and the requested reduced-motion notice are informational.
    if (/React Router Future Flag Warning|You have Reduced Motion enabled/.test(text)) warnings.push(text)
    else if (message.type() === 'warning' || !/^Failed to load resource:/.test(text)) errors.push(text)
  })
  const records = [], queue = [], history = [], keys = new Map(), releases = []
  const plans = { A: options.saved === false ? null : plan(options.seed ?? canonical), B: options.savedB === false ? null : plan({ ...canonical, availableFundsCents: 120000 }, 'B') }
  let purchaseCount = 0
  async function routeHandler(route) {
    const request = route.request(), url = new URL(request.url())
    if (url.origin !== base) {
      blockedExternal.add(url.origin)
      if (/supabase|github|vercel/i.test(url.hostname)) errors.push('Unexpected provider request from offline test.')
      return route.abort()
    }
    if (!url.pathname.startsWith('/api/')) return route.continue()
    const method = request.method(), user = request.headers().authorization?.replace('Bearer c4-test-only-bearer-', '')
    const body = request.postDataJSON()
    const record = { method, path: url.pathname, user, body, status: null }
    records.push(record)
    const selected = queue.findIndex((entry) => entry.method === method && (!entry.user || entry.user === user) && (!entry.path || entry.path === url.pathname))
    let spec = selected >= 0 ? queue.splice(selected, 1)[0].response : null
    if (typeof spec === 'function') spec = spec({ body, user, plans, history, keys })
    if (!spec) {
      if (!owners[user]) spec = errorResponse(401, 'UNAUTHENTICATED')
      else if (method === 'PUT') { plans[user] = plan(body, user); spec = { body: { plan: plans[user] } } }
      else if (url.pathname.endsWith('/purchases')) {
        if (!plans[user]) spec = errorResponse(404, 'PLAN_NOT_FOUND')
        else if (method === 'GET') spec = { body: { purchases: history.filter((purchase) => purchase.userId === owners[user]) } }
        else {
          const old = keys.get(body.idempotencyKey)
          if (old && (old.user !== user || old.body.name !== body.name || old.body.amountCents !== body.amountCents)) spec = errorResponse(409, 'IDEMPOTENCY_KEY_REUSED')
          else if (old) spec = { body: { purchase: old.purchase, plan: plans[user], replayed: true } }
          else if (body.amountCents > plans[user].runwayCents) spec = errorResponse(409, 'PURCHASE_EXCEEDS_RUNWAY')
          else {
            purchaseCount += 1
            const purchase = { id: `bbbbbbbb-bbbb-4bbb-8bbb-${String(purchaseCount).padStart(12, '0')}`, planId: plans[user].id, userId: owners[user], name: body.name, amountCents: body.amountCents, createdAt: '2026-10-12T00:00:00Z' }
            plans[user] = plan({ ...plans[user], availableFundsCents: plans[user].availableFundsCents - body.amountCents }, user)
            history.push(purchase); keys.set(body.idempotencyKey, { user, body, purchase })
            spec = { status: 201, body: { purchase, plan: plans[user], replayed: false } }
          }
        }
      } else spec = plans[user] ? { body: { plan: plans[user] } } : errorResponse(404, 'PLAN_NOT_FOUND')
    }
    record.status = spec.status ?? 200
    if (spec.gate) { releases.push(spec.gate.release); await spec.gate.promise }
    if (spec.delay) await new Promise((done) => setTimeout(done, spec.delay))
    if (spec.abort) return route.abort('failed')
    try { await route.fulfill({ status: record.status, contentType: 'application/json', body: JSON.stringify(spec.body) }) }
    catch (error) { if (!/closed|disposed|not found|Invalid InterceptionId/i.test(String(error))) throw error }
  }
  await context.route('**/*', routeHandler)
  return { page, context, records, plans, history, keys, errors, warnings, blockedExternal,
    enqueue(method, response, user, path) { queue.push({ method, response, user, path }) },
    requests(method) { return records.filter((record) => record.method === method) },
    async visit(path = '/login') { await page.goto(base + path) },
    async close() { for (const release of releases) release(); await context.close(); assert.deepEqual(errors, [], 'Browser exceptions/critical React warnings') },
  }
}

export async function at(page, path) { await expect(page).toHaveURL(new RegExp(`${path.replaceAll('/', '\\/')}$`)) }
export async function login(page, user = 'A') {
  await page.getByLabel('Email', { exact: true }).fill(user === 'B' ? 'user-b@example.invalid' : 'user-a@example.invalid')
  await page.getByLabel('Password', { exact: true }).fill('c4-test-only-password')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}
export async function runway(page) { await expect(page.getByRole('heading', { name: 'Your discretionary runway' })).toBeVisible() }
export async function makePurchase(page, amount = '160', name = 'C4 test purchase') {
  await page.getByRole('button', { name: 'Check a purchase', exact: true }).click()
  await at(page, '/purchase')
  await page.getByLabel('Purchase name', { exact: true }).fill(name)
  await page.getByLabel(/Purchase amount/).fill(amount)
  await page.getByRole('button', { name: 'Preview impact' }).click()
  await at(page, '/result')
}
export async function summary(page, label, value) {
  await expect(page.getByText(label, { exact: true }).locator('..').getByText(value, { exact: true })).toBeVisible()
}
export async function layout(page, label) {
  const bounds = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
  assert.ok(bounds.scroll <= bounds.viewport, `${label}: horizontal overflow ${JSON.stringify(bounds)}`)
}
export async function reachable(page, locator, label) {
  await locator.evaluate((element) => element.scrollIntoView({ block: 'center' }))
  const box = await locator.boundingBox(), viewport = page.viewportSize()
  assert.ok(box && box.x >= 0 && box.x + box.width <= viewport.width + 1, `${label}: horizontal CTA clipping`)
  const mobileNavigation = page.locator('nav.fixed:visible')
  const nav = await mobileNavigation.count() ? await mobileNavigation.boundingBox() : null
  assert.ok(box && box.y >= 0 && box.y + box.height <= (nav?.y ?? viewport.height) + 1, `${label}: CTA obscured by fixed navigation`)
}
