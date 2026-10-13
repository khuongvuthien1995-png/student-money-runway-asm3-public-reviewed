import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error'

export interface AuthContextValue {
  session: Session | null
  status: AuthStatus
  error: string | null
  isPending: boolean
  signIn(email: string, password: string): Promise<void>
  signUp(email: string, password: string): Promise<{ confirmationRequired: boolean }>
  signOut(): Promise<void>
  expireSession(): void
  getAccessToken(): Promise<string | null>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
