import { useEffect, useState } from 'react'

/**
 * Size of a single page, tracked live. Pagination depends on it, so the book is
 * measured through a ResizeObserver rather than computed from the viewport.
 *
 * The observer fires once when it starts observing, which is what gives us the
 * initial size without a synchronous setState in the effect body.
 */
export function useBookGeometry(ref, spread) {
  const [geom, setGeom] = useState(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const next = {
        pageW: Math.round(spread ? width / 2 : width),
        pageH: Math.round(height),
      }
      setGeom((prev) =>
        prev && prev.pageW === next.pageW && prev.pageH === next.pageH ? prev : next
      )
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, spread])

  return geom
}
