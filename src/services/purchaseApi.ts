import type { PurchaseConfirmationEnvelope, PurchaseConfirmationRequest, PurchasesEnvelope } from '../types/api'
import { assertMoneyCents } from '../utils/moneyCents'
import { apiClient, ApiError, type ApiClient, type RequestOptions } from './apiClient'
import { decodeConfirmation, decodePurchases } from './apiSchemas'

export function createPurchaseApi(client: ApiClient = apiClient) {
  return {
    async listCurrent(options?: RequestOptions): Promise<PurchasesEnvelope> {
      return decodePurchases(await client.request('/api/plans/current/purchases', options))
    },
    async confirm(request: PurchaseConfirmationRequest, options?: RequestOptions): Promise<PurchaseConfirmationEnvelope> {
      const { name, amountCents, idempotencyKey } = request
      assertMoneyCents(amountCents)
      if (amountCents < 1 || name.length < 1 || name.length > 120 || !name.trim() ||
          !/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(idempotencyKey)) {
        throw new ApiError(422, 'INVALID_REQUEST', 'Use a valid purchase name, amount and confirmation key.')
      }
      // The caller owns proposal identity; no retry, UUID regeneration or local funds deduction here.
      const response = decodeConfirmation(await client.request('/api/plans/current/purchases', {
        ...options, method: 'POST', body: { name, amountCents, idempotencyKey },
      }))
      // A committed response is uncertain until it identifies this exact proposal and plan.
      if (response.purchase.planId !== response.plan.id || response.purchase.userId !== response.plan.userId ||
          response.purchase.name !== name.trim() || response.purchase.amountCents !== amountCents) {
        throw new ApiError(502, 'INVALID_RESPONSE', 'The server returned an invalid purchase confirmation.')
      }
      return response
    },
  }
}

export const purchaseApi = createPurchaseApi()
