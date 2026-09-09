import { describe, expect, it, vi } from 'vitest'
import { startCheckout } from '../../src/lib/checkout.js'
import { stubLocation } from './helpers.js'

function respond(body, ok = true, status = 200) {
  return vi.fn(async () => ({
    ok,
    status,
    json: async () => body,
  }))
}

describe('startCheckout', () => {
  it('posts the selected ids and nothing else', async () => {
    vi.stubGlobal(
      'fetch',
      respond({ url: 'https://checkout.stripe.com/c/pay/cs_test_a1' })
    )
    stubLocation()

    const items = [{ curseId: 'veil', optionId: 'once' }]
    await startCheckout({ items })

    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('/api/checkout/session')
    expect(init.method).toBe('POST')
    // Prices are the backend's to decide. Anything commerce-related sent from here
    // would be a value the server has to ignore, or worse, does not.
    expect(JSON.parse(init.body)).toEqual({ items })
  })

  it('navigates to the Stripe session', async () => {
    vi.stubGlobal(
      'fetch',
      respond({ url: 'https://checkout.stripe.com/c/pay/cs_test_a2' })
    )
    const assign = stubLocation()

    await expect(startCheckout({ items: [] })).resolves.toEqual({ status: 'redirect' })
    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/c/pay/cs_test_a2')
  })

  it('throws with the status when the backend refuses the cart', async () => {
    vi.stubGlobal('fetch', respond({ error: 'unknown curse: invented' }, false, 400))
    const assign = stubLocation()

    await expect(startCheckout({ items: [] })).rejects.toThrow('checkout failed: 400')
    expect(assign).not.toHaveBeenCalled()
  })

  it('throws rather than navigating nowhere when the response carries no url', async () => {
    vi.stubGlobal('fetch', respond({}))
    const assign = stubLocation()

    await expect(startCheckout({ items: [] })).rejects.toThrow('checkout returned no url')
    expect(assign).not.toHaveBeenCalled()
  })

  const refused = [
    ['a host that is not Stripe', 'https://checkout.stripe.com.evil.test/c/pay/x'],
    ['a lookalike host', 'https://checkoutstripe.com/c/pay/x'],
    ['plain http on the right host', 'http://checkout.stripe.com/c/pay/x'],
    ['a javascript: url', 'javascript:alert(1)'],
    ['a relative path', '/c/pay/x'],
  ]

  // The backend is the only thing that sets this url today, and that is a property of
  // the current backend rather than of this function. Navigating anywhere the response
  // asks would be an open redirect on the payment flow.
  it.each(refused)('refuses to navigate to %s', async (_label, url) => {
    vi.stubGlobal('fetch', respond({ url }))
    const assign = stubLocation()

    await expect(startCheckout({ items: [] })).rejects.toThrow(/malformed|outside Stripe/)
    expect(assign).not.toHaveBeenCalled()
  })

  it('treats an unparseable body as no url', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('not json')
        },
      }))
    )

    await expect(startCheckout({ items: [] })).rejects.toThrow('checkout returned no url')
  })
})
