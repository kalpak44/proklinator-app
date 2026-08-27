import { useEffect, useState } from 'react'

/** Backend health endpoint, same origin as the app. */
const HEALTH_URL = '/api/health'

/** How often the backend status is re-checked. */
const POLL_MS = 5000

/**
 * Whether the backend is reachable and healthy.
 *
 * Checks `/api/health` on mount and then every `POLL_MS` milliseconds, so the
 * header dot can flip between green and red as the backend comes and goes
 * without a reload.
 */
export function useApiHealth() {
  const [ok, setOk] = useState(false)

  useEffect(() => {
    let cancelled = false
    let timer

    const check = async () => {
      try {
        const response = await fetch(HEALTH_URL, { cache: 'no-store' })
        const body = await response.json().catch(() => null)
        if (!cancelled) setOk(response.ok && body?.ok === true)
      } catch {
        if (!cancelled) setOk(false)
      }
    }

    check()
    timer = setInterval(check, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return ok
}
