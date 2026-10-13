import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../services/apiClient'
import { planApi } from '../services/planApi'
import { purchaseApi } from '../services/purchaseApi'
import type { PlanResponse, PurchaseConfirmationEnvelope, PurchaseConfirmationRequest, PurchaseResponse } from '../types/api'
import { INITIAL_RUNWAY_STATE, type RunwayStatePatch } from '../types/runway'
import { audToCents, centsToAud } from '../utils/moneyCents'
import { draftToRequest, planToDraft } from './financialState'

export interface FinancialServices { plans: typeof planApi; purchases: typeof purchaseApi }
export const financialServices: FinancialServices = { plans: planApi, purchases: purchaseApi }
export interface Proposal {
  request: Readonly<PurchaseConfirmationRequest>
  status: 'ready' | 'processing' | 'uncertain' | 'error' | 'conflict' | 'success'
  error: string | null
  confirmed?: PurchaseConfirmationEnvelope
}

export function financialError(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please retry.'
  if (error.code === 'PURCHASE_EXCEEDS_RUNWAY') return 'Your saved runway is too low for this purchase. Review the updated amounts or edit the purchase.'
  if (error.code === 'IDEMPOTENCY_KEY_REUSED') return 'This confirmation conflicts with an earlier purchase. Keep this proposal unchanged and reconcile it before trying another purchase.'
  if (error.status === 422) return 'Check your entries and try again. Money must have at most two decimal places.'
  if (error.status === 503) return 'The service is temporarily unavailable. Please retry.'
  if (error.code === 'REQUEST_TIMEOUT' || error.code === 'NETWORK_ERROR') return 'The connection was interrupted. Please retry.'
  return error.message
}

