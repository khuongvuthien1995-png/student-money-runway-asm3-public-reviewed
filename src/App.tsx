/**
 * @file src/App.tsx
 * @project Student Money Runway — BUS4012 Assignment 02 (extended for Assignment 03)
 * @student Thien Khuong Vu
 * @phase P8 — Purchase Check + Result + Explicit Confirmation (original provenance)
 * @createdAt 2026-09-15T20:49:59+10:00
 * @updatedAt 2026-09-16T01:39:12+10:00
 * @integration ASM3 C2 (2026-10-13): real Auth and FastAPI across the six screens.
 * @summary Composes authenticated routes; financial state belongs to one identity at a time.
 */
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { useAuth } from './auth/useAuth'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/LoginPage'
import ProtectEssentialsPage from './pages/ProtectEssentialsPage'
import PurchaseCheckPage from './pages/PurchaseCheckPage'
import ResultPage from './pages/ResultPage'
import RunwayResultPage from './pages/RunwayResultPage'
import RunwaySetupPage from './pages/RunwaySetupPage'
import { planToDraft } from './state/financialState'
import { financialServices, useFinancialWorkspace, type FinancialServices } from './state/useFinancialWorkspace'

function Workspace({ services }: { services: FinancialServices }) {
  const { expireSession } = useAuth()
  const location = useLocation()
  const state = useFinancialWorkspace(services, expireSession)
  if (state.loadStatus === 'loading' || state.loadStatus === 'error') {
    return <AppShell><section className="space-y-space-md">
      <h1 className="text-h1">Your financial plan</h1>
      {state.loadStatus === 'loading' ? <p role="status">Loading your saved plan…</p> : <>
        <p className="text-danger" role="alert">{state.loadError}</p>
        <button className="min-h-control rounded-button bg-primary px-space-md text-surface" onClick={() => { void state.loadPlan() }}>Retry loading plan</button>
      </>}
    </section></AppShell>
  }
  const { serverPlan, proposal } = state
  const home = serverPlan ? '/runway' : '/setup'
  const savedView = serverPlan ? { ...planToDraft(serverPlan), purchaseName: state.purchaseDraft.name,
    purchaseAmount: state.purchaseDraft.amount, purchaseConfirmed: proposal?.status === 'success' } : state.planDraft
  // An uncertain proposal cannot be edited into a different payload under its existing key.
  if (state.locked && ['/setup', '/essentials'].includes(location.pathname)) return <Navigate replace to="/result" />
  return <Routes>
    <Route path="/login" element={<Navigate replace to={home} />} />
    <Route path="/setup" element={<RunwaySetupPage runwayState={state.planDraft} onRunwayStateChange={state.changePlan} hasSavedPlan={!!serverPlan} />} />
    <Route path="/essentials" element={<ProtectEssentialsPage runwayState={state.planDraft} onRunwayStateChange={state.changePlan}
      onSavePlan={state.savePlan} saving={state.saving} saveError={state.saveError} />} />
    <Route path="/runway" element={serverPlan ? <RunwayResultPage runwayState={savedView} plan={serverPlan}
      onStartNewPurchase={state.startNewPurchase} pendingProposal={state.locked}
      history={state.history} historyStatus={state.historyStatus} historyError={state.historyError} onLoadHistory={state.loadHistory} /> : <Navigate replace to="/setup" />} />
    <Route path="/purchase" element={!serverPlan ? <Navigate replace to="/setup" /> : state.locked ? <Navigate replace to="/result" /> :
      <PurchaseCheckPage runwayState={savedView} plan={serverPlan} onRunwayStateChange={state.changePurchase}
        onStartNewPurchase={state.startNewPurchase} onPreview={state.previewPurchase} />} />
    <Route path="/result" element={!serverPlan ? <Navigate replace to="/setup" /> : proposal ?
      <ResultPage runwayState={savedView} plan={serverPlan} proposal={proposal} onConfirmPurchase={state.confirmPurchase}
        onStartNewPurchase={state.startNewPurchase} onReconcile={state.reconcilePlan} reconciling={state.reconciling} reconcileError={state.reconcileError} /> : <Navigate replace to="/purchase" />} />
    <Route path="*" element={<Navigate replace to={home} />} />
  </Routes>
}

function App({ services = financialServices }: { services?: FinancialServices }) {
  const { session, status } = useAuth()
  if (status === 'loading') return <RequireAuth />
  if (!session) return <Routes><Route path="/login" element={<LoginPage />} /><Route path="*" element={<Navigate replace to="/login" />} /></Routes>
  // Changing identities unmounts every draft, request, history row and proposal immediately.
  return <RequireAuth><Workspace key={session.user.id} services={services} /></RequireAuth>
}

export default App
