import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface PublicAuthConfig {
  url?: string
  publishableKey?: string
}

export class AuthConfigurationError extends Error {
  constructor() {
    super('Set VITE_SUPABASE_URL and a public VITE_SUPABASE_PUBLISHABLE_KEY to enable authentication.')
    this.name = 'AuthConfigurationError'
  }
}

export function createBrowserAuthClient(config: PublicAuthConfig): SupabaseClient {
  const { url, publishableKey } = config
  if (!url || !publishableKey || !publishableKey.startsWith('sb_publishable_')) {
    throw new AuthConfigurationError()
  }
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new AuthConfigurationError()
  } catch {
    throw new AuthConfigurationError()
  }
  return createClient(url, publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
}

let client: SupabaseClient | undefined

// Lazy initialization allows offline builds; missing config never creates a fake session.
export function getSupabaseClient(): SupabaseClient {
  client ??= createBrowserAuthClient({
    url: import.meta.env.VITE_SUPABASE_URL,
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  })
  return client
}
