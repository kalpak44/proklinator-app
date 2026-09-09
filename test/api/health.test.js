import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../../backend/src/app.js'

describe('GET /api/health', () => {
  it('reports the commit the image was built from', async () => {
    const res = await request(createApp({ sha: 'deadbee' })).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true, sha: 'deadbee', stripe: 'missing' })
  })

  it('defaults the sha rather than reporting undefined', async () => {
    const res = await request(createApp()).get('/api/health')

    expect(res.body.sha).toBe('unknown')
  })

  it('reports that Stripe is configured without disclosing anything about the key', async () => {
    const res = await request(createApp({ stripe: {} })).get('/api/health')

    expect(res.body.stripe).toBe('configured')
    // The endpoint is public and unauthenticated. A key, or any prefix of one, must
    // never appear in it — that is a worse bug than a vague health report.
    expect(JSON.stringify(res.body)).not.toMatch(/sk_|pk_/)
  })

  it('does not advertise the framework', async () => {
    const res = await request(createApp()).get('/api/health')

    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})

describe('unknown routes', () => {
  it('answers 404 as JSON, not as express HTML', async () => {
    const res = await request(createApp()).get('/api/nope')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: 'not found' })
  })
})
