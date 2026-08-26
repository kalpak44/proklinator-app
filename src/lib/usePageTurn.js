import { useCallback, useEffect, useState } from 'react'
import { useMedia } from './useMedia.js'
import { playPageTurn } from './pageSound.js'

export const TURN_MS = 900

/**
 * Page-turn state. It lives above the book because three things turn pages:
 * the bookmarks, the arrows under the book, and the keyboard.
 *
 * While a leaf is in the air further turns are ignored, otherwise rapid clicks
 * on the bookmarks leave the animation and the content on different chapters.
 */
export function usePageTurn(count, index, setIndex) {
  const [turning, setTurning] = useState(null)
  const reduced = useMedia('(prefers-reduced-motion: reduce)')

  const goTo = useCallback(
    (next) => {
      if (turning || next === index || next < 0 || next >= count) return
      if (reduced) {
        setIndex(next)
        return
      }
      playPageTurn()
      setTurning({ from: index, to: next, dir: next > index ? 'next' : 'prev' })
    },
    [turning, index, count, reduced, setIndex]
  )

  // The turn always plays out in full, then the state moves to the new chapter.
  useEffect(() => {
    if (!turning) return
    const timer = setTimeout(() => {
      setIndex(turning.to)
      setTurning(null)
    }, TURN_MS)
    return () => clearTimeout(timer)
  }, [turning, setIndex])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, button'))
        return
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, index])

  return { turning, goTo }
}
