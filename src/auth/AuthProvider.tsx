import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AuthConfigurationError } from '../lib/supabase'
import { AuthFailure, createAuthAdapter, type AuthAdapter } from './authAdapter'
import { AuthContext, type AuthStatus } from './authContext'

function safeAuthMessage(error: unknown): string {
  return error instanceof AuthConfigurationError || error instanceof AuthFailure
    ? error.message
    : 'Authentication is unavailable. Please retry.'
}

export function AuthProvider({ children, adapter }: { children: ReactNode; adapter?: AuthAdapter }) {
  const adapterRef = useRef<AuthAdapter | null>(null)
  const invalidated = useRef(false)
  const [state, setState] = useState<{ session: Session | null; status: AuthStatus; error: string | null }>({
    session: null, status: 'loading', error: null,
  })
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    let active = true
    let eventVersion = 0
    let unsubscribe = () => {}
    async function restore() {
      let restoringVersion = eventVersion
      try {
        const auth = adapter ?? createAuthAdapter()
        adapterRef.current = auth
        unsubscribe = auth.subscribe((session) => {
          eventVersion += 1
          if (active && !invalidated.current) setState({ session, status: session ? 'authenticated' : 'anonymous', error: null })
        })
        restoringVersion = eventVersion
        const session = await auth.getSession()
        // A late restore must not undo a newer logout, account change or token-refresh event.
        if (active && !invalidated.current && restoringVersion === eventVersion) {
          setState({ session, status: session ? 'authenticated' : 'anonymous', error: null })
        }
      } catch (error) {
        if (active && restoringVersion === eventVersion) {
          setState({ session: null, status: 'error', error: safeAuthMessage(error) })
        }
      }
    }
    void restore()
    return () => { active = false; unsubscribe() }
  }, [adapter])

  const perform = useCallback(async <T,>(action: (auth: AuthAdapter) => Promise<T>): Promise<T> => {
    if (!adapterRef.current) throw new AuthFailure('AUTH_NOT_READY')
    setIsPending(true)
    setState((current) => ({ ...current, error: null }))
    try {
      return await action(adapterRef.current)
    } catch (error) {
      setState((current) => ({ ...current, error: safeAuthMessage(error) }))
      throw error instanceof AuthFailure ? error : new AuthFailure()
    } finally {
      setIsPending(false)
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const session = await perform((auth) => auth.signIn(email, password))
    invalidated.current = false
    setState({ session, status: 'authenticated', error: null })
  }, [perform])

  const signUp = useCallback(async (email: string, password: string) => {
    const result = await perform((auth) => auth.signUp(email, password))
    invalidated.current = false
    setState({ session: result.session, status: result.session ? 'authenticated' : 'anonymous', error: null })
    return { confirmationRequired: result.confirmationRequired }
  }, [perform])

  const signOut = useCallback(async () => {
    // Remove private UI immediately, even if remote sign-out is delayed or fails.
    invalidated.current = true
    setState({ session: null, status: 'anonymous', error: null })
    await perform((auth) => auth.signOut())
    setState({ session: null, status: 'anonymous', error: null })
  }, [perform])

  const expireSession = useCallback(() => {
    invalidated.current = true
    setState({ session: null, status: 'anonymous', error: 'Your session expired. Sign in again to continue.' })
    setIsPending(true)
    // Clear SDK storage too. New sign-in is disabled until this cleanup finishes.
    void adapterRef.current?.signOut().catch(() => {}).finally(() => setIsPending(false))
  }, [])

  const getAccessToken = useCallback(async () => {
    if (!adapterRef.current) throw new AuthFailure('AUTH_NOT_READY')
    if (invalidated.current) return null
    return (await adapterRef.current.getSession())?.access_token ?? null
  }, [])

  const value = useMemo(() => ({ ...state, isPending, signIn, signUp, signOut, expireSession, getAccessToken }),
    [state, isPending, signIn, signUp, signOut, expireSession, getAccessToken])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
