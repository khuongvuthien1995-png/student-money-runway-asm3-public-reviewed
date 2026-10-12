/**
 * @file src/utils/runwayCalculations.ts
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P5 — State Model + Business Logic
 * @createdAt 2026-09-16T00:01:29+10:00
 * @updatedAt 2026-09-16T00:02:22+10:00
 * @summary Provides deterministic Student Money Runway financial calculations.
 * @responsibility Owns pure runway, protected-total, shortfall, and purchase-impact calculations.
 */

export function calculateProtectedTotal(
  fixedEssentials: number,
  flexibleEssentials: number,
  safetyBuffer: number,
): number {
  return fixedEssentials + flexibleEssentials + safetyBuffer
}

export function calculateRunway(
  availableFunds: number,
  fixedEssentials: number,
  flexibleEssentials: number,
  safetyBuffer: number,
): number {
  return Math.max(0, availableFunds - calculateProtectedTotal(fixedEssentials, flexibleEssentials, safetyBuffer))
}

export function calculateProtectedShortfall(
  availableFunds: number,
  fixedEssentials: number,
  flexibleEssentials: number,
  safetyBuffer: number,
): number {
  return Math.max(0, calculateProtectedTotal(fixedEssentials, flexibleEssentials, safetyBuffer) - availableFunds)
}

export function calculatePurchaseRemaining(currentRunway: number, purchaseAmount: number): number {
  return Math.max(0, currentRunway - purchaseAmount)
}

export function doesPurchaseExceedRunway(currentRunway: number, purchaseAmount: number): boolean {
  return purchaseAmount > currentRunway
}

export function calculatePurchaseExcess(currentRunway: number, purchaseAmount: number): number {
  return Math.max(0, purchaseAmount - currentRunway)
}
