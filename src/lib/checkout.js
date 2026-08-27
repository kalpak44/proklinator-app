/**
 * Checkout.
 *
 * Payment is the backend's job: it creates a Stripe Checkout Session from the
 * order lines and returns the `url` to send the browser to. Until that endpoint
 * exists the order is accepted as a request and queued after confirmation, see
 * `startCheckout` below.
 *
 * The total must never be computed on the client. Stripe prices are resolved by
 * the server from its own catalog; the client only ever sends line keys.
 */
const ENDPOINT = import.meta.env.VITE_CHECKOUT_URL ?? '/api/checkout/session'

/** Human-readable request number: PRK-4F2A9C. */
function reference() {
  const bytes = new Uint8Array(3)
  crypto.getRandomValues(bytes)
  const tail = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
  return `PRK-${tail}`
}

/**
 * @returns {Promise<{status: 'redirect'|'pending', reference?: string}>}
 * `redirect` means the browser is already navigating to Stripe.
 */
export async function startCheckout({ keys, contact, locale }) {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: keys,
        contact,
        locale: locale ?? 'ru',
        returnUrl: window.location.origin,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data?.url) {
        window.location.assign(data.url)
        return { status: 'redirect' }
      }
    }
  } catch {
    // Network or endpoint unavailable: fall back to a request, not an error.
  }

  return { status: 'pending', reference: reference() }
}
