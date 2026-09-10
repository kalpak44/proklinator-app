/**
 * The API's configuration, read from the environment.
 *
 * Bootstrap is process wiring a unit test cannot reach: reading the environment,
 * building the Stripe client and listening all happen once, at module scope. This
 * pure function holds the decisions that used to be tangled into that wiring —
 * the port, the reported SHA, which Stripe credentials arrived — so they can be
 * exercised on their own.
 *
 * Stripe credentials come from environment variables — never a file in the image,
 * never a build arg, because a build arg ends up in the layer history of a public
 * image.
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
 * Nothing here branches on which environment it is running in. That is the point:
 * code that switches on NODE_ENV to pick a key is code that can pick the wrong one.
 *
 * @param {object} [env] Environment to read. Defaults to the process environment.
 */
export function readConfig(env = process.env) {
  const port = Number(env.PORT) || 3000
  const sha = env.GIT_SHA || 'unknown'

  const stripeSecretKey = env.STRIPE_SECRET_KEY || ''
  const stripePublishableKey = env.STRIPE_PUBLISHABLE_KEY || ''
  const stripeConfigured = Boolean(stripeSecretKey && stripePublishableKey)

  return {
    port,
    sha,
    stripeSecretKey,
    stripePublishableKey,
    stripeConfigured,
    // Both key names, in a fixed order, so the startup warning can name what is
    // missing without ever printing a value or a prefix of one.
    missingStripeKeys: [
      stripeSecretKey ? null : 'STRIPE_SECRET_KEY',
      stripePublishableKey ? null : 'STRIPE_PUBLISHABLE_KEY',
    ].filter(Boolean),
  }
}
