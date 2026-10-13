import { describe, expect, it, vi } from 'vitest'
import { createApiClient } from './apiClient'

describe('real transport implementation with test-only fetch doubles', () => {
  it('disables HTTP caching for private financial requests', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => new Response('{}'))
    await createApiClient({ fetchImpl, getAccessToken: async () => 'test-token' }).request('/api/plans/current')
    expect(fetchImpl.mock.calls[0][1]?.cache).toBe('no-store')
  })
  it('injects a freshly acquired bearer without cookie credentials', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(async () => new Response(JSON.stringify({ plan: {} })))
    const token = vi.fn().mockResolvedValueOnce('test-token-a').mockResolvedValueOnce('test-token-b')
    const client = createApiClient({ fetchImpl, getAccessToken: token })
    await client.request('/api/plans/current')
    await client.request('/api/plans/current')
    expect(fetchImpl.mock.calls[0][0]).toBe('/api/plans/current')
    expect(new Headers(fetchImpl.mock.calls[0][1]?.headers).get('Authorization')).toBe('Bearer test-token-a')
    expect(new Headers(fetchImpl.mock.calls[1][1]?.headers).get('Authorization')).toBe('Bearer test-token-b')
    expect(fetchImpl.mock.calls[0][1]?.credentials).toBe('omit')
  })
  it('rejects missing session before any request', async () => {
    const fetchImpl = vi.fn<typeof fetch>()
    const client = createApiClient({ fetchImpl, getAccessToken: async () => null })
    await expect(client.request('/api/plans/current')).rejects.toMatchObject({ status: 401, code: 'UNAUTHENTICATED' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })
  it('reports missing public Auth configuration before contacting the API', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '')
    const fetchImpl = vi.fn<typeof fetch>()
    await expect(createApiClient({ fetchImpl }).request('/api/plans/current'))
      .rejects.toMatchObject({ status: 503, code: 'AUTH_CONFIGURATION_MISSING' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })
  it.each([401, 404, 409, 422, 503])('preserves the backend %s error envelope', async (status) => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(
      JSON.stringify({ error: { code: 'TEST_BACKEND_CODE', message: 'Safe backend message.' } }), { status }))
    const client = createApiClient({ fetchImpl, getAccessToken: async () => 'test-token' })
    await expect(client.request('/api/plans/current')).rejects.toMatchObject({ status, code: 'TEST_BACKEND_CODE', message: 'Safe backend message.' })
  })
  it('normalizes an unavailable proxy response without exposing its HTML', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response('<html>private upstream details</html>', { status: 503 }))
    const client = createApiClient({ fetchImpl, getAccessToken: async () => 'test-token' })
    await expect(client.request('/api/plans/current')).rejects.toMatchObject({ status: 503, code: 'SERVICE_UNAVAILABLE' })
  })
  it('rejects malformed successful JSON instead of manufacturing success', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response('not JSON'))
    const client = createApiClient({ fetchImpl, getAccessToken: async () => 'test-token' })
    await expect(client.request('/api/plans/current')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
  })
  it('normalizes network errors and never retries a mutation', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new Error('sensitive transport details'))
    const client = createApiClient({ fetchImpl, getAccessToken: async () => 'test-token' })
    await expect(client.request('/api/plans/current/purchases', { method: 'POST', body: {} }))
      .rejects.toMatchObject({ code: 'NETWORK_ERROR', message: 'The API could not be reached. Please retry.' })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
  it('times out a hung token lookup without later sending a request', async () => {
    let resolveToken!: (token: string) => void
    const getAccessToken = () => new Promise<string>((resolve) => { resolveToken = resolve })
    const fetchImpl = vi.fn<typeof fetch>()
    const client = createApiClient({ fetchImpl, getAccessToken, timeoutMs: 5 })
    await expect(client.request('/api/plans/current')).rejects.toMatchObject({ code: 'REQUEST_TIMEOUT' })
    resolveToken('test-late-token')
    await Promise.resolve()
    expect(fetchImpl).not.toHaveBeenCalled()
  })
  it('cancels an in-flight request and propagates the signal', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockImplementation(() => new Promise(() => {}))
    const controller = new AbortController()
    const client = createApiClient({ fetchImpl, getAccessToken: async () => 'test-token' })
    const result = client.request('/api/plans/current', { signal: controller.signal })
    const rejected = expect(result).rejects.toMatchObject({ code: 'REQUEST_ABORTED' })
    await Promise.resolve()
    controller.abort()
    await rejected
    expect(fetchImpl.mock.calls[0][1]?.signal?.aborted).toBe(true)
  })
  it('does not attach a token to public health requests', async () => {
    const getAccessToken = vi.fn()
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response('{"status":"ok"}'))
    await createApiClient({ getAccessToken, fetchImpl }).request('/api/health', { authenticated: false })
    expect(getAccessToken).not.toHaveBeenCalled()
    expect(new Headers(fetchImpl.mock.calls[0][1]?.headers).has('Authorization')).toBe(false)
  })
  it('does not start token acquisition for an already cancelled request', async () => {
    const getAccessToken = vi.fn()
    const fetchImpl = vi.fn<typeof fetch>()
    const controller = new AbortController()
    controller.abort()
    await expect(createApiClient({ getAccessToken, fetchImpl }).request('/api/plans/current', { signal: controller.signal }))
      .rejects.toMatchObject({ code: 'REQUEST_ABORTED' })
    expect(getAccessToken).not.toHaveBeenCalled()
    expect(fetchImpl).not.toHaveBeenCalled()
  })
  it('times out stalled response parsing instead of returning success', async () => {
    const response = new Response('{}')
    vi.spyOn(response, 'json').mockImplementation(() => new Promise(() => {}))
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(response)
    await expect(createApiClient({ fetchImpl, getAccessToken: async () => 'test-token', timeoutMs: 5 })
      .request('/api/plans/current')).rejects.toMatchObject({ code: 'REQUEST_TIMEOUT' })
  })
  it.each(['http://localhost:8000', 'https://localhost', 'https://user:pass@example.invalid'])('rejects unsafe production base %s', (baseUrl) => {
    expect(() => createApiClient({ baseUrl })).toThrow('same-origin API or an HTTPS API URL')
  })
})
