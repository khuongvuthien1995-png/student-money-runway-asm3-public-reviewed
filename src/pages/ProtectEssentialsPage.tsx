/**
 * @file src/pages/ProtectEssentialsPage.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P7 — Protect Essentials + Runway Result
 * @createdAt 2026-09-15T23:23:08+10:00
 * @updatedAt 2026-09-16T01:19:05+10:00
 * @summary Provides the controlled protected-essentials form and live protected-total context.
 * @responsibility Validates essential amounts, forwards source-state changes to App, and derives protected summary values.
 */

import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import FormSection from '../components/ui/FormSection'
import MoneyInput from '../components/ui/MoneyInput'
import SummaryRow from '../components/ui/SummaryRow'
import type { RunwayState, RunwayStatePatch } from '../types/runway'
import { calculateProtectedTotal } from '../utils/runwayCalculations'
import { parseValidMoney, validateMoney } from '../utils/moneyValidation'

interface ProtectEssentialsPageProps {
  runwayState: RunwayState
  onRunwayStateChange: (patch: RunwayStatePatch) => void
}

interface EssentialsErrors {
  fixedEssentials?: string
  flexibleEssentials?: string
}

function ProtectEssentialsPage({ runwayState, onRunwayStateChange }: ProtectEssentialsPageProps) {
  const navigate = useNavigate()
  const [touched, setTouched] = useState({ fixedEssentials: false, flexibleEssentials: false })
  const [submitted, setSubmitted] = useState(false)
  const setupIsIncomplete =
    parseValidMoney(runwayState.availableFunds) === undefined ||
    parseValidMoney(runwayState.safetyBuffer) === undefined ||
    !runwayState.planningDate

  if (setupIsIncomplete) {
    return <Navigate replace to="/setup" />
  }

  const errors: EssentialsErrors = {
    fixedEssentials: validateMoney(runwayState.fixedEssentials, 'Enter your fixed essentials.'),
    flexibleEssentials: validateMoney(runwayState.flexibleEssentials, 'Enter your flexible essentials.'),
  }
  const availableFunds = parseValidMoney(runwayState.availableFunds)
  const safetyBuffer = parseValidMoney(runwayState.safetyBuffer)
  const fixedEssentials = parseValidMoney(runwayState.fixedEssentials)
  const flexibleEssentials = parseValidMoney(runwayState.flexibleEssentials)
  const protectedTotal =
    fixedEssentials !== undefined && flexibleEssentials !== undefined && safetyBuffer !== undefined
      ? calculateProtectedTotal(fixedEssentials, flexibleEssentials, safetyBuffer)
      : undefined

  function showError(field: keyof EssentialsErrors) {
    return submitted || touched[field]
  }

  function markTouched(field: keyof EssentialsErrors) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (availableFunds === undefined || safetyBuffer === undefined || errors.fixedEssentials || errors.flexibleEssentials) {
      return
    }
    navigate('/runway')
  }

  return (
    <main className="min-h-screen bg-background text-on-surface">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-control max-w-content items-center justify-between px-space-md">
          <button className="text-body-lg font-semibold text-primary" onClick={() => navigate('/setup')} type="button">
            Back
          </button>
          <p className="text-label-caps uppercase text-muted">Step 2 of 3</p>
        </div>
      </header>
      <section className="mx-auto w-full max-w-content space-y-space-lg px-space-md py-space-lg">
        <div className="max-w-3xl space-y-space-xs">
          <p className="text-label-caps uppercase text-primary">Protect essentials</p>
          <h1 className="text-h1">Protect essentials</h1>
          <p className="text-body-lg text-muted">
            Define the amounts kept for essential costs before your discretionary runway is calculated.
          </p>
        </div>
        <div className="grid gap-space-lg lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form className="grid gap-space-md" noValidate onSubmit={handleSubmit}>
            <FormSection
              description="Include recurring costs such as rent, utilities or phone bills."
              title="Fixed essentials"
            >
              <MoneyInput
                error={showError('fixedEssentials') ? errors.fixedEssentials : undefined}
                helperText="Use the combined amount for this planning period."
                id="essentials-fixed"
                label="Fixed essentials"
                onBlur={() => markTouched('fixedEssentials')}
                onChange={(value) => onRunwayStateChange({ fixedEssentials: value })}
                required
                value={runwayState.fixedEssentials}
              />
            </FormSection>
            <FormSection
              description="Estimate variable necessities such as groceries and transport."
              title="Flexible essentials"
            >
              <MoneyInput
                error={showError('flexibleEssentials') ? errors.flexibleEssentials : undefined}
                helperText="Zero is valid when no flexible allowance is needed."
                id="essentials-flexible"
                label="Flexible essentials"
                onBlur={() => markTouched('flexibleEssentials')}
                onChange={(value) => onRunwayStateChange({ flexibleEssentials: value })}
                required
                value={runwayState.flexibleEssentials}
              />
            </FormSection>
            <div className="flex flex-col gap-space-sm md:flex-row">
              <button
                className="inline-flex min-h-control items-center justify-center rounded-button bg-primary px-space-md py-space-xs text-body-lg font-semibold text-surface transition-colors hover:bg-primary-pressed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                type="submit"
              >
                Calculate my runway
              </button>
              <button
                className="inline-flex min-h-control items-center justify-center rounded-button border border-border bg-surface px-space-md py-space-xs text-body-lg font-semibold text-on-surface hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => navigate('/setup')}
                type="button"
              >
                Back to setup
              </button>
            </div>
          </form>
          <aside className="space-y-space-md rounded-card border border-border bg-surface p-space-md shadow-sm">
            <div className="space-y-space-xs">
              <p className="text-label-caps uppercase text-muted">Protected summary</p>
              <p className="text-body-lg text-muted">These amounts are excluded before discretionary runway is shown.</p>
            </div>
            <div className="divide-y divide-border">
              <SummaryRow label="Safety buffer" value={safetyBuffer === undefined ? 'Not set' : `AUD ${safetyBuffer}`} />
              {protectedTotal !== undefined ? (
                <SummaryRow
                  className="pt-space-sm"
                  emphasis="strong"
                  label="Protected total"
                  value={`AUD ${protectedTotal}`}
                />
              ) : (
                <p className="pt-space-sm text-body-lg text-muted">Enter both essential amounts to see the protected total.</p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default ProtectEssentialsPage
