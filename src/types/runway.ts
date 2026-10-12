/**
 * @file src/types/runway.ts
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P5 — State Model + Business Logic
 * @createdAt 2026-09-16T00:01:29+10:00
 * @updatedAt 2026-09-16T00:02:22+10:00
 * @summary Defines the shared raw-form session model for a Student Money Runway visit.
 * @responsibility Owns shared state-model types and the initial source-state value.
 */

export interface RunwayState {
  availableFunds: string
  planningDate: string
  safetyBuffer: string
  fixedEssentials: string
  flexibleEssentials: string
  purchaseName: string
  purchaseAmount: string
  purchaseConfirmed: boolean
}

export type RunwayStatePatch = Partial<RunwayState>

// Keep financial fields as raw text so later controlled inputs can represent empty and partial values.
export const INITIAL_RUNWAY_STATE: RunwayState = {
  availableFunds: '',
  planningDate: '',
  safetyBuffer: '',
  fixedEssentials: '',
  flexibleEssentials: '',
  purchaseName: '',
  purchaseAmount: '',
  purchaseConfirmed: false,
}
