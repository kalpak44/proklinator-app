/**
 * Checkout.
 *
 * The frontend sends only the selected ids and the backend does everything
 * else: it validates the items against its own catalog, resolves the
 * backend-owned names, prices and currencies, and creates a one-time Stripe
 * Checkout Session whose `url` the browser is sent to. Nothing commerce-related
 * is ever computed or trusted on the client.
 *
 * The cart is intentionally left alone here — it must survive the round trip
 * to Stripe, whether the reader cancels or the request fails. Only the success
 * page clears it, and only after Stripe has redirected there.
 */
const ENDPOINT = import.meta.env.VITE_CHECKOUT_URL ?? '/api/checkout/session'

/**
 * @param {{ items: Array<{ curseId: string, optionId: string }> }} payload
 * @returns {Promise<{ status: 'redirect' }>} once the browser is navigating to Stripe
 * @throws when the backend refused the cart or could not create a session
 */
export async function startCheckout({ items }) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })

  if (!response.ok) {
    throw new Error(`checkout failed: ${response.status}`)
  }

  const data = await response.json().catch(() => null)
  if (!data?.url) {
    throw new Error('checkout returned no url')
  }

  window.location.assign(data.url)
  return { status: 'redirect' }
}
