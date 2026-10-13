import { describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AuthFailure, createAuthAdapter } from './authAdapter'

describe('SDK delegation with test-only client', () => {
  it.each([
    ['over_email_send_rate_limit', 'Verification email sending is rate-limited.'],
    ['email_address_invalid', 'The authentication provider rejected this email address.'],
    ['email_address_not_authorized', 'Verification email delivery is unavailable for this address.'],
  ])('reports %s without disguising the provider rejection as unavailable Auth', async (code, message) => {
    const auth = { signUp: vi.fn().mockResolvedValue({ data: { session: null }, error: { code, message: 'private provider details' } }) }
    const adapter = createAuthAdapter({ auth } as unknown as SupabaseClient)
    await expect(adapter.signUp('test@example.invalid', 'test-only-password')).rejects.toMatchObject({ code, message: new AuthFailure(code).message })
    expect(new AuthFailure(code).message).toContain(message)
    expect(new AuthFailure(code).message).not.toContain('private provider details')
  })
  it('delegates email/password calls, confirmation state and subscription cleanup', async () => {
    const unsubscribe = vi.fn()
    const auth = {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { session: null }, error: { code: 'email_not_confirmed', message: 'private provider details' } }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe } } }),
    }
    const adapter = createAuthAdapter({ auth } as unknown as SupabaseClient)
    expect(await adapter.getSession()).toBeNull()
    expect(await adapter.signUp(' test@example.invalid ', 'test-only-password')).toEqual({ session: null, confirmationRequired: true })
    expect(auth.signUp).toHaveBeenCalledWith({ email: 'test@example.invalid', password: 'test-only-password' })
    await expect(adapter.signIn('test@example.invalid', 'test-only-password')).rejects.toMatchObject({ code: 'email_not_confirmed', message: 'Confirm your email before signing in.' })
    adapter.subscribe(() => {})()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
    await adapter.signOut()
    expect(auth.signOut).toHaveBeenCalledTimes(1)
  })
})
