// Mirrors backend/app/models.py. UUID/date/timestamp strings are serialized by Pydantic.
export interface PlanUpsertRequest {
  planningDate: string
  availableFundsCents: number
  safetyBufferCents: number
  fixedEssentialsCents: number
  flexibleEssentialsCents: number
}

export interface PlanResponse extends PlanUpsertRequest {
  id: string
  userId: string
  protectedTotalCents: number
  runwayCents: number
  shortfallCents: number
  createdAt: string
  updatedAt: string
}

export interface PlanEnvelope { plan: PlanResponse }

export interface PurchaseResponse {
  id: string
  planId: string
  userId: string
  name: string
  amountCents: number
  createdAt: string
}

export interface PurchasesEnvelope { purchases: PurchaseResponse[] }

export interface PurchaseConfirmationRequest {
  name: string
  amountCents: number
  idempotencyKey: string
}

export interface PurchaseConfirmationEnvelope {
  purchase: PurchaseResponse
  plan: PlanResponse
  replayed: boolean
}

export interface ErrorEnvelope { error: { code: string; message: string } }
export interface HealthResponse { status: string }
