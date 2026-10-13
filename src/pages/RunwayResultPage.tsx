/**
 * @file src/pages/RunwayResultPage.tsx
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P7 — Protect Essentials + Runway Result
 * @createdAt 2026-09-15T23:23:08+10:00
 * @updatedAt 2026-09-16T01:41:11+10:00
 * @summary Derives and presents the validated shared-state runway and protected-shortfall result.
 * @responsibility Owns result presentation and navigation while keeping arithmetic in P5 pure utilities.
 * @integration ASM3 C2 (2026-10-13): real Auth/API state and strict cents boundaries.
 */

import { Navigate, useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import SummaryRow from '../components/ui/SummaryRow'
import type { RunwayState } from '../types/runway'
import type { PlanResponse, PurchaseResponse } from '../types/api'
import { planTotals } from '../state/financialState'
import { parseValidMoney } from '../utils/moneyValidation'

interface RunwayResultPageProps {
  runwayState: RunwayState
  onStartNewPurchase: () => void
  plan: PlanResponse
  pendingProposal: boolean
  history: PurchaseResponse[]
  historyStatus: 'idle' | 'loading' | 'ready' | 'error'
  historyError: string | null
  onLoadHistory: () => Promise<void>
}

function formatAud(value: number) {
  return `AUD ${value.toLocaleString('en-AU', { maximumFractionDigits: 2 })}`
}

function RunwayResultPage({ runwayState, onStartNewPurchase, plan, pendingProposal, history, historyStatus, historyError, onLoadHistory }: RunwayResultPageProps) {
  const navigate = useNavigate()
  const availableFunds = parseValidMoney(runwayState.availableFunds)
  const safetyBuffer = parseValidMoney(runwayState.safetyBuffer)
  const fixedEssentials = parseValidMoney(runwayState.fixedEssentials)
  const flexibleEssentials = parseValidMoney(runwayState.flexibleEssentials)

  if (availableFunds === undefined || safetyBuffer === undefined || !runwayState.planningDate) {
    return <Navigate replace to="/setup" />
  }
  if (fixedEssentials === undefined || flexibleEssentials === undefined) {
    return <Navigate replace to="/essentials" />
  }

  const totals = planTotals(plan)
  const protectedTotal = totals.protectedCents / 100
  const runway = totals.runwayCents / 100
  const protectedShortfall = totals.shortfallCents / 100
  const hasShortfall = protectedShortfall > 0

  return (
    <AppShell>
      <section className="space-y-space-lg">
        <div className="space-y-space-xs">
          <p className="text-label-caps uppercase text-primary">Current runway</p>
          <h1 className="text-h1">Your discretionary runway</h1>
          <p className="text-body-lg text-muted">Based on your saved plan for {runwayState.planningDate}.</p>
        </div>

        {hasShortfall ? (
          <section
            aria-labelledby="shortfall-heading"
            className="space-y-space-xs rounded-card border border-danger bg-surface p-space-md"
            role="alert"
          >
            <h2 className="text-2xl font-semibold text-danger" id="shortfall-heading">
              Protected shortfall
            </h2>
            <p className="text-body-lg text-on-surface">
              Your currently entered protected amounts exceed your available funds by {formatAud(protectedShortfall)}.
            </p>
            <button
              className="inline-flex min-h-control items-center justify-center rounded-button border border-danger px-space-md py-space-xs text-body-lg font-semibold text-danger hover:bg-background focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
              onClick={() => navigate('/essentials')}
              type="button"
            >
              Review protected amounts
            </button>
          </section>
        ) : null}

        <div className="grid gap-space-lg lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <section className="space-y-space-md rounded-card border-l-4 border-primary bg-surface p-space-md shadow-sm">
            <p className="text-label-caps uppercase text-muted">Discretionary runway</p>
            <p className="text-money font-semibold text-on-surface">{formatAud(runway)}</p>
            <p className="text-body-lg text-muted">
              {hasShortfall ? 'Protected amounts currently exceed available funds.' : 'Amount remaining after protected amounts.'}
            </p>
            <button
              className="inline-flex min-h-control w-full items-center justify-center rounded-button bg-primary px-space-md py-space-xs text-body-lg font-semibold text-surface transition-colors hover:bg-primary-pressed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => {
                if (!pendingProposal) onStartNewPurchase()
                navigate(pendingProposal ? '/result' : '/purchase')
              }}
              type="button"
            >
              {pendingProposal ? 'Resolve pending purchase' : 'Check a purchase'}
            </button>
          </section>

          <section className="space-y-space-md rounded-card border border-border bg-surface p-space-md shadow-sm">
            <h2 className="text-2xl font-semibold text-on-surface">Calculation breakdown</h2>
            <div className="divide-y divide-border">
              <SummaryRow label="Available funds" value={formatAud(availableFunds)} />
              <SummaryRow className="pt-space-sm" label="Fixed essentials" value={formatAud(fixedEssentials)} />
              <SummaryRow className="pt-space-sm" label="Flexible essentials" value={formatAud(flexibleEssentials)} />
              <SummaryRow className="pt-space-sm" label="Safety buffer" value={formatAud(safetyBuffer)} />
              <SummaryRow
                className="pt-space-sm"
                emphasis="strong"
                label="Protected total"
                value={formatAud(protectedTotal)}
              />
              <SummaryRow
                className="pt-space-sm"
                emphasis={hasShortfall ? 'danger' : 'strong'}
                label="Discretionary runway"
                supportingText={hasShortfall ? `Protected shortfall: ${formatAud(protectedShortfall)}` : undefined}
                value={formatAud(runway)}
              />
            </div>
            <button
              className="text-body-lg font-semibold text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => navigate('/essentials')}
              type="button"
            >
              Edit protected amounts
            </button>
          </section>
        </div>
        <section className="space-y-space-sm rounded-card border border-border bg-surface p-space-md">
          <h2 className="text-2xl font-semibold">Purchase history</h2>
          <button className="min-h-control text-primary underline disabled:opacity-60" disabled={historyStatus === 'loading'} onClick={() => { void onLoadHistory() }} type="button">
            {historyStatus === 'loading' ? 'Loading history…' : 'Load purchase history'}
          </button>
          {historyError ? <p role="alert" className="text-danger">{historyError}</p> : null}
          {historyStatus === 'ready' && !history.length ? <p>No confirmed purchases yet.</p> : null}
          <ul className="divide-y divide-border">{history.map((purchase) => <li className="break-words py-space-xs" key={purchase.id}>
            <SummaryRow label={purchase.name} value={formatAud(purchase.amountCents / 100)} />
          </li>)}</ul>
        </section>
      </section>
    </AppShell>
  )
}

export default RunwayResultPage
