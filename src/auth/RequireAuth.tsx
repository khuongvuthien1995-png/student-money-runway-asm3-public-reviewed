import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

// Prevent protected content from rendering before Auth restoration or after sign-out.
export function RequireAuth({ children }: { children?: ReactNode }) {
  const { session, status, error } = useAuth()
  const location = useLocation()
  if (status === 'loading') return <p role="status">Restoring your session…</p>
  if (status === 'error') return <p role="alert">{error ?? 'Authentication is unavailable.'}</p>
  if (!session) {
    if (location.pathname === '/login') return <p role="status">Sign in to continue.</p>
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return children ?? <Outlet />
}
