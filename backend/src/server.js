import Stripe from 'stripe'
import { createApp } from './app.js'

/**
 * Bootstrap only: read the environment, build the app, listen. Everything worth testing
 * lives in app.js, which this file must stay thin enough not to hide.
 *
 * Stripe credentials come from environment variables — never a file in the image, never
 * a build arg, because a build arg ends up in the layer history of a public image.
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
 * Nothing here branches on which environment it is running in. That is the point: code
 * that switches on NODE_ENV to pick a key is code that can pick the wrong one.
 */
const port = Number(process.env.PORT) || 3000
const sha = process.env.GIT_SHA || 'unknown'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || ''

const stripeConfigured = Boolean(stripeSecretKey && stripePublishableKey)
const stripe = stripeConfigured ? new Stripe(stripeSecretKey) : null

const server = createApp({ stripe, sha }).listen(port, () => {
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
