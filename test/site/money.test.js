import { describe, expect, it } from 'vitest'
import { formatMoney } from '../../src/lib/money.js'

describe('formatMoney', () => {
  it('reads the amount as the smallest currency unit', () => {
    // 1900 is €19.00, not €1900 — every price in the catalog is an integer of cents.
    expect(formatMoney(1900)).toContain('19')
    expect(formatMoney(1900)).not.toContain('1 900')
  })

  it('drops a zero fraction and keeps a non-zero one', () => {
    expect(formatMoney(4900)).not.toContain(',00')
    expect(formatMoney(4955)).toContain('49,55')
  })

  it('takes the currency from the backend value rather than assuming euro', () => {
    expect(formatMoney(1000, 'usd')).not.toEqual(formatMoney(1000, 'eur'))
  })

  it('accepts the currency in either case', () => {
    expect(formatMoney(1000, 'eur')).toBe(formatMoney(1000, 'EUR'))
  })
})
