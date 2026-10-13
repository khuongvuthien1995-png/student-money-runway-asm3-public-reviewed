import type { PlanEnvelope, PlanResponse, PurchaseConfirmationEnvelope, PurchasesEnvelope, PurchaseResponse } from '../types/api'
import { ApiError } from './apiClient'

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object'
const strings = (value: Record<string, unknown>, names: string[]) => names.every((name) => typeof value[name] === 'string')
const cents = (value: Record<string, unknown>, names: string[]) => names.every((name) =>
  typeof value[name] === 'number' && Number.isSafeInteger(value[name]) && value[name] >= 0)

function isPlan(value: unknown): value is PlanResponse {
  return record(value) && strings(value, ['id', 'userId', 'planningDate', 'createdAt', 'updatedAt']) &&
    cents(value, ['availableFundsCents', 'safetyBufferCents', 'fixedEssentialsCents', 'flexibleEssentialsCents',
      'protectedTotalCents', 'runwayCents', 'shortfallCents'])
}

function isPurchase(value: unknown): value is PurchaseResponse {
  return record(value) && strings(value, ['id', 'planId', 'userId', 'name', 'createdAt']) &&
    cents(value, ['amountCents']) && (value.amountCents as number) > 0
}

function invalid(): never { throw new ApiError(502, 'INVALID_RESPONSE', 'The server returned an invalid financial response.') }

export function decodePlan(value: unknown): PlanEnvelope {
  if (!record(value) || !isPlan(value.plan)) return invalid()
  return { plan: value.plan }
}

export function decodePurchases(value: unknown): PurchasesEnvelope {
  if (!record(value) || !Array.isArray(value.purchases) || !value.purchases.every(isPurchase)) return invalid()
  return { purchases: value.purchases }
}

export function decodeConfirmation(value: unknown): PurchaseConfirmationEnvelope {
  if (!record(value) || !isPlan(value.plan) || !isPurchase(value.purchase) || typeof value.replayed !== 'boolean') return invalid()
  return { plan: value.plan, purchase: value.purchase, replayed: value.replayed }
}
