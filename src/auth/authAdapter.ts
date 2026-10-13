import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseClient } from '../lib/supabase'

export class AuthFailure extends Error {
  readonly code: string

  constructor(code = 'AUTH_UNAVAILABLE') {
    const messages: Record<string, string> = {
      invalid_credentials: 'The email or password is incorrect.',
      email_not_confirmed: 'Confirm your email before signing in.',
      weak_password: 'Choose a stronger password.',
      signup_disabled: 'New account registration is unavailable.',
      over_request_rate_limit: 'Too many attempts. Please wait before retrying.',
      over_email_send_rate_limit: 'Verification email sending is rate-limited. Please wait before retrying. Contact the project owner if this continues.',
      email_address_invalid: 'The authentication provider rejected this email address. Check the address or contact the project owner for help.',
      email_address_not_authorized: 'Verification email delivery is unavailable for this address. Contact the project owner for help.',
      AUTH_NOT_READY: 'Authentication is not ready.',
      NO_SESSION: 'Sign-in did not return a session.',
    }
    super(messages[code] ?? 'Authentication is unavailable. Please retry.')
    this.name = 'AuthFailure'
    this.code = code
  }
}

export interface AuthAdapter {
  getSession(): Promise<Session | null>
  subscribe(listener: (session: Session | null) => void): () => void
  signIn(email: string, password: string): Promise<Session>
  signUp(email: string, password: string): Promise<{ session: Session | null; confirmationRequired: boolean }>
  signOut(): Promise<void>
}

export function createAuthAdapter(client: SupabaseClient = getSupabaseClient()): AuthAdapter {
  return {
    async getSession() {
      const { data, error } = await client.auth.getSession()
      if (error) throw new AuthFailure(error.code)
      return data.session
    },
    subscribe(listener) {
      // Keep SDK callbacks synchronous; do not reenter Auth methods while its lock is held.
      const { data } = client.auth.onAuthStateChange((_event, session) => listener(session))
      return () => data.subscription.unsubscribe()
    },
    async signIn(email, password) {
      const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw new AuthFailure(error.code)
      if (!data.session) throw new AuthFailure('NO_SESSION')
      return data.session
    },
    async signUp(email, password) {
      const { data, error } = await client.auth.signUp({ email: email.trim(), password })
      if (error) throw new AuthFailure(error.code)
      return { session: data.session, confirmationRequired: data.session === null }
    },
    async signOut() {
      const { error } = await client.auth.signOut()
      if (error) throw new AuthFailure(error.code)
    },
  }
}