// Mounted once per authenticated identity. Each request also checks its component lifetime.
export function useFinancialWorkspace(services: FinancialServices, expireSession: () => void) {
  const lifetime = useRef<AbortController | null>(null)
  const loadVersion = useRef(0)
  const savingLock = useRef(false)
  const confirmingLock = useRef(false)
  const [serverPlan, setServerPlan] = useState<PlanResponse | null>(null)
  const [planDraft, setPlanDraft] = useState({ ...INITIAL_RUNWAY_STATE })
  const [purchaseDraft, setPurchaseDraft] = useState({ name: '', amount: '' })
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const proposalRef = useRef<Proposal | null>(null)
  const [history, setHistory] = useState<PurchaseResponse[]>([])
  const [historyStatus, setHistoryStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [reconciling, setReconciling] = useState(false)
  const [reconcileError, setReconcileError] = useState<string | null>(null)
  const locked = proposal?.status === 'processing' || proposal?.status === 'uncertain' || proposal?.status === 'conflict'

  function updateProposal(next: Proposal | null) { proposalRef.current = next; setProposal(next) }
  function alive(controller: AbortController | null): controller is AbortController {
    return !!controller && controller === lifetime.current && !controller.signal.aborted
  }
  function unauthorized(error: unknown): boolean {
    if (error instanceof ApiError && error.status === 401) { expireSession(); return true }
    return false
  }

  const loadPlan = useCallback(async () => {
    const controller = lifetime.current
    const version = ++loadVersion.current
    try {
      const { plan } = await services.plans.getCurrent({ signal: controller?.signal })
      if (!controller || controller.signal.aborted || version !== loadVersion.current) return
      setServerPlan(plan); setPlanDraft(planToDraft(plan)); setLoadStatus('ready')
    } catch (error) {
      if (!controller || controller.signal.aborted || version !== loadVersion.current) return
      if (error instanceof ApiError && error.status === 401) { expireSession(); return }
      if (error instanceof ApiError && error.status === 404 && error.code === 'PLAN_NOT_FOUND') {
        setServerPlan(null); setPlanDraft({ ...INITIAL_RUNWAY_STATE }); setLoadStatus('empty')
      } else { setLoadError(financialError(error)); setLoadStatus('error') }
    }
  }, [services, expireSession])

  async function reloadPlan() {
    setLoadStatus('loading'); setLoadError(null)
    await loadPlan()
  }

  useEffect(() => {
    const controller = new AbortController()
    lifetime.current = controller
    void loadPlan()
    return () => controller.abort()
  }, [loadPlan])

  function changePlan(patch: RunwayStatePatch) {
    if (locked || savingLock.current) return
    // Only the five editable plan fields are accepted; drafts cannot supply ownership or confirmation state.
    setPlanDraft((current) => ({ ...current,
      availableFunds: patch.availableFunds ?? current.availableFunds, planningDate: patch.planningDate ?? current.planningDate,
      safetyBuffer: patch.safetyBuffer ?? current.safetyBuffer, fixedEssentials: patch.fixedEssentials ?? current.fixedEssentials,
      flexibleEssentials: patch.flexibleEssentials ?? current.flexibleEssentials }))
  }

  async function savePlan(): Promise<boolean> {
    if (savingLock.current || locked) return false
    const controller = lifetime.current
    savingLock.current = true; setSaving(true); setSaveError(null)
    try {
      const { plan } = await services.plans.saveCurrent(draftToRequest(planDraft), { signal: controller?.signal })
      if (!alive(controller)) return false
      setServerPlan(plan); setPlanDraft(planToDraft(plan)); setLoadStatus('ready')
      return true
    } catch (error) {
      if (alive(controller) && !unauthorized(error)) setSaveError(financialError(error))
      return false
    } finally {
      savingLock.current = false
      if (alive(controller)) setSaving(false)
    }
  }

  function changePurchase(patch: RunwayStatePatch) {
    if (locked || confirmingLock.current) return
    setPurchaseDraft((current) => ({ name: patch.purchaseName ?? current.name, amount: patch.purchaseAmount ?? current.amount }))
  }

  function startNewPurchase() {
    if (locked || confirmingLock.current) return
    setPurchaseDraft({ name: '', amount: '' }); updateProposal(null)
  }

  function previewPurchase(): boolean {
    if (locked || savingLock.current || confirmingLock.current) return false
    const name = purchaseDraft.name.trim()
    let amountCents: number
    try { amountCents = audToCents(purchaseDraft.amount) } catch { return false }
    if (!name || name.length > 120 || amountCents < 1) return false
    const previous = proposalRef.current
    if (previous && previous.status !== 'success' && previous.request.name === name && previous.request.amountCents === amountCents) return true
    // UUID creation belongs to proposal creation, never a render or a retry.
    updateProposal({ request: Object.freeze({ name, amountCents, idempotencyKey: crypto.randomUUID() }), status: 'ready', error: null })
    return true
  }

  async function reconcilePlan() {
    const controller = lifetime.current
    setReconciling(true); setReconcileError(null)
    try {
      const { plan } = await services.plans.getCurrent({ signal: controller?.signal })
      if (alive(controller)) { setServerPlan(plan); setPlanDraft(planToDraft(plan)) }
    } catch (error) {
      if (alive(controller) && !unauthorized(error)) setReconcileError(financialError(error))
    } finally { if (alive(controller)) setReconciling(false) }
  }

  async function confirmPurchase() {
    const original = proposalRef.current
    if (!original || confirmingLock.current || original.status === 'success' || original.status === 'conflict') return
    const controller = lifetime.current
    confirmingLock.current = true
    updateProposal({ ...original, status: 'processing', error: null })
    try {
      const confirmed = await services.purchases.confirm({ ...original.request }, { signal: controller?.signal })
      if (!alive(controller)) return
      // The POST response is the only success path; no local balance deduction.
      setServerPlan(confirmed.plan); setPlanDraft(planToDraft(confirmed.plan))
      setPurchaseDraft({ name: confirmed.purchase.name, amount: centsToAud(confirmed.purchase.amountCents) })
      setHistory((current) => [confirmed.purchase, ...current.filter((p) => p.id !== confirmed.purchase.id)])
      updateProposal({ ...original, status: 'success', error: null, confirmed })
    } catch (error) {
      if (!alive(controller) || unauthorized(error)) return
      if (error instanceof ApiError && error.status === 404 && error.code === 'PLAN_NOT_FOUND') {
        setServerPlan(null); setPlanDraft({ ...INITIAL_RUNWAY_STATE }); setLoadStatus('empty')
        setPurchaseDraft({ name: '', amount: '' }); setHistory([]); updateProposal(null)
        return
      }
      const uncertain = !(error instanceof ApiError) || error.status === 0 || error.status >= 500
      const conflict = error instanceof ApiError && error.code === 'IDEMPOTENCY_KEY_REUSED'
      updateProposal({ ...original, status: conflict ? 'conflict' : uncertain ? 'uncertain' : 'error',
        error: uncertain ? 'The purchase may have been recorded. Keep these details unchanged and retry the same confirmation safely.' : financialError(error) })
      if (error instanceof ApiError && error.code === 'PURCHASE_EXCEEDS_RUNWAY') await reconcilePlan()
    } finally { confirmingLock.current = false }
  }

  async function loadHistory() {
    if (historyStatus === 'loading') return
    const controller = lifetime.current
    setHistoryStatus('loading'); setHistoryError(null)
    try {
      const result = await services.purchases.listCurrent({ signal: controller?.signal })
      if (alive(controller)) { setHistory(result.purchases); setHistoryStatus('ready') }
    } catch (error) {
      if (alive(controller) && !unauthorized(error)) { setHistoryError(financialError(error)); setHistoryStatus('error') }
    }
  }

  return { serverPlan, planDraft, purchaseDraft, loadStatus, loadError, saving, saveError, proposal, locked,
    history, historyStatus, historyError, reconciling, reconcileError,
    loadPlan: reloadPlan, changePlan, savePlan, changePurchase, startNewPurchase, previewPurchase, confirmPurchase, reconcilePlan, loadHistory }
}
