import { useEffect, useRef, useState } from 'react'

/** The curses catalog endpoint, same origin as the app. */
const CATALOG_URL = '/api/curses'

/**
 * Fetches the commerce catalog and turns the array into a lookup keyed by the
 * stable ids the frontend shares with the backend:
 *
 *   catalog.byId[curseId].options[optionId] -> { name, unitAmount, currency }
 *
 * Returns null when the backend is missing or the payload is unparseable.
 */
async function fetchCatalog() {
  const response = await fetch(CATALOG_URL, { cache: 'no-store' })
  if (!response.ok) return null
  const body = await response.json().catch(() => null)
  const curses = body?.curses
  if (!Array.isArray(curses)) return null
  return {
    byId: Object.fromEntries(
      curses.map((curse) => [
        curse.id,
        {
          id: curse.id,
          name: curse.name,
          options: Object.fromEntries(curse.options.map((option) => [option.id, option])),
        },
      ])
    ),
  }
}

/**
 * The commerce catalog, fetched from the backend.
 *
 * The backend is the source of truth for prices, currencies and Stripe-facing
 * names; `available` is false until a catalog has been fetched and parsed, and
 * a missing or unparseable catalog leaves the app showing no prices rather
 * than inventing any.
 *
 * The health poll already tells us when the backend comes back, so the catalog
 * is re-fetched on that transition instead of polling a second endpoint.
 */
export function useCatalog(apiOk) {
  const [catalog, setCatalog] = useState(null)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchCatalog().then((next) => {
      if (cancelled) return
      if (next) {
        setCatalog(next)
        setAvailable(true)
      } else {
        setAvailable(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Track the previous value so the fetch happens on the false -> true
  // transition, not on every poll tick.
  const prevUp = useRef(apiOk)
  useEffect(() => {
    const wasUp = prevUp.current
    prevUp.current = apiOk
    if (!apiOk || wasUp) return

    let cancelled = false
    fetchCatalog().then((next) => {
      if (cancelled) return
      if (next) {
        setCatalog(next)
        setAvailable(true)
      } else {
        setAvailable(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [apiOk])

  return { catalog, available }
}
