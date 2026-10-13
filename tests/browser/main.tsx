// Test-only entrypoint, excluded from the production index.html dependency graph.
// Playwright intercepts all /api requests and blocks external network access.
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import App from '../../src/App'
import { AuthProvider } from '../../src/auth/AuthProvider'
import type { AuthAdapter } from '../../src/auth/authAdapter'
import { createApiClient } from '../../src/services/apiClient'
import { createPlanApi } from '../../src/services/planApi'
import { createPurchaseApi } from '../../src/services/purchaseApi'
import '../../src/index.css'

let session: Session | null = null
let listener: (value: Session | null) => void = () => {}
const adapter: AuthAdapter = {
  async getSession() { await new Promise((resolve) => setTimeout(resolve, 100)); return session },
  subscribe(callback) { listener = callback; return () => { listener = () => {} } },
  async signIn() {
    await new Promise((resolve) => setTimeout(resolve, 300))
    session = { access_token: 'test-only-browser-token', refresh_token: 'test-only-browser-refresh', expires_in: 3600, token_type: 'bearer',
      user: { id: '11111111-1111-4111-8111-111111111111', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '2026-10-12T00:00:00Z' } }
    listener(session); return session
  },
  async signUp() { return { session: null, confirmationRequired: true } },
  async signOut() { session = null; listener(null) },
}
const client = createApiClient({ getAccessToken: async () => session?.access_token ?? null, baseUrl: '' })
createRoot(document.getElementById('root')!).render(<MemoryRouter initialEntries={['/login']}>
  <AuthProvider adapter={adapter}><App services={{ plans: createPlanApi(client), purchases: createPurchaseApi(client) }} /></AuthProvider>
</MemoryRouter>)
