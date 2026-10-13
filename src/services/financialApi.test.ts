import { describe, expect, it, vi } from 'vitest'
import fixture from '../tests/fixtures/api.json'
import { createApiClient } from './apiClient'
import { createPlanApi } from './planApi'
import { createPurchaseApi } from './purchaseApi'

function transport(...responses: unknown[]) {
  const fetchImpl = vi.fn<typeof fetch>()
  for (const body of responses) fetchImpl.mockResolvedValueOnce(new Response(JSON.stringify(body)))
  return { fetchImpl, client: createApiClient({ fetchImpl, getAccessToken: async () => 'test-token' }) }
}

describe('Pydantic plan and purchase contract', () => {
  it('uses exact GET/PUT paths and strips runtime owner injection from writes', async () => {
    const { client, fetchImpl } = transport(fixture.plan, fixture.plan)
    const api = createPlanApi(client)
    expect(await api.getCurrent()).toEqual(fixture.plan)
    expect(await api.saveCurrent({ ...fixture.saveRequest, ...{ userId: 'untrusted' } })).toEqual(fixture.plan)
    expect(fetchImpl.mock.calls.map(([path]) => path)).toEqual(['/api/plans/current', '/api/plans/current'])
    expect(fetchImpl.mock.calls[1][1]?.method).toBe('PUT')
    expect(JSON.parse(fetchImpl.mock.calls[1][1]?.body as string)).toEqual(fixture.saveRequest)
  })
  it('preserves returned authoritative plan and stable proposal key on replay', async () => {
    const replay = { ...fixture.confirmation, replayed: true }
    const { client, fetchImpl } = transport(fixture.confirmation, replay)
    const api = createPurchaseApi(client)
    expect(await api.confirm(fixture.confirmationRequest)).toEqual(fixture.confirmation)
    expect(await api.confirm(fixture.confirmationRequest)).toEqual(replay)
    for (const [path, options] of fetchImpl.mock.calls) {
      expect(path).toBe('/api/plans/current/purchases')
      expect(options?.method).toBe('POST')
      expect(JSON.parse(options?.body as string)).toEqual(fixture.confirmationRequest)
    }
    expect(fixture.confirmation.plan.availableFundsCents).toBe(79000)
  })
  it('lists purchase history through FastAPI only', async () => {
    const body = { purchases: [fixture.confirmation.purchase] }
    const { client, fetchImpl } = transport(body)
    expect(await createPurchaseApi(client).listCurrent()).toEqual(body)
    expect(fetchImpl.mock.calls[0][0]).toBe('/api/plans/current/purchases')
    expect(fetchImpl.mock.calls[0][1]?.method).toBe('GET')
  })
  it.each([
    { planId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee' },
    { userId: '22222222-2222-4222-8222-222222222222' },
    { name: 'Different purchase' },
    { amountCents: 1 },
  ])('rejects a successful replay that changes purchase identity or payload: %j', async (changes) => {
    const body = { ...fixture.confirmation, replayed: true, purchase: { ...fixture.confirmation.purchase, ...changes } }
    const { client, fetchImpl } = transport(body)
    await expect(createPurchaseApi(client).confirm(fixture.confirmationRequest)).rejects.toMatchObject({ status: 502, code: 'INVALID_RESPONSE' })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
  it('accepts the backend-normalized purchase name without changing its sent payload', async () => {
    const { client, fetchImpl } = transport(fixture.confirmation)
    const request = { ...fixture.confirmationRequest, name: ` ${fixture.confirmationRequest.name} ` }
    expect(await createPurchaseApi(client).confirm(request)).toEqual(fixture.confirmation)
    expect(JSON.parse(fetchImpl.mock.calls[0][1]?.body as string)).toEqual(request)
  })
  it('rejects floats, impossible dates and invalid purchases before transport', async () => {
    const { client, fetchImpl } = transport()
    await expect(createPlanApi(client).saveCurrent({ ...fixture.saveRequest, availableFundsCents: 1.2 })).rejects.toThrow()
    await expect(createPlanApi(client).saveCurrent({ ...fixture.saveRequest, planningDate: '2026-02-30' })).rejects.toMatchObject({ code: 'INVALID_REQUEST' })
    await expect(createPlanApi(client).saveCurrent({ ...fixture.saveRequest, planningDate: '0000-01-01' })).rejects.toMatchObject({ code: 'INVALID_REQUEST' })
    await expect(createPurchaseApi(client).confirm({ ...fixture.confirmationRequest, amountCents: 0 })).rejects.toMatchObject({ code: 'INVALID_REQUEST' })
    await expect(createPurchaseApi(client).confirm({ ...fixture.confirmationRequest, idempotencyKey: 'invalid' })).rejects.toMatchObject({ code: 'INVALID_REQUEST' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })
  it('rejects invalid response shapes and fractional cents', async () => {
    const { client } = transport({ plan: null }, { ...fixture.plan, plan: { ...fixture.plan.plan, availableFundsCents: 1.2 } }, { purchases: [{}] })
    const api = createPlanApi(client)
    await expect(api.getCurrent()).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
    await expect(api.getCurrent()).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
    await expect(createPurchaseApi(client).listCurrent()).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
  })
})
