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
 * would have to be added here as well as configured at Stripe. Checked with `includes`,
 * not `Set.has`: Sonar's taint analysis only reads the array `includes` allowlist shape
 * as clearing the tainted response url before the navigation — the `Set.has` form
 * reopens the open-redirect blocker on code that behaves identically.
 */
const CHECKOUT_HOSTS = ['checkout.stripe.com']

/**
 * Navigating to whatever the response says is an open redirect on a payment flow — the
 * worst place to have one. The URL is our own backend's today, but that is a property of
 * the current backend rather than of this function, and one route that ever echoes input
 * would turn this line into a phishing primitive.
 *
 * The href is re-derived from the parsed URL rather than passed through, so the value
 * that reaches the browser provably came from the check and not from the response.
 */
function stripeCheckoutUrl(value) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error('checkout returned a malformed url')
  }

  if (url.protocol !== 'https:' || !CHECKOUT_HOSTS.includes(url.hostname)) {
    throw new Error(`checkout returned a url outside Stripe: ${url.origin}`)
  }

  return url.href
}

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

  window.location.assign(stripeCheckoutUrl(data.url))
  return { status: 'redirect' }
}
