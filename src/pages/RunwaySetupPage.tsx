/**
 * @file src/pages/RunwaySetupPage.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P10 — Validation + Accessibility + Ethics + Source Hygiene
 * @createdAt 2026-09-15T23:23:08+10:00
 * @updatedAt 2026-09-16T02:20:10+10:00
 * @summary Provides the controlled Runway Setup form and baseline field validation.
 * @responsibility Owns setup interaction validation while forwarding source-state changes to App.
 */

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import FormSection from '../components/ui/FormSection'
import MoneyInput from '../components/ui/MoneyInput'
import type { RunwayState } from '../types/runway'
import { validateMoney } from '../utils/moneyValidation'

interface RunwaySetupPageProps {
  runwayState: RunwayState
  onRunwayStateChange: (patch: Partial<RunwayState>) => void
}

interface SetupErrors {
  availableFunds?: string
  planningDate?: string
  safetyBuffer?: string
}

function RunwaySetupPage({ runwayState, onRunwayStateChange }: RunwaySetupPageProps) {
  const navigate = useNavigate()
  const [touched, setTouched] = useState({ availableFunds: false, planningDate: false, safetyBuffer: false })
  const [submitted, setSubmitted] = useState(false)
  const errors: SetupErrors = {
    availableFunds: validateMoney(runwayState.availableFunds, 'Enter your available funds.'),
    planningDate: runwayState.planningDate ? undefined : 'Choose a planning date.',
    safetyBuffer: validateMoney(runwayState.safetyBuffer, 'Enter a safety buffer.'),
  }

  function showError(field: keyof SetupErrors) {
    return submitted || touched[field]
  }

  function updateField(field: keyof RunwayState, value: string) {
    onRunwayStateChange({ [field]: value })
  }

  function markTouched(field: keyof SetupErrors) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (errors.availableFunds || errors.planningDate || errors.safetyBuffer) {
      return
    }
    navigate('/essentials')
  }

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    updateField('planningDate', event.target.value)
  }

  return (
    <main className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-control max-w-content items-center justify-between px-space-md">
          <button className="text-body-lg font-semibold text-primary" onClick={() => navigate('/login')} type="button">
            Back
          </button>
          <p className="text-label-caps uppercase text-muted">Step 1 of 3</p>
        </div>
      </header>
      <section className="mx-auto w-full max-w-content space-y-space-lg px-space-md py-space-lg">
        <div className="space-y-space-xs">
          <p className="text-label-caps uppercase text-primary">Runway setup</p>
          <h1 className="text-h1">Set up your runway</h1>
          <p className="text-body-lg text-muted">Set the money available for this runway and what you want to keep protected.</p>
        </div>
        <div className="grid gap-space-lg lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form className="grid gap-space-md" noValidate onSubmit={handleSubmit}>
            <FormSection
              description="Enter the funds currently available before your planning date."
              title="Funding & timeline"
            >
              <div className="grid gap-space-md">
                <MoneyInput
                  error={showError('availableFunds') ? errors.availableFunds : undefined}
                  helperText="Include the total funds currently available to you."
                  id="setup-available-funds"
                  label="Money available for this runway"
                  onBlur={() => markTouched('availableFunds')}
                  onChange={(value) => updateField('availableFunds', value)}
                  required
                  value={runwayState.availableFunds}
                />
                <div className="space-y-space-xs">
                  <label className="text-label-caps uppercase text-muted" htmlFor="setup-planning-date">
                    Planning date
                  </label>
                  <input
                    aria-describedby={showError('planningDate') && errors.planningDate ? 'setup-planning-date-error' : undefined}
                    aria-invalid={showError('planningDate') && Boolean(errors.planningDate) ? true : undefined}
                    className="min-h-control w-full rounded-control border border-border bg-surface px-space-sm text-body-lg text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    id="setup-planning-date"
                    name="planningDate"
                    onBlur={() => markTouched('planningDate')}
                    onChange={handleDateChange}
                    required
                    type="date"
                    value={runwayState.planningDate}
                  />
                  {showError('planningDate') && errors.planningDate ? (
                    <p className="text-body-lg text-danger" id="setup-planning-date-error" role="alert">
                      {errors.planningDate}
                    </p>
                  ) : null}
                </div>
              </div>
            </FormSection>
            <FormSection description="This amount is protected from discretionary spending calculations." title="Safety buffer">
              <MoneyInput
                error={showError('safetyBuffer') ? errors.safetyBuffer : undefined}
                helperText="Keep an amount aside for unexpected needs."
                id="setup-safety-buffer"
                label="Emergency reserve"
                onBlur={() => markTouched('safetyBuffer')}
                onChange={(value) => updateField('safetyBuffer', value)}
                required
                value={runwayState.safetyBuffer}
              />
            </FormSection>
            <div className="flex flex-col gap-space-sm md:flex-row">
              <button
                className="inline-flex min-h-control items-center justify-center rounded-button bg-primary px-space-md py-space-xs text-body-lg font-semibold text-surface transition-colors hover:bg-primary-pressed"
                type="submit"
              >
                Continue to essentials
              </button>
              <button
                className="inline-flex min-h-control items-center justify-center rounded-button border border-border bg-surface px-space-md py-space-xs text-body-lg font-semibold text-on-surface hover:bg-background"
                onClick={() => navigate('/login')}
                type="button"
              >
                Back to login
              </button>
            </div>
          </form>
          <aside className="space-y-space-sm rounded-card border border-border bg-surface p-space-md shadow-sm">
            <p className="text-label-caps uppercase text-muted">Your setup</p>
            <p className="text-body-lg text-muted">Your entries stay in the current React session while you move through the planning flow.</p>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default RunwaySetupPage
