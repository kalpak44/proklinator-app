import express from 'express'
import Stripe from 'stripe'
import { CURSES } from './catalog.js'

const app = express()

const port = Number(process.env.PORT) || 3000
const sha = process.env.GIT_SHA || 'unknown'

/**
 * Stripe credentials. Environment variables only — never a file in the image, never a
 * build arg, because a build arg ends up in the layer history of a public image.
 *
 * The same two names carry the value everywhere, and only the value differs:
 *
 *   cluster   Vault `proklinator-secrets` -> External Secrets Operator -> the
 *             `proklinator-secrets` Kubernetes Secret -> these variables. Live keys.
 *   CI        the `STRIPE_TEST_*` repository secrets, mapped onto these names in the
 *             workflow env. Test keys, so an agent can exercise checkout without
 *             touching real money.
 *   local     whatever you export in your shell.
 *
 * Nothing in this file branches on which environment it is running in. That is the
 * point: code that switches on NODE_ENV to pick a key is code that can pick the wrong
 * one.
 */
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || ''

const stripeConfigured = Boolean(stripeSecretKey && stripePublishableKey)
const stripe = stripeConfigured ? new Stripe(stripeSecretKey) : null

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
  res.json({ curses: CURSES })
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
    if (!item || typeof item.curseId !== 'string' || typeof item.optionId !== 'string') {
      return res.status(400).json({ error: 'each item needs curseId and optionId' })
    }
    const curse = CURSES.find((c) => c.id === item.curseId)
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

const server = app.listen(port, () => {
  console.log(`proklinator-api listening on ${port} (sha ${sha})`)

  // Warn rather than exit. An unconfigured deploy still serves /api/health and
  // /api/curses, and checkout answers 503 instead of 500, so a missing secret
  // shows up in the health report and in the app — not as a broken deploy.
  if (!stripeConfigured) {
    const missing = [
      stripeSecretKey ? null : 'STRIPE_SECRET_KEY',
      stripePublishableKey ? null : 'STRIPE_PUBLISHABLE_KEY',
    ].filter(Boolean)
    console.warn(`stripe is not configured — missing ${missing.join(' and ')}`)
  }
})

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0))
  })
}
