import { createServer } from 'node:net'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'

const ENTRY = fileURLToPath(new URL('../../backend/src/server.js', import.meta.url))

/** A port the OS has just confirmed is free, so a busy runner cannot flake the suite. */
function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer()
    probe.on('error', reject)
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address()
      probe.close(() => resolve(port))
    })
  })
}

let child

/** Start the real entrypoint and wait until it answers, or fail with its output. */
async function boot(env) {
  const port = await freePort()
  let output = ''

  child = spawn(process.execPath, [ENTRY], {
    env: { ...process.env, PORT: String(port), ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', (chunk) => (output += chunk))
  child.stderr.on('data', (chunk) => (output += chunk))

  const deadline = Date.now() + 15_000
  for (;;) {
    if (child.exitCode !== null) throw new Error(`api exited early:\n${output}`)
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/health`)
      if (res.ok) return { port, body: await res.json(), output: () => output }
    } catch {
      // Not listening yet.
    }
    if (Date.now() > deadline) throw new Error(`api never came up:\n${output}`)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

afterEach(async () => {
  if (!child || child.exitCode !== null) return
  child.kill('SIGKILL')
  child = undefined
})

// The entrypoint is exercised as a process rather than imported, because binding the
// port, reading the environment and handling signals are the only things it does — and
// none of them are observable from an import. The container's HEALTHCHECK and its
// rolling update both depend on exactly this behaviour.
describe('the API entrypoint', () => {
  it('listens on PORT and serves the health endpoint', async () => {
    const { body } = await boot({ GIT_SHA: 'abc1234' })

    expect(body).toEqual({ ok: true, sha: 'abc1234', stripe: 'missing' })
  })

  it('starts without Stripe credentials and says which ones are missing', async () => {
    const { output } = await boot({ STRIPE_SECRET_KEY: 'sk_test_only_half' })

    // Serving with checkout disabled beats refusing to start: a missing secret shows up
    // in the health report and in the app, rather than as a deploy that never comes up.
    expect(output()).toContain('STRIPE_PUBLISHABLE_KEY')
  })

  it('reports Stripe as configured once both keys are present', async () => {
    const { body } = await boot({
      STRIPE_SECRET_KEY: 'sk_test_stub',
      STRIPE_PUBLISHABLE_KEY: 'pk_test_stub',
    })

    expect(body.stripe).toBe('configured')
  })

  it('shuts down cleanly on SIGTERM, which is what a rolling update sends', async () => {
    await boot({})

    const exit = new Promise((resolve) => child.once('exit', (code) => resolve(code)))
    child.kill('SIGTERM')

    expect(await exit).toBe(0)
  })
})
