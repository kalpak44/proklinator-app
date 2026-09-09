import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../../backend/src/app.js'
import { CURSES, CURRENCY } from '../../backend/src/catalog.js'

describe('GET /api/curses', () => {
  it('serves the catalog', async () => {
    const res = await request(createApp()).get('/api/curses')

    expect(res.status).toBe(200)
    expect(res.body.curses).toEqual(CURSES)
  })
})

describe('the catalog itself', () => {
  it('gives every curse and option a unique id', () => {
    const curseIds = CURSES.map((curse) => curse.id)
    expect(new Set(curseIds).size).toBe(curseIds.length)

    for (const curse of CURSES) {
      const optionIds = curse.options.map((option) => option.id)
      expect(new Set(optionIds).size, `duplicate option id in ${curse.id}`).toBe(
        optionIds.length
      )
    }
  })

  it('prices every option as a positive integer of the smallest currency unit', () => {
    for (const curse of CURSES) {
      expect(curse.options.length).toBeGreaterThan(0)

      for (const option of curse.options) {
        // A float here would reach Stripe as a rejected `unit_amount`, and a zero would
        // be a free line item — which is presentation, never commerce.
        expect(Number.isInteger(option.unitAmount)).toBe(true)
        expect(option.unitAmount).toBeGreaterThan(0)
        expect(option.name.length).toBeGreaterThan(0)
      }
    }
  })

  it('stays single-currency, which is what lets one cart be one Checkout Session', () => {
    const currencies = new Set(
      CURSES.flatMap((curse) => curse.options.map((option) => option.currency))
    )

    expect([...currencies]).toEqual([CURRENCY])
  })
})
