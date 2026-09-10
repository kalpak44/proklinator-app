import { describe, expect, it } from 'vitest'
import { readConfig } from '../../backend/src/config.js'

// Placeholders only: a real-looking key must never be committed, even in a test.
const SECRET = 'sk_test_placeholder'
const PUBLISHABLE = 'pk_test_placeholder'

describe('readConfig', () => {
  it('defaults the port and the sha rather than reporting undefined', () => {
    const config = readConfig({})

    expect(config.port).toBe(3000)
    expect(config.sha).toBe('unknown')
  })

  it('reads the port and the commit from the environment', () => {
    const config = readConfig({ PORT: '8080', GIT_SHA: 'deadbee' })

    expect(config.port).toBe(8080)
    expect(config.sha).toBe('deadbee')
  })

  it('falls back to the default port when PORT is not a number', () => {
    expect(readConfig({ PORT: 'not-a-port' }).port).toBe(3000)
  })

  it('falls back to the default port when PORT is zero', () => {
    // Port 0 means "any free port" to the OS, but nothing here should ask for
    // that implicitly — an unset or unusable PORT keeps the documented default.
    expect(readConfig({ PORT: '0' }).port).toBe(3000)
  })

  it('reports Stripe as unconfigured and names both missing keys', () => {
    const config = readConfig({})

    expect(config.stripeConfigured).toBe(false)
    expect(config.missingStripeKeys).toEqual([
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
    ])
  })

  it('names only the key that is missing when half the pair arrived', () => {
    const secretOnly = readConfig({ STRIPE_SECRET_KEY: SECRET })
    expect(secretOnly.stripeConfigured).toBe(false)
    expect(secretOnly.missingStripeKeys).toEqual(['STRIPE_PUBLISHABLE_KEY'])

    const publishableOnly = readConfig({ STRIPE_PUBLISHABLE_KEY: PUBLISHABLE })
    expect(publishableOnly.stripeConfigured).toBe(false)
    expect(publishableOnly.missingStripeKeys).toEqual(['STRIPE_SECRET_KEY'])
  })

  it('reports Stripe as configured once both keys are present', () => {
    const config = readConfig({
      STRIPE_SECRET_KEY: SECRET,
      STRIPE_PUBLISHABLE_KEY: PUBLISHABLE,
    })

    expect(config.stripeConfigured).toBe(true)
    expect(config.missingStripeKeys).toEqual([])
    // Read, not rewritten: the values reach the Stripe client unchanged, and
    // only ever stay on the server.
    expect(config.stripeSecretKey).toBe(SECRET)
    expect(config.stripePublishableKey).toBe(PUBLISHABLE)
  })

  it('reads the process environment when no argument is given', () => {
    // The bootstrap calls it with process.env; the default keeps that call site
    // free of a second source of configuration.
    expect(readConfig().port).toBe(Number(process.env.PORT) || 3000)
  })
})
