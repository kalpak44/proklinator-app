import { useRef } from 'react'
import { useMedia } from '../../lib/useMedia.js'
import { spreadFolios } from '../../lib/pagination.js'
import { useLanguage } from '../../lib/i18n.js'

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

const SWIPE_MIN_PX = 55

/** A phone page shows both halves stacked in reading order under one folio. */
function SingleStack({ page }) {
  return (
    <>
      {page.verso}
      <hr className="border-ink-faint/30 my-8" />
      {page.recto}
    </>
  )
}

/** The sheet lying still under a turn: the open pages, or the destination ones. */
function BookSheets({ turning, forward, from, to, fromFolio, toFolio }) {
  const back = turning && !forward
  const front = turning && forward
  return (
    <>
      <Paper side="verso" folio={back ? toFolio.verso : fromFolio.verso}>
        {(back ? to : from).verso}
      </Paper>
      <Paper side="recto" folio={front ? toFolio.recto : fromFolio.recto}>
        {(front ? to : from).recto}
      </Paper>
    </>
  )
}

/** The phone layout during a turn: the destination page slides in underneath. */
function PhoneSheet({ turning, from, to, fromFolio, toFolio }) {
  const sheet = turning ? to : from
  const folio = turning ? toFolio.verso : fromFolio.verso
  return (
    <Paper side="single" folio={folio}>
      <SingleStack page={sheet} />
    </Paper>
  )
}

/** The creased corners: the page ahead and the page behind, both turnable. */
function Dogears({ turning, index, count, goTo, prevLabel, nextLabel }) {
  const canGoPrev = !turning && index > 0
  const canGoNext = !turning && index < count - 1
  return (
    <>
      {canGoPrev && (
        <button
          type="button"
          className="dogear dogear--prev"
          onClick={() => goTo(index - 1)}
          aria-label={prevLabel}
        />
      )}
      {canGoNext && (
        <button
          type="button"
          className="dogear dogear--next"
          onClick={() => goTo(index + 1)}
          aria-label={nextLabel}
        />
      )}
    </>
  )
}

/** The paper side the leaf's front face shows; a phone always shows the single page. */
function frontSide(spread, forward) {
  if (!spread) return 'single'
  return forward ? 'recto' : 'verso'
}

/** The paper side the leaf's back face shows; a phone always shows the single page. */
function backSide(spread, forward) {
  if (!spread) return 'single'
  return forward ? 'verso' : 'recto'
}

/** The front face carries the page the reader is leaving, on the side this turn shows. */
function frontPage(spread, forward, page) {
  if (!spread) return <SingleStack page={page} />
  return forward ? page.recto : page.verso
}

/** The back face carries the page the reader is arriving at, on the side this turn shows. */
function backPage(spread, forward, page) {
  if (!spread) return <SingleStack page={page} />
  return forward ? page.verso : page.recto
}

/** The sheet rotating over the spread, one page on each face. */
function TurnLeaf({ turning, spread, forward, from, to, fromFolio, toFolio }) {
  return (
    <div className={`leaf leaf--${turning.dir}`} aria-hidden="true">
      <div className="face">
        <Paper
          side={frontSide(spread, forward)}
          folio={forward ? fromFolio.recto : fromFolio.verso}
        >
          {frontPage(spread, forward, from)}
        </Paper>
      </div>
      <div className="face face--back">
        <Paper
          side={backSide(spread, forward)}
          folio={forward ? toFolio.verso : toFolio.recto}
        >
          {backPage(spread, forward, to)}
        </Paper>
      </div>
    </div>
  )
}

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
  const { t } = useLanguage()
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

  const fromIndex = turning?.from ?? index
  const toIndex = turning?.to ?? index
  const from = pages[fromIndex]
  const to = pages[toIndex]
  const forward = turning?.dir === 'next'
  const fromFolio = spreadFolios(fromIndex)
  const toFolio = spreadFolios(toIndex)

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
          <BookSheets
            turning={turning}
            forward={forward}
            from={from}
            to={to}
            fromFolio={fromFolio}
            toFolio={toFolio}
          />
        ) : (
          <PhoneSheet
            turning={turning}
            from={from}
            to={to}
            fromFolio={fromFolio}
            toFolio={toFolio}
          />
        )}
      </div>

      <Dogears
        turning={turning}
        index={index}
        count={pages.length}
        goTo={goTo}
        prevLabel={t('nav.prev')}
        nextLabel={t('nav.next')}
      />

      {turning && (
        <TurnLeaf
          turning={turning}
          spread={spread}
          forward={forward}
          from={from}
          to={to}
          fromFolio={fromFolio}
          toFolio={toFolio}
        />
      )}
    </div>
  )
}
