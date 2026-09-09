import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../../backend/src/app.js'

const CATALOG = [
  {
    id: 'veil',
    name: 'Серая пелена',
    options: [
      { id: 'once', name: 'Касание', unitAmount: 1900, currency: 'eur' },
      { id: 'week', name: 'Наваждение', unitAmount: 4900, currency: 'eur' },
    ],
  },
  {
    id: 'drift',
    name: 'Снос',
    options: [{ id: 'cycle', name: 'Работа', unitAmount: 8900, currency: 'eur' }],
  },
]

let create
let app

function stripeDouble(impl) {
  create = vi.fn(
    impl ?? (async () => ({ url: 'https://checkout.stripe.com/c/pay/cs_test_a1' }))
  )
  return { checkout: { sessions: { create } } }
}

beforeEach(() => {
  app = createApp({ stripe: stripeDouble(), curses: CATALOG })
})

describe('POST /api/checkout/session without Stripe credentials', () => {
  it('answers 503, which is what the app shows as "payments unavailable"', async () => {
    const res = await request(createApp({ curses: CATALOG }))
      .post('/api/checkout/session')
      .send({ items: [{ curseId: 'veil', optionId: 'once' }] })

    expect(res.status).toBe(503)
    expect(res.body).toEqual({ error: 'stripe not configured' })
  })
})

describe('POST /api/checkout/session request validation', () => {
  const rejected = [
    ['no body at all', undefined],
    ['no items key', {}],
    ['items is not an array', { items: 'veil' }],
    ['items is empty', { items: [] }],
    ['an item is null', { items: [null] }],
    ['curseId is not a string', { items: [{ curseId: 1, optionId: 'once' }] }],
    ['optionId is missing', { items: [{ curseId: 'veil' }] }],
  ]

  it.each(rejected)('rejects %s with a 400', async (_label, body) => {
    const res = await request(app).post('/api/checkout/session').send(body)

    expect(res.status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it('rejects a curse that is not in the catalog', async () => {
    const res = await request(app)
      .post('/api/checkout/session')
      .send({ items: [{ curseId: 'invented', optionId: 'once' }] })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('unknown curse: invented')
    expect(create).not.toHaveBeenCalled()
  })

  it('rejects an option that does not belong to the curse', async () => {
    // 'cycle' exists, but on 'drift'. A cart that pairs it with 'veil' is asking for a
    // price the catalog never offered.
    const res = await request(app)
      .post('/api/checkout/session')
      .send({ items: [{ curseId: 'veil', optionId: 'cycle' }] })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('unknown option: veil/cycle')
    expect(create).not.toHaveBeenCalled()
  })

  it('refuses a cart that spans two currencies', async () => {
    const mixed = [
      CATALOG[0],
      {
        id: 'sterling',
        name: 'Sterling',
        options: [{ id: 'cycle', name: 'Работа', unitAmount: 5000, currency: 'gbp' }],
      },
    ]
    const res = await request(createApp({ stripe: stripeDouble(), curses: mixed }))
      .post('/api/checkout/session')
      .send({
        items: [
          { curseId: 'veil', optionId: 'once' },
          { curseId: 'sterling', optionId: 'cycle' },
        ],
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('items span multiple currencies')
    expect(create).not.toHaveBeenCalled()
  })
})

describe('POST /api/checkout/session session creation', () => {
  it('resolves every commerce value from the catalog, never from the request', async () => {
    const res = await request(app)
      .post('/api/checkout/session')
      .set('Origin', 'https://www.proklinator.online')
      .send({
        items: [
          // Prices and names in the request are noise: the session must be built from
          // the catalog, or a client could reorder at a price it chose itself.
          { curseId: 'veil', optionId: 'week', unitAmount: 1, name: 'Free' },
          { curseId: 'drift', optionId: 'cycle' },
        ],
      })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ url: 'https://checkout.stripe.com/c/pay/cs_test_a1' })

    expect(create).toHaveBeenCalledTimes(1)
    expect(create.mock.calls[0][0]).toEqual({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: 4900,
            product_data: { name: 'Серая пелена — Наваждение' },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: 8900,
            product_data: { name: 'Снос — Работа' },
          },
        },
      ],
      success_url: 'https://www.proklinator.online/success',
      // Not the book's root: a cancelled payment lands on the interrupted-rite page
      // with the cart intact, so retrying starts from the same order sheet.
      cancel_url: 'https://www.proklinator.online/cancelled',
    })
  })

  it('falls back to the Host header when the request carries no Origin', async () => {
    await request(app)
      .post('/api/checkout/session')
      .send({ items: [{ curseId: 'veil', optionId: 'once' }] })

    expect(create.mock.calls[0][0].success_url).toMatch(
      /^http:\/\/127\.0\.0\.1:\d+\/success$/
    )
  })

  it('answers 500 without leaking the Stripe error when the session cannot be created', async () => {
    const boom = new Error('sk_test_51H... is invalid')
    const failing = createApp({
      stripe: stripeDouble(async () => {
        throw boom
      }),
      curses: CATALOG,
    })
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await request(failing)
      .post('/api/checkout/session')
      .send({ items: [{ curseId: 'veil', optionId: 'once' }] })

    expect(res.status).toBe(500)
    expect(res.body).toEqual({ error: 'checkout failed' })
    expect(JSON.stringify(res.body)).not.toContain('sk_test')
    expect(logged).toHaveBeenCalled()

    logged.mockRestore()
  })
})
