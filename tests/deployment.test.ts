// @vitest-environment node
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { convertRewrites, getTransformedRoutes, type Rewrite } from '@vercel/routing-utils'

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const { default: Ajv } = createRequire(import.meta.url)('ajv-draft-04') as typeof import('ajv-draft-04')
const config = JSON.parse(read('vercel.json'))
const schema = JSON.parse(read('tests/fixtures/vercel-schema.json'))
// The published Draft-04 schema has three numeric Draft-06 exclusiveMinimum entries.
// Normalize their equivalent semantics in memory; keep the official snapshot unchanged.
let dialectRepairs = 0
function normalizeDialect(value: unknown) {
  if (!value || typeof value !== 'object') return
  if ('exclusiveMinimum' in value && typeof value.exclusiveMinimum === 'number') {
    if ('minimum' in value) throw new Error('Unexpected mixed bounds in official schema')
    Object.assign(value, { minimum: value.exclusiveMinimum, exclusiveMinimum: true })
    dialectRepairs += 1
  }
  for (const child of Object.values(value)) normalizeDialect(child)
}
normalizeDialect(schema)
const validator = new Ajv({ strict: false, allErrors: true, validateFormats: false }).compile(schema)
const rewrites = convertRewrites(config.rewrites)
const match = (path: string) => rewrites.find((route) => route.src && new RegExp(route.src).test(path))

describe('deployment configuration against the official schema and Vercel route compiler', () => {
  it('accepts the actual config and rejects an invented runtime option', () => {
    expect(dialectRepairs).toBe(3)
    expect(validator(config), JSON.stringify(validator.errors)).toBe(true)
    expect(validator({ ...config, inventedRuntime: 'python3.12' })).toBe(false)
    expect(getTransformedRoutes(config).error).toBeNull()
  })
  it('uses the existing file-based Python function with an explicit Vite preset', () => {
    expect(config.framework).toBe('vite')
    expect(config.installCommand).toBe('npm ci')
    expect(config.buildCommand).toBe('npm run build')
    expect(config.outputDirectory).toBe('dist')
    expect(Object.keys(config.functions)).toEqual(['api/index.py'])
    expect(config.builds).toBeUndefined()
    expect(read('api/index.py')).toContain('from backend.app.main import app')
  })
  it.each(['/api', '/api/health', '/api/plans/current', '/api/plans/current/purchases', '/api/missing', '/api/api/health'])('routes %s to the Python function instead of HTML', (path) => {
    expect(match(path)?.dest?.split('?')[0]).toBe('/api')
  })
  it.each(['/login', '/setup', '/essentials', '/runway', '/purchase', '/result'])('maps direct SPA route %s to the built index', (path) => {
    expect(match(path)?.dest).toBe('/index.html')
  })
  it.each(['/assets/index-example.js', '/assets/index-example.css', '/favicon.svg', '/icons.svg', '/apiary', '/unknown'])('does not swallow static or unrelated path %s', (path) => {
    expect(match(path)).toBeUndefined()
  })
  it('never gives an API path an SPA fallback even if rewrite ordering changes', () => {
    const spa = config.rewrites.filter((route: Rewrite) => route.destination === '/index.html')
    for (const route of convertRewrites(spa)) expect(route.src && new RegExp(route.src).test('/api/unknown')).toBe(false)
    expect(config.rewrites[0].source).toBe('/api/:path*')
  })
  it('keeps filesystem handling before fallback routes', () => {
    const routes = getTransformedRoutes(config).routes ?? []
    const filesystem = routes.findIndex((route) => 'handle' in route && route.handle === 'filesystem')
    const fallback = routes.findIndex((route) => 'dest' in route && route.dest === '/index.html')
    expect(filesystem).toBeGreaterThanOrEqual(0)
    expect(fallback).toBeGreaterThan(filesystem)
  })
  it('prevents browser and CDN storage for API responses without wildcard CORS', () => {
    expect(config.headers[0].headers).toEqual([
      { key: 'Cache-Control', value: 'private, no-store' },
      { key: 'CDN-Cache-Control', value: 'no-store' },
      { key: 'Vercel-CDN-Cache-Control', value: 'no-store' },
    ])
    expect(JSON.stringify(config)).not.toContain('Access-Control-Allow-Origin')
    expect(JSON.stringify(config)).not.toContain('localhost')
  })
  it('pins supported runtimes and production Python constraints', () => {
    expect(read('.python-version').trim()).toBe('3.12')
    expect(JSON.parse(read('package.json')).engines.node).toBe('24.x')
    const production = read('requirements.txt').split(/\r?\n/).filter(line => line && !line.startsWith('#'))
    const constraints = read('requirements-lock.txt').split(/\r?\n/)
    expect(production.length).toBeGreaterThan(5)
    for (const requirement of production) {
      expect(requirement).toMatch(/^[A-Za-z0-9_-]+==[0-9][A-Za-z0-9.+-]*$/)
      expect(constraints).toContain(requirement)
    }
    expect(read('requirements.txt')).not.toMatch(/pytest|Windows|C:\\/)
  })
  it('excludes private files and QA evidence from deployment while keeping source entrypoints', () => {
    const ignored = read('.vercelignore').split(/\r?\n/)
    for (const pattern of ['.env', '.env.*', '.venv/', 'node_modules/', 'backend/tests/', 'tests/', 'tools/', 'docs/']) expect(ignored).toContain(pattern)
    for (const forbidden of ['src/', 'backend/', 'api/', 'public/', 'requirements-lock.txt', 'vite.config.ts']) expect(ignored).not.toContain(forbidden)
    expect(config.functions['api/index.py'].excludeFiles).toContain('backend/tests/**')
    expect(config.functions['api/index.py'].excludeFiles).not.toContain('backend/app/**')
  })
  it('documents supported names and commands without populated credentials', () => {
    const template = read('.env.example'), guide = read('README.md')
    for (const name of ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_JWT_ISSUER', 'SUPABASE_AUTH_VERIFICATION_MODE', 'ALLOWED_ORIGIN']) {
      expect(template).toContain(`${name}=`)
      expect(guide).toContain(name)
    }
    expect(template).not.toMatch(/^VITE_.*(?:SECRET|PASSWORD|SERVICE_ROLE)/m)
    for (const command of ['npm ci', 'py -3.12 -m venv .venv', 'pip install -r requirements.txt', 'npm run dev', 'python.exe -m backend.dev', 'npm test', 'verify-c4-integration.mjs', 'verify-local-http.py']) expect(guide).toContain(command)
    expect(guide).toContain('Preview')
    expect(guide).toContain('Production')
  })
})
