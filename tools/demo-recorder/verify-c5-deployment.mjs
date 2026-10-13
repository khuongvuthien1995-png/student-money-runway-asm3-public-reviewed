/* global console, process, URL, Buffer, fetch, window */
// LOCAL routing model using Vercel's route compiler + real dist files and FastAPI.
// Original-path delivery to a hosted Python function remains a C6 Preview assertion.
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { resolve, sep, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { convertRewrites } from '@vercel/routing-utils'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('../../', import.meta.url))
const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'))
const routes = convertRewrites(config.rewrites)
const dist = resolve(root, config.outputDirectory)
const origin = 'http://127.0.0.1:5195'
const checks = [], pageErrors = [], blocked = new Set()
const contentType = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' }
function check(name, assertion) { assertion(); checks.push({ name, result: 'PASS' }) }
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, origin)
    const route = routes.find((entry) => entry.src && new RegExp(entry.src).test(url.pathname))
    if (route?.dest?.split('?')[0] === '/api') {
      const chunks = []
      for await (const chunk of request) chunks.push(chunk)
      const body = Buffer.concat(chunks)
      const upstream = await fetch(`http://127.0.0.1:8000${url.pathname}${url.search}`, {
        method: request.method, headers: { ...(request.headers.authorization ? { Authorization: request.headers.authorization } : {}), 'Content-Type': 'application/json' },
        ...(body.length ? { body } : {}), redirect: 'manual',
      })
      response.writeHead(upstream.status, Object.fromEntries(upstream.headers))
      response.end(Buffer.from(await upstream.arrayBuffer()))
      return
    }
    let path = resolve(dist, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname))
    if (!path.startsWith(dist + sep)) { response.writeHead(400); response.end(); return }
    const exists = await stat(path).then((entry) => entry.isFile()).catch(() => false)
    if (!exists && route?.dest === '/index.html') path = resolve(dist, 'index.html')
    const data = await readFile(path).catch(() => null)
    if (!data) { response.writeHead(404); response.end('Not Found'); return }
    response.writeHead(200, { 'Content-Type': contentType[extname(path)] ?? 'application/octet-stream' }); response.end(data)
  } catch { response.writeHead(500, { 'Content-Type': 'application/json' }); response.end('{"error":"Local routing check failed"}') }
})
await new Promise((ready, reject) => { server.once('error', reject); server.listen(5195, '127.0.0.1', ready) })
let browser, error = null
try {
  const index = await readFile(resolve(dist, 'index.html'), 'utf8')
  for (const path of ['/', '/login', '/setup', '/essentials', '/runway', '/purchase', '/result']) {
    const response = await fetch(origin + path)
    const body = await response.text()
    check(`direct SPA ${path}`, () => { assert.equal(response.status, 200); assert.equal(body, index); assert.match(response.headers.get('content-type'), /text\/html/) })
  }
  const assets = [...index.matchAll(/(?:src|href)="(\/assets\/[^" ]+)"/g)].map((match) => match[1])
  assert.ok(assets.some((path) => path.endsWith('.js')) && assets.some((path) => path.endsWith('.css')))
  for (const path of [...assets, '/favicon.svg', '/icons.svg']) {
    const response = await fetch(origin + path)
    check(`static asset ${path}`, () => { assert.equal(response.status, 200); assert.notEqual(response.headers.get('content-type'), 'text/html') })
  }
  const health = await fetch(origin + '/api/health')
  check('actual JSON health through API rule', () => assert.equal(health.status, 200))
  assert.deepEqual(await health.json(), { status: 'ok' })
  for (const path of ['/api', '/api/unknown', '/api/api/health']) {
    const response = await fetch(origin + path), body = await response.text()
    check(`API 404 stays JSON: ${path}`, () => { assert.equal(response.status, 404); assert.match(response.headers.get('content-type'), /application\/json/); assert.equal(response.headers.get('cache-control'), 'private, no-store'); assert.ok(!body.includes('<html')); assert.deepEqual(JSON.parse(body), { detail: 'Not Found' }) })
  }
  for (const [method, path] of [['GET', '/api/plans/current'], ['PUT', '/api/plans/current'], ['GET', '/api/plans/current/purchases'], ['POST', '/api/plans/current/purchases']]) {
    for (const token of [null, 'Bearer not-a-token']) {
      const response = await fetch(origin + path, { method, headers: { ...(token ? { Authorization: token } : {}), 'Content-Type': 'application/json' },
        ...(['PUT', 'POST'].includes(method) ? { body: '{}' } : {}) })
      check(`real unauthorized ${method} ${path}: ${token ? 'malformed' : 'missing'}`, () => { assert.equal(response.status, 401); assert.match(response.headers.get('content-type'), /application\/json/); assert.equal(response.headers.get('cache-control'), 'private, no-store'); assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store') })
      assert.ok((await response.json()).error.code)
    }
  }
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== origin) { blocked.add(url.origin); return route.abort() }
    return route.continue()
  })
  const page = await context.newPage()
  page.on('pageerror', (failure) => pageErrors.push(failure.message))
  await page.goto(origin + '/runway')
  await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor()
  check('actual production App loads safely without test Auth or cloud credentials', () => { assert.equal(new URL(page.url()).pathname, '/login'); assert.deepEqual(pageErrors, []) })
  assert.equal(await page.evaluate(() => '__C4_AUTH__' in window || '__C4_OPTIONS__' in window), false)
  assert.ok(![...blocked].some((value) => /supabase|github|vercel/i.test(value)))
  await context.close()
} catch (failure) { error = String(failure) }
finally {
  if (browser) await browser.close()
  server.closeAllConnections(); await new Promise((done) => server.close(done))
  const evidence = resolve(root, 'docs/implementation/evidence/c5')
  await mkdir(evidence, { recursive: true })
  await writeFile(resolve(evidence, 'routing-results.json'), JSON.stringify({ mode: 'LOCAL ROUTING MODEL; REAL BUILT ASSETS AND LOOPBACK FASTAPI; NOT HOSTED VERCEL', passed: checks.length,
    failed: error ? 1 : 0, skipped: 0, checks, pageErrors, blockedExternalOrigins: [...blocked], error }, null, 2))
}
console.log(`C5 local deployment routing: ${checks.length} checks passed; ${error ? 1 : 0} failed; 0 skipped.`)
if (error) { console.error(error); process.exitCode = 1 }
