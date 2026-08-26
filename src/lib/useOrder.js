import { useCallback, useEffect, useMemo, useState } from 'react'
import { LINE_ITEMS, lineKey } from '../data/book.js'

const STORAGE_KEY = 'proklinator.order.v1'

/** The order survives a reload; a corrupt or unknown key is simply dropped. */
function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((key) => typeof key === 'string' && key in LINE_ITEMS)
  } catch {
    return []
  }
}

function persist(keys) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
  } catch {
    // Private mode or a full quota: the order just will not survive a reload.
  }
}

/**
 * Order state. Tiers within one curse are mutually exclusive: choosing a second
 * tier replaces the first, and clicking the selected one clears it.
 */
export function useOrder() {
  const [keys, setKeys] = useState(readStored)

  useEffect(() => {
    persist(keys)
  }, [keys])

  const toggle = useCallback((chapterId, spellId, tierId) => {
    const key = lineKey(chapterId, spellId, tierId)
    if (!(key in LINE_ITEMS)) return
    setKeys((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key)
      const samePrefix = `${chapterId}/${spellId}/`
      return [...prev.filter((k) => !k.startsWith(samePrefix)), key]
    })
  }, [])

  const remove = useCallback((key) => {
    setKeys((prev) => prev.filter((k) => k !== key))
  }, [])

  const clear = useCallback(() => setKeys([]), [])

  const totals = useMemo(() => {
    const lines = keys.map((key) => LINE_ITEMS[key])
    const dueNow = lines.filter((l) => !l.recurring).reduce((sum, l) => sum + l.price, 0)
    const monthly = lines.filter((l) => l.recurring).reduce((sum, l) => sum + l.price, 0)
    return { lines, dueNow, monthly, count: lines.length }
  }, [keys])

  const isSelected = useCallback(
    (chapterId, spellId, tierId) => keys.includes(lineKey(chapterId, spellId, tierId)),
    [keys]
  )

  return { keys, toggle, remove, clear, totals, isSelected }
}
