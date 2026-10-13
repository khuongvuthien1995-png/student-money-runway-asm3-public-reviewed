// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { resolveConfig } from 'vite'

describe('actual Vite configuration', () => {
  it('proxies API only on the development server', async () => {
    const dev = await resolveConfig({ configFile: 'vite.config.ts', envFile: false, logLevel: 'silent' }, 'serve')
    expect(dev.server.proxy?.['/api']).toMatchObject({ target: 'http://127.0.0.1:8000' })
    const prod = await resolveConfig({ configFile: 'vite.config.ts', envFile: false, logLevel: 'silent' }, 'build')
    expect(prod.server.proxy).toBeUndefined()
    const preview = await resolveConfig({ configFile: 'vite.config.ts', envFile: false, logLevel: 'silent' }, 'serve', 'production', 'production', true)
    expect(preview.server.proxy).toBeUndefined()
  })
})
