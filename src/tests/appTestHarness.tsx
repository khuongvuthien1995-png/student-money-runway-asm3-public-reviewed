// Offline test adapters only. Runtime App defaults to the real Auth SDK and FastAPI modules.
import type { Session } from '@supabase/supabase-js'
import { render } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../App'
import { AuthProvider } from '../auth/AuthProvider'
import type { AuthAdapter } from '../auth/authAdapter'
import { createApiClient } from '../services/apiClient'
import { createPlanApi } from '../services/planApi'
import { createPurchaseApi } from '../services/purchaseApi'
import type { PlanResponse, PlanUpsertRequest, PurchaseConfirmationRequest } from '../types/api'
import fixtures from './fixtures/api.json'

export const baseline = fixtures.plan.plan
export const afterPurchase = fixtures.confirmation.plan
export function testSession(id = baseline.userId): Session {
  return { access_token: `test-only-bearer-${id}`, refresh_token: 'test-only-refresh', token_type: 'bearer', expires_in: 3600,
    user: { id, aud: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-10-12T00:00:00Z' } }
}
export function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
export function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }) }
export function failure(status: number, code: string) { return json({ error: { code, message: `Test response ${code}` } }, status) }
export function planWith(request: PlanUpsertRequest): PlanResponse {
  const protectedTotalCents = request.fixedEssentialsCents + request.flexibleEssentialsCents + request.safetyBufferCents
  return { ...baseline, ...request, protectedTotalCents, runwayCents: Math.max(0, request.availableFundsCents - protectedTotalCents),
    shortfallCents: Math.max(0, protectedTotalCents - request.availableFundsCents) }
}

export function appHarness({ initial = testSession(), route = '/login', timeoutMs }: { initial?: Session | null; route?: string; timeoutMs?: number } = {}) {
  let currentSession = initial
  let listener: (session: Session | null) => void = () => {}
  const auth = {
    getSession: vi.fn(async () => currentSession),
    subscribe: vi.fn((callback) => { listener = callback; return () => { listener = () => {} } }),
    signIn: vi.fn(async () => { currentSession = testSession(); return currentSession }),
    signUp: vi.fn(async () => ({ session: null, confirmationRequired: true })),
    signOut: vi.fn(async () => { currentSession = null; listener(null) }),
  } satisfies AuthAdapter
  type QueuedResponse = Response | (() => Promise<Response> | Response)
  const queue = new Map<string, QueuedResponse[]>()
  let savedPlan: PlanResponse = { ...baseline }
  const fetchMock = vi.fn<typeof fetch>(async (input, options) => {
    const method = options?.method ?? 'GET'
    const path = String(input)
    const response = queue.get(`${method} ${path}`)?.shift()
    if (response) return typeof response === 'function' ? response() : response
    if (path.endsWith('/purchases')) {
      if (method === 'GET') return json({ purchases: [] })
      const request: PurchaseConfirmationRequest = JSON.parse(String(options?.body))
      savedPlan = planWith({ ...savedPlan, availableFundsCents: savedPlan.availableFundsCents - request.amountCents })
      return json({ plan: savedPlan, purchase: { ...fixtures.confirmation.purchase,
        name: request.name, amountCents: request.amountCents }, replayed: false }, 201)
    }
    if (method === 'PUT') savedPlan = planWith(JSON.parse(String(options?.body)))
    return json({ plan: savedPlan })
  })
  const client = createApiClient({ fetchImpl: fetchMock, getAccessToken: async () => currentSession?.access_token ?? null, timeoutMs, baseUrl: '' })
  const services = { plans: createPlanApi(client), purchases: createPurchaseApi(client) }
  function RouteProbe() {
    const location = useLocation()
    const navigate = useNavigate()
    return <><div data-testid="route">{location.pathname}</div><button onClick={() => navigate('/result')}>Test direct result</button>
      <button onClick={() => navigate('/runway')}>Test direct runway</button></>
  }
  return {
    auth, fetchMock,
    emit(session: Session | null) { currentSession = session; listener(session) },
    enqueue(method: string, path: string, response: QueuedResponse) {
      const key = `${method} ${path}`
      queue.set(key, [...(queue.get(key) ?? []), response])
    },
    requests(method: string) { return fetchMock.mock.calls.filter(([, options]) => options?.method === method) },
    mount() { return render(<MemoryRouter initialEntries={[route]}><AuthProvider adapter={auth}><App services={services} /><RouteProbe /></AuthProvider></MemoryRouter>) },
  }
}
