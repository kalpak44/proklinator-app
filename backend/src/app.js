import express from 'express'
import { CURSES } from './catalog.js'

/**
 * The Express app, separated from the process that runs it.
 *
 * server.js used to call listen() at module scope, so importing this file bound a port
 * and read the environment — which meant the routes below, where every validation and
 * every price resolution lives, could not be exercised by a test at all. Everything the
 * app needs is a parameter with a real default, so a test supplies a fake Stripe and the
 * bootstrap supplies the real one.
 *
 * @param {object}  [deps]
 * @param {object}  [deps.stripe] Stripe client, or null when the keys are absent.
 * @param {string}  [deps.sha]    Commit the image was built from, reported by /api/health.
 * @param {Array}   [deps.curses] Commerce catalog. Injectable so a test can narrow it.
 */
export function createApp({ stripe = null, sha = 'unknown', curses = CURSES } = {}) {
  const app = express()
  const stripeConfigured = Boolean(stripe)

  app.disable('x-powered-by')
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    // Presence, never the value and never a prefix of it. /api/health is public and
    // unauthenticated; a health endpoint that leaks key material is a far worse bug than
    // one that is vague. `stripe` is here so a deploy or a CI run can assert the secrets
    // actually arrived, which is the only thing you cannot check by reading the manifest.
    res.json({ ok: true, sha, stripe: stripeConfigured ? 'configured' : 'missing' })
  })

  /**
   * The curses catalog. Backend-owned commerce data only: ids, names, prices and
   * currencies. The frontend maps its own presentation content onto these ids.
   */
  app.get('/api/curses', (_req, res) => {
    res.json({ curses })
  })

  /**
   * One-time Stripe Checkout Session for a cart.
   *
   * The request carries only the selected ids — `{ items: [{ curseId, optionId }] }` —
   * and every commerce value on the session is resolved here from the catalog:
   * names for the line items, prices, currencies. A client that edits its cart or
   * localStorage can therefore reorder only what the catalog itself offers.
   *
   * Line items are named "{Curse Name} — {Option Name}" with both halves taken from
   * the backend catalog, so the buyer sees exactly what the book sells and never a
   * client-supplied string.
   */
  app.post('/api/checkout/session', async (req, res) => {
    if (!stripeConfigured) {
      // No keys -> no session. A clear 503 beats a Stripe auth error, and it is what
      // the frontend uses to say "payments are unavailable right now".
      return res.status(503).json({ error: 'stripe not configured' })
    }

    const { items } = req.body ?? {}
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' })
    }

    const lines = []
    for (const item of items) {
      if (
        !item ||
        typeof item.curseId !== 'string' ||
        typeof item.optionId !== 'string'
      ) {
        return res.status(400).json({ error: 'each item needs curseId and optionId' })
      }
      const curse = curses.find((c) => c.id === item.curseId)
      if (!curse) {
        return res.status(400).json({ error: `unknown curse: ${item.curseId}` })
      }
      const option = curse.options.find((o) => o.id === item.optionId)
      if (!option) {
        return res
          .status(400)
          .json({ error: `unknown option: ${item.curseId}/${item.optionId}` })
      }
      lines.push({ curse, option })
    }

    // A Checkout Session is single-currency. The catalog is EUR throughout, but the
    // check stays explicit so a mixed-currency catalog cannot silently produce a
    // session Stripe would reject.
    const currencies = new Set(lines.map((line) => line.option.currency))
    if (currencies.size > 1) {
      return res.status(400).json({ error: 'items span multiple currencies' })
    }

    // Redirect URLs are the only thing here that comes from the request: Stripe needs
    // absolute urls, and the API pod does not know the public hostname. Same-origin
    // deployment means the browser's Origin is exactly where it expects to come back.
    const origin = req.headers.origin ?? `http://${req.headers.host}`

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lines.map(({ curse, option }) => ({
          quantity: 1,
          price_data: {
            currency: option.currency,
            unit_amount: option.unitAmount,
            product_data: { name: `${curse.name} — ${option.name}` },
          },
        })),
        // Success lands on the processing page, which clears the cart itself;
        // cancel or abandonment lands on the interrupted-rite page with the cart
        // untouched, so retrying the payment starts from the same order sheet.
        success_url: `${origin}/success`,
        cancel_url: `${origin}/cancelled`,
      })
      res.json({ url: session.url })
    } catch (error) {
      console.error('stripe checkout failed', error)
      res.status(500).json({ error: 'checkout failed' })
    }
  })

  app.use((_req, res) => {
    res.status(404).json({ error: 'not found' })
  })

  return app
}
