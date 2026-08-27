import express from 'express'

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

app.disable('x-powered-by')

app.get('/api/health', (_req, res) => {
  // Presence, never the value and never a prefix of it. /api/health is public and
  // unauthenticated; a health endpoint that leaks key material is a far worse bug than
  // one that is vague. `stripe` is here so a deploy or a CI run can assert the secrets
  // actually arrived, which is the only thing you cannot check by reading the manifest.
  res.json({ ok: true, sha, stripe: stripeConfigured ? 'configured' : 'missing' })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'not found' })
})

const server = app.listen(port, () => {
  console.log(`proklinator-api listening on ${port} (sha ${sha})`)

  // Warn rather than exit. There is no checkout route yet, so refusing to start would
  // take /api/health down with it and make a missing secret look like a broken deploy.
  // Once money actually moves through here, this should become a hard failure.
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
