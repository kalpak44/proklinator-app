import { describe, expect, it } from 'vitest'
import { minUnitAmount } from '../../src/lib/catalog.js'

describe('minUnitAmount', () => {
  it('returns the lowest positive amount, in smallest currency units', () => {
    expect(minUnitAmount([{ unitAmount: 4900 }, { unitAmount: 1900 }])).toBe(1900)
  })

  it('returns null when nothing is priced yet, so the page shows an em dash', () => {
    // The catalog has not loaded, or every option vanished: there is no price to
    // invent, so the caller must be able to tell "no price" from an amount.
    expect(minUnitAmount([])).toBeNull()
    expect(minUnitAmount([{}, { unitAmount: undefined }])).toBeNull()
  })

  it('ignores zero and negative amounts, which are not commerce', () => {
    expect(minUnitAmount([{ unitAmount: 0 }, { unitAmount: -5 }])).toBeNull()
    expect(minUnitAmount([{ unitAmount: 0 }, { unitAmount: 2400 }])).toBe(2400)
  })

  it('ignores options missing altogether, as a ragged catalog may have', () => {
    expect(minUnitAmount([null, undefined, { unitAmount: 1500 }])).toBe(1500)
  })
})
