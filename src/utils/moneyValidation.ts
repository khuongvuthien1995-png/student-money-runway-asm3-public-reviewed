/**
 * @file src/utils/moneyValidation.ts
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P8 — Purchase Check + Result + Explicit Confirmation
 * @createdAt 2026-09-16T01:17:24+10:00
 * @updatedAt 2026-09-16T01:38:38+10:00
 * @summary Provides the shared raw-text validation and safe conversion contract for AUD inputs.
 * @responsibility Keeps P6 and P7 monetary input rules consistent without owning application state.
 */

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/

export function validateMoney(value: string, emptyMessage: string): string | undefined {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return emptyMessage
  }
  if (trimmedValue.startsWith('-')) {
    return 'Enter an amount of 0 or more.'
  }
  if (!MONEY_PATTERN.test(trimmedValue) || !Number.isFinite(Number(trimmedValue))) {
    return 'Enter a valid amount.'
  }
  return undefined
}

export function parseValidMoney(value: string): number | undefined {
  const trimmedValue = value.trim()
  if (!MONEY_PATTERN.test(trimmedValue)) {
    return undefined
  }
  const parsedValue = Number(trimmedValue)
  return Number.isFinite(parsedValue) ? parsedValue : undefined
}

// Confirmation writes a calculated amount back into raw string state, so round at cents precision first.
export function formatMoneyInputValue(value: number): string {
  const roundedValue = Math.round((value + Number.EPSILON) * 100) / 100
  return roundedValue.toFixed(2).replace(/\.?0+$/, '')
}
