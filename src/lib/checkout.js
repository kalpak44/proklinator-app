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
 * The only host a session URL may send the buyer to. A Stripe Checkout custom domain
 * would have to be added here as well as configured at Stripe.
 */
const CHECKOUT_HOSTS = new Set(['checkout.stripe.com'])

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

  // Navigating to whatever the response says would be an open redirect on a payment
  // flow — the worst place to have one. The URL is our own backend's today, but that
  // is a property of the current backend rather than of this request, and one route
  // that ever echoes input would turn this line into a phishing primitive. The check
  // sits next to the navigation on purpose: the value that reaches the browser is the
  // parsed, allowlisted url rather than the raw response field.
  let sessionUrl
  try {
    sessionUrl = new URL(data.url)
  } catch {
    throw new Error('checkout returned a malformed url')
  }

  if (sessionUrl.protocol !== 'https:' || !CHECKOUT_HOSTS.has(sessionUrl.hostname)) {
    throw new Error(`checkout returned a url outside Stripe: ${sessionUrl.origin}`)
  }

  window.location.assign(sessionUrl.href)
  return { status: 'redirect' }
}
