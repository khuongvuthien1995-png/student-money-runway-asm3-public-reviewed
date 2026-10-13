/**
 * @file src/utils/moneyValidation.ts
 * @project Student Money Runway — BUS4012 Assignment 02
 * @student Thien Khuong Vu
 * @phase P8 — Purchase Check + Result + Explicit Confirmation
 * @createdAt 2026-09-16T01:17:24+10:00
 * @updatedAt 2026-09-16T01:38:38+10:00
 * @summary Provides the shared raw-text validation and safe conversion contract for AUD inputs.
 * @responsibility Keeps P6 and P7 monetary input rules consistent without owning application state.
 * @integration ASM3 C2 (2026-10-13): real Auth/API state and strict cents boundaries.
 */

import { audToCents } from './moneyCents'

export function validateMoney(value: string, emptyMessage: string): string | undefined {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return emptyMessage
  }
  if (trimmedValue.startsWith('-')) {
    return 'Enter an amount of 0 or more.'
  }
  try { audToCents(trimmedValue) } catch { return 'Enter a valid amount up to AUD 1,000,000 with at most two decimal places.' }
  return undefined
}

export function parseValidMoney(value: string): number | undefined {
  try { return audToCents(value) / 100 } catch { return undefined }
}

// Retained for historical display callers; persisted mutations use integer cents and server responses.
export function formatMoneyInputValue(value: number): string {
  const roundedValue = Math.round((value + Number.EPSILON) * 100) / 100
  return roundedValue.toFixed(2).replace(/\.?0+$/, '')
}
