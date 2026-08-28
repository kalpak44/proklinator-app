import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'proklinator.cart.v1'

/**
 * A cart item references backend entities by their stable ids, nothing else —
 * prices, names and currencies are resolved from the backend catalog at
 * render and at checkout.
 *
 * @typedef {{ curseId: string, optionId: string }} CartItem
 */

/** The cart survives a reload; a corrupt or unknown entry is simply dropped. */
function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        item && typeof item.curseId === 'string' && typeof item.optionId === 'string'
    )
  } catch {
    return []
  }
}

function persist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Private mode or a full quota: the cart just will not survive a reload.
  }
}

/**
 * Cart state, persisted in localStorage. One option per curse, mirroring the
 * book's radio behaviour: choosing another option of the same curse replaces
 * the first, and clicking the selected one removes it. Duplicate entries are
 * therefore impossible — the same curse+option can never appear twice.
 */
export function useCart() {
  const [items, setItems] = useState(readStored)

  useEffect(() => {
    persist(items)
  }, [items])

  const toggle = useCallback((curseId, optionId) => {
    setItems((prev) => {
      if (prev.some((item) => item.curseId === curseId && item.optionId === optionId)) {
        return prev.filter(
          (item) => !(item.curseId === curseId && item.optionId === optionId)
        )
      }
      return [...prev.filter((item) => item.curseId !== curseId), { curseId, optionId }]
    })
  }, [])

  const remove = useCallback((curseId, optionId) => {
    setItems((prev) =>
      prev.filter((item) => !(item.curseId === curseId && item.optionId === optionId))
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const isSelected = useCallback(
    (curseId, optionId) =>
      items.some((item) => item.curseId === curseId && item.optionId === optionId),
    [items]
  )

  return { items, toggle, remove, clear, isSelected }
}
