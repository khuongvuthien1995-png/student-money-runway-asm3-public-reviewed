/**
 * @file src/pages/PurchaseCheckPage.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P10 — Validation + Accessibility + Ethics + Source Hygiene
 * @createdAt 2026-09-15T23:23:08+10:00
 * @updatedAt 2026-09-16T02:20:23+10:00
 * @summary Provides the controlled purchase draft form and current-runway context.
 * @responsibility Validates purchase input, forwards draft changes to App, and navigates to a non-mutating preview.
 */

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import FormSection from '../components/ui/FormSection'
import MoneyInput from '../components/ui/MoneyInput'
import SummaryRow from '../components/ui/SummaryRow'
import type { RunwayState, RunwayStatePatch } from '../types/runway'
import { parseValidMoney, validateMoney } from '../utils/moneyValidation'
import { calculateRunway } from '../utils/runwayCalculations'

interface PurchaseCheckPageProps {
  runwayState: RunwayState
  onRunwayStateChange: (patch: RunwayStatePatch) => void
  onStartNewPurchase: () => void
}

interface PurchaseErrors {
  purchaseName?: string
  purchaseAmount?: string
}

function PurchaseCheckPage({ runwayState, onRunwayStateChange, onStartNewPurchase }: PurchaseCheckPageProps) {
  const navigate = useNavigate()
  const [touched, setTouched] = useState({ purchaseName: false, purchaseAmount: false })
  const [submitted, setSubmitted] = useState(false)
  const availableFunds = parseValidMoney(runwayState.availableFunds)
  const fixedEssentials = parseValidMoney(runwayState.fixedEssentials)
  const flexibleEssentials = parseValidMoney(runwayState.flexibleEssentials)
  const safetyBuffer = parseValidMoney(runwayState.safetyBuffer)

  if (availableFunds === undefined || safetyBuffer === undefined || !runwayState.planningDate) {
    return <Navigate replace to="/setup" />
  }
  if (fixedEssentials === undefined || flexibleEssentials === undefined) {
    return <Navigate replace to="/essentials" />
  }

  const currentRunway = calculateRunway(
    availableFunds,
    fixedEssentials,
    flexibleEssentials,
    safetyBuffer,
  )
  const amountContractError = validateMoney(runwayState.purchaseAmount, 'Enter a purchase amount.')
  const purchaseAmount = parseValidMoney(runwayState.purchaseAmount)
  const errors: PurchaseErrors = {
    purchaseName: runwayState.purchaseName.trim() ? undefined : 'Enter a purchase name.',
    purchaseAmount:
      amountContractError ??
      (purchaseAmount === 0 ? 'Enter an amount greater than 0.' : undefined),
  }

  function showError(field: keyof PurchaseErrors) {
    return submitted || touched[field]
  }

  function markTouched(field: keyof PurchaseErrors) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    onRunwayStateChange({ purchaseName: event.target.value })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (errors.purchaseName || errors.purchaseAmount || purchaseAmount === undefined || purchaseAmount <= 0) {
      return
    }
    navigate('/result')
  }

  if (runwayState.purchaseConfirmed) {
    return (
      <AppShell>
        <section className="mx-auto max-w-3xl space-y-space-lg">
          <div className="space-y-space-xs">
            <p className="text-label-caps uppercase text-primary">Check a purchase</p>
            <h1 className="text-h1">Purchase recorded</h1>
            <p className="text-body-lg text-muted">Start a new purchase check using the updated runway.</p>
          </div>
          <section className="space-y-space-md rounded-card border border-border bg-surface p-space-md shadow-sm">
            <SummaryRow label="Recorded purchase" value={runwayState.purchaseName} />
            <SummaryRow label="Updated runway" value={`AUD ${currentRunway}`} />
            <button
              className="inline-flex min-h-control w-full items-center justify-center rounded-button bg-primary px-space-md py-space-xs text-body-lg font-semibold text-surface hover:bg-primary-pressed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => {
                onStartNewPurchase()
              }}
              type="button"
            >
              Check another purchase
            </button>
          </section>
        </section>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <section className="space-y-space-lg">
        <div className="space-y-space-xs">
          <p className="text-label-caps uppercase text-primary">Check a purchase</p>
          <h1 className="text-h1">Check a purchase</h1>
          <p className="text-body-lg text-muted">Preview how a proposed expense may affect your runway.</p>
        </div>
        <div className="grid gap-space-lg lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <form className="grid gap-space-md" noValidate onSubmit={handleSubmit}>
            <FormSection description="Enter the details for a purchase you want to preview." title="Proposed purchase">
              <div className="grid gap-space-md">
                <div className="space-y-space-xs">
                  <label className="text-label-caps uppercase text-muted" htmlFor="purchase-name">
                    Purchase name
                  </label>
                  <input
                    aria-describedby={showError('purchaseName') && errors.purchaseName ? 'purchase-name-error' : undefined}
                    aria-invalid={showError('purchaseName') && Boolean(errors.purchaseName) ? true : undefined}
                    className="min-h-control w-full rounded-control border border-border bg-surface px-space-sm text-body-lg text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    id="purchase-name"
                    name="purchaseName"
                    onBlur={() => markTouched('purchaseName')}
                    onChange={handleNameChange}
                    required
                    type="text"
                    value={runwayState.purchaseName}
                  />
                  {showError('purchaseName') && errors.purchaseName ? (
                    <p className="text-body-lg text-danger" id="purchase-name-error" role="alert">
                      {errors.purchaseName}
                    </p>
                  ) : null}
                </div>
                <MoneyInput
                  error={showError('purchaseAmount') ? errors.purchaseAmount : undefined}
                  helperText="Enter a positive amount to preview."
                  id="purchase-amount"
                  label="Purchase amount"
                  onBlur={() => markTouched('purchaseAmount')}
                  onChange={(value) => onRunwayStateChange({ purchaseAmount: value })}
                  required
                  value={runwayState.purchaseAmount}
                />
              </div>
            </FormSection>
            <div className="space-y-space-sm rounded-control border border-border bg-background p-space-sm">
              <p className="text-label-caps uppercase text-primary">Preview only</p>
              <p className="text-body-lg text-muted">This preview does not change your recorded available funds.</p>
            </div>
            <div className="flex flex-col gap-space-sm md:flex-row">
              <button
                className="inline-flex min-h-control flex-1 items-center justify-center rounded-button bg-primary px-space-md py-space-xs text-body-lg font-semibold text-surface hover:bg-primary-pressed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                type="submit"
              >
                Preview impact
              </button>
              <Link
                className="inline-flex min-h-control flex-1 items-center justify-center rounded-button border border-border bg-surface px-space-md py-space-xs text-body-lg font-semibold text-on-surface hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                to="/runway"
              >
                Back to runway
              </Link>
            </div>
          </form>
          <aside className="space-y-space-sm rounded-card border-l-4 border-primary bg-surface p-space-md shadow-sm">
            <p className="text-label-caps uppercase text-muted">Current discretionary runway</p>
            <p className="text-money font-semibold text-on-surface">AUD {currentRunway}</p>
            <p className="text-body-lg text-muted">This amount is calculated from your current protected values.</p>
            <SummaryRow label="Planning date" value={runwayState.planningDate} />
          </aside>
        </div>
      </section>
    </AppShell>
  )
}

export default PurchaseCheckPage
