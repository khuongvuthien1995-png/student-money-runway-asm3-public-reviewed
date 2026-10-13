import type { PlanResponse, PlanUpsertRequest } from '../types/api'
import { INITIAL_RUNWAY_STATE, type RunwayState } from '../types/runway'
import { audToCents, centsToAud } from '../utils/moneyCents'

export function planToDraft(plan: PlanResponse): RunwayState {
  return { ...INITIAL_RUNWAY_STATE, planningDate: plan.planningDate,
    availableFunds: centsToAud(plan.availableFundsCents), safetyBuffer: centsToAud(plan.safetyBufferCents),
    fixedEssentials: centsToAud(plan.fixedEssentialsCents), flexibleEssentials: centsToAud(plan.flexibleEssentialsCents) }
}

export function draftToRequest(draft: RunwayState): PlanUpsertRequest {
  return { planningDate: draft.planningDate, availableFundsCents: audToCents(draft.availableFunds),
    safetyBufferCents: audToCents(draft.safetyBuffer), fixedEssentialsCents: audToCents(draft.fixedEssentials),
    flexibleEssentialsCents: audToCents(draft.flexibleEssentials) }
}

export function planTotals(plan: PlanResponse) {
  const protectedCents = plan.fixedEssentialsCents + plan.flexibleEssentialsCents + plan.safetyBufferCents
  return { protectedCents, runwayCents: Math.max(0, plan.availableFundsCents - protectedCents),
    shortfallCents: Math.max(0, protectedCents - plan.availableFundsCents) }
}
