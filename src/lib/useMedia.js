import { useCallback, useSyncExternalStore } from 'react'

/**
 * Media query subscription. The book needs it: a two-page spread only exists on
 * a wide screen. useSyncExternalStore rather than useEffect, because this is a
 * subscription to an external source and should not cost a render on mount.
 */
export function useMedia(query) {
  const subscribe = useCallback(
    (notify) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', notify)
      return () => mql.removeEventListener('change', notify)
    },
    [query]
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot)
}
