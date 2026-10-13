import { describe, expect, it, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { createBrowserAuthClient } from './supabase'

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({ auth: {} })) }))

describe('public-only auth initialization', () => {
  it.each([{}, { url: 'https://example.supabase.co' },
    { url: 'https://example.supabase.co', publishableKey: 'sb_secret_test-only' },
    { url: 'invalid', publishableKey: 'sb_publishable_test-only' }])('rejects incomplete/unsafe public config', (config) => {
    expect(() => createBrowserAuthClient(config)).toThrow('VITE_SUPABASE_URL')
    expect(createClient).not.toHaveBeenCalled()
  })
  it('initializes only with supplied public config and session lifecycle enabled', () => {
    createBrowserAuthClient({ url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test-only' })
    expect(createClient).toHaveBeenCalledWith('https://example.supabase.co', 'sb_publishable_test-only', {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  })
})
