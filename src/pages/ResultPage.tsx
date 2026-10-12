/**
 * @file src/pages/ResultPage.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P8 — Purchase Check + Result + Explicit Confirmation
 * @createdAt 2026-09-15T23:23:08+10:00
 * @updatedAt 2026-09-16T02:02:58+10:00
 * @summary Presents purchase impact preview states and the confirmed purchase result.
 * @responsibility Derives preview values, exposes eligible confirmation, and renders the updated source-derived runway.
 */

import { Navigate, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import StatusActionButton from '../components/ui/StatusActionButton'
import SummaryRow from '../components/ui/SummaryRow'
import type { RunwayState } from '../types/runway'
import { parseValidMoney } from '../utils/moneyValidation'
import {
  calculatePurchaseExcess,
  calculatePurchaseRemaining,
  calculateRunway,
  doesPurchaseExceedRunway,
} from '../utils/runwayCalculations'

interface ResultPageProps {
  runwayState: RunwayState
  onConfirmPurchase: () => void
  onStartNewPurchase: () => void
}

function formatAud(value: number) {
  return `AUD ${value.toLocaleString('en-AU', { maximumFractionDigits: 2 })}`
}

function ResultPage({ runwayState, onConfirmPurchase, onStartNewPurchase }: ResultPageProps) {
  const navigate = useNavigate()
  const availableFunds = parseValidMoney(runwayState.availableFunds)
  const fixedEssentials = parseValidMoney(runwayState.fixedEssentials)
  const flexibleEssentials = parseValidMoney(runwayState.flexibleEssentials)
  const safetyBuffer = parseValidMoney(runwayState.safetyBuffer)
  const purchaseAmount = parseValidMoney(runwayState.purchaseAmount)

  if (availableFunds === undefined || safetyBuffer === undefined || !runwayState.planningDate) {
    return <Navigate replace to="/setup" />
  }
  if (fixedEssentials === undefined || flexibleEssentials === undefined) {
    return <Navigate replace to="/essentials" />
  }
  if (purchaseAmount === undefined || purchaseAmount <= 0 || !runwayState.purchaseName.trim()) {
    return <Navigate replace to="/purchase" />
  }

  const currentRunway = calculateRunway(
    availableFunds,
    fixedEssentials,
    flexibleEssentials,
    safetyBuffer,
  )

  if (runwayState.purchaseConfirmed) {
    return (
      <AppShell>
        <section className="space-y-space-lg">
          <div className="space-y-space-xs">
            <p className="text-label-caps uppercase text-success">Purchase recorded</p>
            <h1 className="text-h1">Purchase recorded</h1>
            <p className="text-body-lg text-muted">The confirmed purchase is reflected in your updated available funds.</p>
          </div>
          <section className="grid gap-space-lg rounded-card border border-success bg-surface p-space-md shadow-sm lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="space-y-space-md">
              <div>
                <p className="text-label-caps uppercase text-muted">Recorded purchase</p>
                <p className="text-2xl font-semibold text-on-surface">{runwayState.purchaseName}</p>
              </div>
              <SummaryRow label="Purchase amount" value={formatAud(purchaseAmount)} />
              <SummaryRow
                emphasis="positive"
                label="Updated discretionary runway"
                supportingText="This value is derived from the updated available funds."
                value={formatAud(currentRunway)}
              />
            </div>
            <div className="flex flex-col justify-end gap-space-sm">
              <button
                className="inline-flex min-h-control items-center justify-center rounded-button bg-primary px-space-md py-space-xs text-body-lg font-semibold text-surface hover:bg-primary-pressed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => navigate('/runway')}
                type="button"
              >
                View updated runway
              </button>
              <button
                className="inline-flex min-h-control items-center justify-center rounded-button border border-border bg-surface px-space-md py-space-xs text-body-lg font-semibold text-on-surface hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => {
                  onStartNewPurchase()
                  navigate('/purchase')
                }}
                type="button"
              >
                Check another purchase
              </button>
            </div>
          </section>
        </section>
      </AppShell>
    )
  }

  const purchaseExceedsRunway = doesPurchaseExceedRunway(currentRunway, purchaseAmount)
  const remainingRunway = calculatePurchaseRemaining(currentRunway, purchaseAmount)
  const purchaseExcess = calculatePurchaseExcess(currentRunway, purchaseAmount)

  return (
    <AppShell>
      <section className="space-y-space-lg">
        <div className="space-y-space-xs">
          <p className="text-label-caps uppercase text-primary">Purchase impact</p>
          <h1 className="text-h1">Purchase impact preview</h1>
          <p className="text-body-lg text-muted">Review the calculated impact before recording this purchase.</p>
        </div>
        <section
          aria-labelledby="preview-heading"
          className={`space-y-space-md rounded-card border-l-4 bg-surface p-space-md shadow-sm ${purchaseExceedsRunway ? 'border-danger' : 'border-primary'}`}
        >
          <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-start">
            <div>
              <p className="text-label-caps uppercase text-muted">Proposed purchase</p>
              <h2 className="break-words text-2xl font-semibold text-on-surface" id="preview-heading">
                {runwayState.purchaseName}
              </h2>
            </div>
            <p className="text-money font-semibold text-danger">- {formatAud(purchaseAmount)}</p>
          </div>
          <div className="rounded-control border border-border bg-background p-space-md">
            <p className="text-label-caps uppercase text-muted">Runway impact breakdown</p>
            <div className="mt-space-sm divide-y divide-border">
              <SummaryRow label="Runway before" value={formatAud(currentRunway)} />
              <SummaryRow className="pt-space-sm" label="Purchase amount" value={`- ${formatAud(purchaseAmount)}`} />
              {purchaseExceedsRunway ? (
                <SummaryRow
                  className="pt-space-sm"
                  emphasis="danger"
                  label="Amount above runway"
                  value={formatAud(purchaseExcess)}
                />
              ) : (
                <SummaryRow
                  className="pt-space-sm"
                  emphasis="strong"
                  label="Remaining runway"
                  supportingText="This is a preview; recorded funds have not changed."
                  value={formatAud(remainingRunway)}
                />
              )}
            </div>
          </div>
          <div
            className={`rounded-control border p-space-sm text-body-lg ${purchaseExceedsRunway ? 'border-danger text-danger' : 'border-success text-success'}`}
            role="status"
          >
            {purchaseExceedsRunway
              ? `Exceeds your current discretionary runway by ${formatAud(purchaseExcess)}.`
              : `Within your current discretionary runway — ${formatAud(remainingRunway)} would remain.`}
          </div>
        </section>
        <div className="flex flex-col-reverse gap-space-sm border-t border-border pt-space-md md:flex-row md:justify-end">
          <button
            className="inline-flex min-h-control items-center justify-center rounded-button border border-border bg-surface px-space-md py-space-xs text-body-lg font-semibold text-on-surface hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => navigate('/purchase')}
            type="button"
          >
            Back without saving
          </button>
          {purchaseExceedsRunway ? (
            <button
              className="inline-flex min-h-control items-center justify-center rounded-button border border-border bg-surface px-space-md py-space-xs text-body-lg font-semibold text-on-surface hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => navigate('/purchase')}
              type="button"
            >
              Edit purchase
            </button>
          ) : (
            <StatusActionButton onClick={onConfirmPurchase} state="idle" />
          )}
        </div>
      </section>
    </AppShell>
  )
}

export default ResultPage
