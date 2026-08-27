import { useRef } from 'react'
import { useMedia } from '../lib/useMedia.js'

function Paper({ side, folio, children }) {
  return (
    <div className={`paper paper--${side}`}>
      {/* Fixed padding only below the spread. Above it the percentages have to
          stand: MeasureLayer paginates against them, and an override reaching
          into the spread would have it measuring one page and rendering another. */}
      <div className="page-body max-book:px-7 max-book:pt-8 max-book:pb-14 px-[8%] pt-[6%] pb-[10.5%]">
        {children}
      </div>
      <span className={`folio folio--${side}`} aria-hidden="true">
        {folio}
      </span>
    </div>
  )
}

/** Book pagination: spread i occupies pages 2i+1 and 2i+2. */
const folioOf = (i) => ({ verso: 2 * i + 1, recto: 2 * i + 2 })

const SWIPE_MIN_PX = 55

/**
 * The book: a two-page spread that actually turns.
 *
 * Three sheets are on stage during a turn. The spread being opened is already
 * lying underneath; the outgoing sheet rotates above it with a face on each
 * side. Which pages go where depends on direction:
 *
 *   forward:  under verso(from) + recto(to), leaf recto(from) / verso(to)
 *   backward: under verso(to) + recto(from), leaf verso(from) / recto(to)
 *
 * A narrow screen has no spread: one page, both halves stacked in reading order.
 */
export default function Book({ bookRef, pages, index, turning, goTo }) {
  const spread = useMedia('(min-width: 900px)')
  const touch = useRef(null)

  const onTouchStart = (e) => {
    const point = e.changedTouches[0]
    touch.current = { x: point.clientX, y: point.clientY }
  }

  // Pages scroll vertically on a phone, so only a clearly horizontal swipe turns them.
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return
    goTo(dx < 0 ? index + 1 : index - 1)
  }

  const fromIndex = turning ? turning.from : index
  const toIndex = turning ? turning.to : index
  const from = pages[fromIndex]
  const to = pages[toIndex]
  const forward = turning?.dir === 'next'
  const fromFolio = folioOf(fromIndex)
  const toFolio = folioOf(toIndex)

  const single = (page) => (
    <>
      {page.verso}
      <hr className="border-ink-faint/30 my-8" />
      {page.recto}
    </>
  )

  return (
    <div
      className="book"
      ref={bookRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <span className="book-edge book-edge--left" aria-hidden="true" />
      <span className="book-edge book-edge--right" aria-hidden="true" />

      <div className={`spread ${turning ? 'spread--turning' : ''}`}>
        {spread ? (
          <>
            <Paper
              side="verso"
              folio={turning && !forward ? toFolio.verso : fromFolio.verso}
            >
              {(turning && !forward ? to : from).verso}
            </Paper>
            <Paper
              side="recto"
              folio={turning && forward ? toFolio.recto : fromFolio.recto}
            >
              {(turning && forward ? to : from).recto}
            </Paper>
          </>
        ) : (
          <Paper side="single" folio={turning ? toFolio.verso : fromFolio.verso}>
            {single(turning ? to : from)}
          </Paper>
        )}
      </div>

      {/* Creased corners: the page ahead and the page behind, both turnable. */}
      {!turning && index > 0 && (
        <button
          type="button"
          className="dogear dogear--prev"
          onClick={() => goTo(index - 1)}
          aria-label="Предыдущий разворот"
        />
      )}
      {!turning && index < pages.length - 1 && (
        <button
          type="button"
          className="dogear dogear--next"
          onClick={() => goTo(index + 1)}
          aria-label="Следующий разворот"
        />
      )}

      {turning && (
        <div className={`leaf leaf--${turning.dir}`} aria-hidden="true">
          <div className="face">
            <Paper
              side={spread ? (forward ? 'recto' : 'verso') : 'single'}
              folio={forward ? fromFolio.recto : fromFolio.verso}
            >
              {spread ? (forward ? from.recto : from.verso) : single(from)}
            </Paper>
          </div>
          <div className="face face--back">
            <Paper
              side={spread ? (forward ? 'verso' : 'recto') : 'single'}
              folio={forward ? toFolio.verso : toFolio.recto}
            >
              {spread ? (forward ? to.verso : to.recto) : single(to)}
            </Paper>
          </div>
        </div>
      )}
    </div>
  )
}
