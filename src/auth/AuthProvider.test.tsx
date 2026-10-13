import { StrictMode } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthProvider'
import { AuthFailure, type AuthAdapter } from './authAdapter'
import { useAuth } from './useAuth'
import { RequireAuth } from './RequireAuth'

const session: Session = {
  access_token: 'test-only-access', refresh_token: 'test-only-refresh', expires_in: 3600, token_type: 'bearer',
  user: { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated',
    app_metadata: {}, user_metadata: {}, created_at: '2026-10-12T00:00:00Z' },
}

function fakeAuth(initial: Session | null = null) {
  let listener: (session: Session | null) => void = () => {}
  const unsubscribe = vi.fn()
  const adapter = {
    getSession: vi.fn().mockResolvedValue(initial),
    subscribe: vi.fn((callback) => { listener = callback; return unsubscribe }),
    signIn: vi.fn().mockResolvedValue(session),
    signUp: vi.fn().mockResolvedValue({ session: null, confirmationRequired: true }),
    signOut: vi.fn().mockResolvedValue(undefined),
  } satisfies AuthAdapter
  return { adapter, unsubscribe, emit: (value: Session | null) => listener(value) }
}

function Probe() {
  const auth = useAuth()
  return <>
    <div data-testid="status">{auth.status}</div>
    <div data-testid="user">{auth.session?.user.id ?? 'none'}</div>
    <div data-testid="error">{auth.error ?? 'none'}</div>
    <button onClick={() => { void auth.signIn('test@example.invalid', 'test-only-password').catch(() => undefined) }}>Login</button>
    <button onClick={() => { void auth.signUp('test@example.invalid', 'test-only-password').catch(() => undefined) }}>Signup</button>
    <button onClick={() => { void auth.signOut().catch(() => undefined) }}>Logout</button>
  </>
}

describe('auth lifecycle with injected test-only adapter', () => {
  it('restores a session, receives refreshed/account-change events and clears on logout', async () => {
    const { adapter, emit } = fakeAuth(session)
    render(<AuthProvider adapter={adapter}><Probe /></AuthProvider>)
    expect(screen.getByTestId('status')).toHaveTextContent('loading')
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('authenticated'))
    act(() => emit({ ...session, access_token: 'test-refreshed', user: { ...session.user, id: '22222222-2222-4222-8222-222222222222' } }))
    expect(screen.getByTestId('user')).toHaveTextContent('22222222-2222-4222-8222-222222222222')
    fireEvent.click(screen.getByText('Logout'))
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('none'))
    expect(adapter.signOut).toHaveBeenCalledTimes(1)
  })
  it('uses real adapter operations for login and signup without inventing a confirmation session', async () => {
    const { adapter } = fakeAuth()
    render(<AuthProvider adapter={adapter}><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('anonymous'))
    fireEvent.click(screen.getByText('Signup'))
    await waitFor(() => expect(adapter.signUp).toHaveBeenCalledTimes(1))
    expect(screen.getByTestId('user')).toHaveTextContent('none')
    fireEvent.click(screen.getByText('Login'))
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent(session.user.id))
    expect(adapter.signIn).toHaveBeenCalledWith('test@example.invalid', 'test-only-password')
  })
  it('renders safe invalid-credential failure and stays anonymous', async () => {
    const { adapter } = fakeAuth()
    adapter.signIn.mockRejectedValue(new AuthFailure('invalid_credentials'))
    render(<AuthProvider adapter={adapter}><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('anonymous'))
    fireEvent.click(screen.getByText('Login'))
    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('email or password is incorrect'))
    expect(screen.getByTestId('user')).toHaveTextContent('none')
  })
  it('does not overwrite a newer signout with a stale restoration result', async () => {
    const { adapter, emit } = fakeAuth()
    let resolve!: (value: Session | null) => void
    adapter.getSession.mockImplementation(() => new Promise((done) => { resolve = done }))
    render(<AuthProvider adapter={adapter}><Probe /></AuthProvider>)
    act(() => emit(null))
    await act(async () => resolve(session))
    expect(screen.getByTestId('status')).toHaveTextContent('anonymous')
    expect(screen.getByTestId('user')).toHaveTextContent('none')
  })
  it('does not overwrite a newer sign-in with a late restoration error', async () => {
    const { adapter, emit } = fakeAuth()
    let reject!: (reason: Error) => void
    adapter.getSession.mockImplementation(() => new Promise((_done, fail) => { reject = fail }))
    render(<AuthProvider adapter={adapter}><Probe /></AuthProvider>)
    act(() => emit(session))
    await act(async () => reject(new Error('private details')))
    expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('error')).toHaveTextContent('none')
  })
  it('unsubscribes correctly across StrictMode cleanup and unmount', async () => {
    const { adapter, unsubscribe } = fakeAuth()
    const view = render(<StrictMode><AuthProvider adapter={adapter}><Probe /></AuthProvider></StrictMode>)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('anonymous'))
    view.unmount()
    expect(unsubscribe).toHaveBeenCalledTimes(adapter.subscribe.mock.calls.length)
  })
  it('fails clearly on missing public configuration without a fallback session', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', '')
    render(<AuthProvider><Probe /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('error'))
    expect(screen.getByTestId('error')).toHaveTextContent('VITE_SUPABASE_URL')
    expect(screen.getByTestId('user')).toHaveTextContent('none')
  })
  it('withholds protected content during restoration, then redirects once to login', async () => {
    const { adapter } = fakeAuth()
    let resolve!: (value: Session | null) => void
    adapter.getSession.mockImplementation(() => new Promise((done) => { resolve = done }))
    render(<MemoryRouter initialEntries={['/runway']}><AuthProvider adapter={adapter}><Routes>
      <Route path="/runway" element={<RequireAuth><div>Private financial content</div></RequireAuth>} />
      <Route path="/login" element={<div>Login destination</div>} />
    </Routes></AuthProvider></MemoryRouter>)
    expect(screen.queryByText('Private financial content')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Restoring')
    await act(async () => resolve(null))
    expect(screen.getByText('Login destination')).toBeInTheDocument()
  })
  it('renders a signed-in guarded child without redirect', async () => {
    const { adapter } = fakeAuth(session)
    render(<MemoryRouter><AuthProvider adapter={adapter}><RequireAuth><div>Guarded content</div></RequireAuth></AuthProvider></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('Guarded content')).toBeInTheDocument())
  })
  it('does not redirect the login route back to itself', async () => {
    const { adapter } = fakeAuth()
    render(<MemoryRouter initialEntries={['/login']}><AuthProvider adapter={adapter}><RequireAuth><div>Private content</div></RequireAuth></AuthProvider></MemoryRouter>)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Sign in to continue.'))
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
  })
})
