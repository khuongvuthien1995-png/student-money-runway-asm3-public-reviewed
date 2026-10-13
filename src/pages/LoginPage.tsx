/**
 * @file src/pages/LoginPage.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P10 — Validation + Accessibility + Ethics + Source Hygiene
 * @createdAt 2026-09-15T23:23:08+10:00
 * @updatedAt 2026-09-16T02:20:10+10:00
 * @summary Integrates real Auth sign-in/signup with accessible validation and confirmation feedback.
 * @responsibility Owns credentials in memory and waits for Auth success; App decides the saved-plan route.
 * @integration ASM3 C2 (2026-10-13): real Auth/API state and strict cents boundaries.
 */

import { useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../auth/useAuth'

interface LoginErrors {
  email?: string
  password?: string
}

interface LoginTouched {
  email: boolean
  password: boolean
}

const initialTouched: LoginTouched = { email: false, password: false }

function validateLogin(email: string, password: string): LoginErrors {
  const trimmedEmail = email.trim()
  const errors: LoginErrors = {}

  if (!trimmedEmail) {
    errors.email = 'Enter your email.'
  } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Enter your password.'
  }

  return errors
}

function LoginPage() {
  const auth = useAuth()
  const pending = useRef(false)
  const [signup, setSignup] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState<LoginTouched>(initialTouched)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const errors = validateLogin(email, password)
  const emailError = touched.email || hasSubmitted ? errors.email : undefined
  const passwordError = touched.password || hasSubmitted ? errors.password : undefined

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSubmitted(true)
    setTouched({ email: true, password: true })

    if (pending.current || auth.isPending || Object.keys(errors).length > 0) {
      return
    }

    pending.current = true
    setConfirmation(false)
    try {
      if (signup) {
        const result = await auth.signUp(email.trim(), password)
        setConfirmation(result.confirmationRequired)
      } else await auth.signIn(email.trim(), password)
    } catch { /* AuthProvider exposes a safe error; remain on this form. */ }
    finally { pending.current = false }
  }

  function handleBlur(field: keyof LoginTouched) {
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }))
  }

  return (
    <main className="flex min-h-screen items-start bg-background px-space-md py-space-lg text-on-surface md:items-center md:py-space-xl">
      <section className="mx-auto w-full max-w-xl space-y-space-lg">
        <div className="space-y-space-sm text-center">
          <p className="text-label-caps uppercase text-primary">Student Money Runway</p>
          <h1 className="text-h1">Plan what is available</h1>
          <p className="text-body-lg text-muted">Start a clear plan before your next commitment.</p>
        </div>
        <form className="space-y-space-md rounded-card border border-border bg-surface p-space-md shadow-sm" noValidate onSubmit={handleSubmit}>
          <div className="space-y-space-xs">
            <h2 className="text-2xl font-semibold">{signup ? 'Create account' : 'Sign in'}</h2>
            <p className="text-body-lg text-muted">Sign in securely to save and retrieve your financial plan.</p>
            {auth.error ? <p className="text-danger" role="alert">{auth.error}</p> : null}
            {confirmation ? <p role="status">Check your email and confirm your account before signing in.</p> : null}
          </div>
          <div className="space-y-space-xs">
            <label className="text-label-caps uppercase text-muted" htmlFor="login-email">Email</label>
            <input
              aria-describedby={emailError ? 'login-email-error' : undefined}
              aria-invalid={emailError ? true : undefined}
              autoComplete="email"
              className={`min-h-control w-full rounded-control border bg-surface px-space-sm text-body-lg text-on-surface ${emailError ? 'border-danger' : 'border-border'}`}
              id="login-email"
              disabled={auth.isPending}
              name="email"
              onBlur={() => handleBlur('email')}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
            {emailError ? <p className="text-body-lg text-danger" id="login-email-error" role="alert">{emailError}</p> : null}
          </div>
          <div className="space-y-space-xs">
            <label className="text-label-caps uppercase text-muted" htmlFor="login-password">Password</label>
            <input
              aria-describedby={passwordError ? 'login-password-error' : undefined}
              aria-invalid={passwordError ? true : undefined}
              autoComplete={signup ? 'new-password' : 'current-password'}
              className={`min-h-control w-full rounded-control border bg-surface px-space-sm text-body-lg text-on-surface ${passwordError ? 'border-danger' : 'border-border'}`}
              id="login-password"
              disabled={auth.isPending}
              name="password"
              onBlur={() => handleBlur('password')}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
            {passwordError ? <p className="text-body-lg text-danger" id="login-password-error" role="alert">{passwordError}</p> : null}
          </div>
          <button aria-busy={auth.isPending} disabled={auth.isPending || auth.status === 'error'} className="min-h-control w-full rounded-button bg-primary px-space-md py-space-xs text-body-lg font-semibold text-surface transition-colors hover:bg-primary-pressed disabled:opacity-60" type="submit">
            {auth.isPending ? 'Please wait…' : signup ? 'Create account' : 'Continue'}
          </button>
          <button className="min-h-control w-full text-primary underline" disabled={auth.isPending} onClick={() => { setSignup(!signup); setConfirmation(false) }} type="button">
            {signup ? 'Back to sign in' : 'Create an account'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
