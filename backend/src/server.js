import Stripe from 'stripe'
import { createApp } from './app.js'
import { readConfig } from './config.js'

/**
 * Bootstrap only: read the environment, build the app, listen. Everything worth
 * testing lives in app.js and config.js, which this file must stay thin enough
 * not to hide.
 *
 * Stripe credentials come from environment variables — never a file in the image,
 * never a build arg, because a build arg ends up in the layer history of a public
 * image. The same two names carry the value everywhere and only the value differs;
 * `config.js` reads them without knowing which environment it is running in.
 */
const { port, sha, stripeSecretKey, stripeConfigured, missingStripeKeys } = readConfig(
  process.env
)

const stripe = stripeConfigured ? new Stripe(stripeSecretKey) : null

const server = createApp({ stripe, sha }).listen(port, () => {
  console.log(`proklinator-api listening on ${port} (sha ${sha})`)

  // Warn rather than exit. An unconfigured deploy still serves /api/health and
  // /api/curses, and checkout answers 503 instead of 500, so a missing secret
  // shows up in the health report and in the app — not as a broken deploy.
  if (!stripeConfigured) {
    console.warn(`stripe is not configured — missing ${missingStripeKeys.join(' and ')}`)
  }
})

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0))
  })
}
