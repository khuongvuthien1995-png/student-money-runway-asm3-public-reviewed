import { describe, expect, it } from 'vitest'
import { audToCents, centsToAud, MoneyCentsError } from './moneyCents'
import { calculateProtectedTotal, calculateRunway, calculateProtectedShortfall } from './runwayCalculations'

describe('exact AUD boundary', () => {
  it.each([['0', 0], ['0.01', 1], ['950.00', 95000], ['1000000', 100000000],
    [' 001.2 ', 120], ['0.29', 29], ['1000000.00', 100000000]])('parses %s exactly', (raw, cents) => {
    expect(audToCents(raw)).toBe(cents)
    expect(audToCents(centsToAud(cents))).toBe(cents)
  })
  it.each(['', ' ', '-1', '-0', '1.999', '1,000', '1 000', '$1', '+1', '1e3', '.01', '1.',
    'NaN', 'Infinity', '1000000.01', '999999999999999999999999999999999'])('rejects %s without rounding', (raw) => {
    expect(() => audToCents(raw)).toThrow(MoneyCentsError)
  })
  it.each([-1, 1.1, NaN, Infinity, 100000001, Number.MAX_SAFE_INTEGER])('rejects invalid cents %s', (cents) => {
    expect(() => centsToAud(cents)).toThrow(MoneyCentsError)
  })
  it('formats integer cents without a floating point boundary', () => {
    expect(centsToAud(1)).toBe('0.01')
    expect(centsToAud(95000)).toBe('950.00')
  })
  it('preserves the existing canonical formulas', () => {
    expect(calculateProtectedTotal(455, 180, 100)).toBe(735)
    expect(calculateRunway(950, 455, 180, 100)).toBe(215)
    expect(calculateProtectedShortfall(650, 454, 180, 100)).toBe(84)
  })
})
