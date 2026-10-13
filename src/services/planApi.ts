import type { PlanEnvelope, PlanUpsertRequest } from '../types/api'
import { assertMoneyCents } from '../utils/moneyCents'
import { apiClient, ApiError, type ApiClient, type RequestOptions } from './apiClient'
import { decodePlan } from './apiSchemas'

export function createPlanApi(client: ApiClient = apiClient) {
  return {
    async getCurrent(options?: RequestOptions): Promise<PlanEnvelope> {
      return decodePlan(await client.request('/api/plans/current', options))
    },
    async saveCurrent(request: PlanUpsertRequest, options?: RequestOptions): Promise<PlanEnvelope> {
      const { planningDate, availableFundsCents, safetyBufferCents, fixedEssentialsCents, flexibleEssentialsCents } = request
      for (const amount of [availableFundsCents, safetyBufferCents, fixedEssentialsCents, flexibleEssentialsCents]) assertMoneyCents(amount)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(planningDate) || planningDate.startsWith('0000-') || !Number.isFinite(Date.parse(`${planningDate}T00:00:00Z`)) ||
          new Date(`${planningDate}T00:00:00Z`).toISOString().slice(0, 10) !== planningDate) {
        throw new ApiError(422, 'INVALID_REQUEST', 'Use a valid planning date.')
      }
      return decodePlan(await client.request('/api/plans/current', {
        ...options, method: 'PUT',
        body: { planningDate, availableFundsCents, safetyBufferCents, fixedEssentialsCents, flexibleEssentialsCents },
      }))
    },
  }
}

export const planApi = createPlanApi()
