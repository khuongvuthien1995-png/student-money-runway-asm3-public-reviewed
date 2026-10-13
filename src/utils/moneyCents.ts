export const MAX_MONEY_CENTS = 100_000_000

export class MoneyCentsError extends Error {
  readonly code: 'MONEY_REQUIRED' | 'MONEY_FORMAT' | 'MONEY_RANGE' | 'CENTS_INVALID'

  constructor(code: MoneyCentsError['code']) {
    const messages = {
      MONEY_REQUIRED: 'Enter an amount.',
      MONEY_FORMAT: 'Use AUD digits with at most two decimal places.',
      MONEY_RANGE: 'Amount must be between AUD 0 and AUD 1,000,000.',
      CENTS_INVALID: 'Cents must be a nonnegative bounded integer.',
    }
    super(messages[code])
    this.name = 'MoneyCentsError'
    this.code = code
  }
}

export function audToCents(raw: string): number {
  const value = raw.trim()
  if (!value) throw new MoneyCentsError('MONEY_REQUIRED')
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) throw new MoneyCentsError('MONEY_FORMAT')
  const [whole, fraction = ''] = value.split('.')
  // Construct cents from decimal digits; never round an untrusted float.
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'))
  if (cents > BigInt(MAX_MONEY_CENTS)) throw new MoneyCentsError('MONEY_RANGE')
  return Number(cents)
}

export function assertMoneyCents(cents: number): void {
  if (!Number.isSafeInteger(cents) || cents < 0 || cents > MAX_MONEY_CENTS) {
    throw new MoneyCentsError('CENTS_INVALID')
  }
}

export function centsToAud(cents: number): string {
  assertMoneyCents(cents)
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`
}
