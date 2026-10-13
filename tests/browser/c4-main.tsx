// Test-only browser entry: real App/Router/services, fake Auth, and intercepted HTTP.
// No test controls or persisted test session belong to the production entrypoint.
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import App from '../../src/App'
import { AuthProvider } from '../../src/auth/AuthProvider'
import { AuthFailure, type AuthAdapter } from '../../src/auth/authAdapter'
import { createApiClient } from '../../src/services/apiClient'
import { createPlanApi } from '../../src/services/planApi'
import { createPurchaseApi } from '../../src/services/purchaseApi'
import '../../src/index.css'

type Identity = 'A' | 'B' | null
interface TestOptions { restoredUser?: Identity; restoreDelayMs?: number; requestTimeoutMs?: number; authUnavailable?: boolean }
declare global {
  interface Window {
    __C4_OPTIONS__?: TestOptions
    __C4_AUTH__: { emit(user: Identity): void; user(): Identity }
  }
}
const options = window.__C4_OPTIONS__ ?? {}
const storageKey = 'c4-test-only-session'
const stored = sessionStorage.getItem(storageKey)
let identity: Identity = stored === null ? options.restoredUser ?? null : stored === 'A' ? 'A' : stored === 'B' ? 'B' : null
let listener: (value: Session | null) => void = () => {}
let restoring = true
function session(): Session | null {
  if (!identity) return null
  return { access_token: `c4-test-only-bearer-${identity}`, refresh_token: 'c4-test-only-refresh', token_type: 'bearer', expires_in: 3600,
    user: { id: identity === 'A' ? '11111111-1111-4111-8111-111111111111' : '22222222-2222-4222-8222-222222222222',
      aud: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-10-12T00:00:00Z' } }
}
function emit(user: Identity) { identity = user; sessionStorage.setItem(storageKey, user ?? 'anonymous'); listener(session()) }
const adapter: AuthAdapter = {
  async getSession() {
    if (restoring) {
      restoring = false
      await new Promise((resolve) => setTimeout(resolve, options.restoreDelayMs ?? 40))
      if (options.authUnavailable) throw new AuthFailure()
    }
    return session()
  },
  subscribe(callback) { listener = callback; return () => { listener = () => {} } },
  async signIn(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 50))
    if (email === 'invalid@example.invalid' || password !== 'c4-test-only-password') throw new AuthFailure('invalid_credentials')
    emit(email === 'user-b@example.invalid' ? 'B' : 'A')
    const value = session()
    if (!value) throw new AuthFailure('NO_SESSION')
    return value
  },
  async signUp() { return { session: null, confirmationRequired: true } },
  async signOut() { emit(null) },
}
window.__C4_AUTH__ = { emit, user: () => identity }
const client = createApiClient({ getAccessToken: async () => session()?.access_token ?? null,
  baseUrl: '', timeoutMs: options.requestTimeoutMs ?? 15_000 })
const services = { plans: createPlanApi(client), purchases: createPurchaseApi(client) }
createRoot(document.getElementById('root')!).render(<BrowserRouter><AuthProvider adapter={adapter}><App services={services} /></AuthProvider></BrowserRouter>)
