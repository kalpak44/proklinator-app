import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import Book from '../../src/components/Book.jsx'
import { renderWithLanguage } from './helpers.js'

/** A two-faced page whose halves carry readable markers. */
function page(id) {
  return {
    id,
    verso: <p>verso:{id}</p>,
    recto: <p>recto:{id}</p>,
  }
}

const PAGES = [0, 1, 2].map((i) => page(`p${i}`))
const bookRef = { current: null }

/** Renders the book at `index` with the given turn state. */
function renderBook({ index = 0, turning = null, goTo = vi.fn(), phone = false } = {}) {
  window.__media = (query) =>
    phone ? query.includes('prefers-reduced-motion') : query.includes('min-width')
  return renderWithLanguage(
    <Book bookRef={bookRef} pages={PAGES} index={index} turning={turning} goTo={goTo} />
  )
}

const paper = (container, side) => container.querySelector(`.paper--${side}`)

describe('the book spread', () => {
  it('shows the open pages with their folios on both sides', () => {
    const { container } = renderBook({ index: 1 })

    expect(paper(container, 'verso').textContent).toContain('verso:p1')
    expect(paper(container, 'verso').querySelector('.folio').textContent).toBe('3')
    expect(paper(container, 'recto').textContent).toContain('recto:p1')
    expect(paper(container, 'recto').querySelector('.folio').textContent).toBe('4')
  })

  it('turning forward rests the destination sheet under the outgoing leaf', () => {
    const { container } = renderBook({
      index: 1,
      turning: { from: 1, to: 2, dir: 'next' },
    })

    // The spread underneath has already moved on to the page being opened.
    expect(paper(container, 'verso').textContent).toContain('verso:p1')
    expect(paper(container, 'recto').textContent).toContain('recto:p2')
    expect(container.querySelector('.spread').className).toContain('spread--turning')

    // The leaf over it carries the leaving page in front and the arriving one behind.
    const leaf = container.querySelector('.leaf.leaf--next')
    expect(leaf).toBeTruthy()
    expect(leaf.querySelector('.face .paper--recto').textContent).toContain('recto:p1')
    expect(leaf.querySelector('.face--back .paper--verso').textContent).toContain(
      'verso:p2'
    )
    expect(leaf.querySelector('.face .folio').textContent).toBe('4')
    expect(leaf.querySelector('.face--back .folio').textContent).toBe('5')
  })

  it('turning backward swaps which pages lie under and on the leaf', () => {
    const { container } = renderBook({
      index: 1,
      turning: { from: 1, to: 0, dir: 'prev' },
    })

    expect(paper(container, 'verso').textContent).toContain('verso:p0')
    expect(paper(container, 'recto').textContent).toContain('recto:p1')

    const leaf = container.querySelector('.leaf.leaf--prev')
    expect(leaf).toBeTruthy()
    expect(leaf.querySelector('.face .paper--verso').textContent).toContain('verso:p1')
    expect(leaf.querySelector('.face--back .paper--recto').textContent).toContain(
      'recto:p0'
    )
    expect(leaf.querySelector('.face .folio').textContent).toBe('3')
    expect(leaf.querySelector('.face--back .folio').textContent).toBe('2')
  })
})

describe('the phone book', () => {
  it('stacks both halves of the open page under one folio', () => {
    const { container } = renderBook({ index: 1, phone: true })

    const single = paper(container, 'single')
    expect(single.textContent).toContain('verso:p1')
    expect(single.textContent).toContain('recto:p1')
    expect(single.querySelector('.folio').textContent).toBe('3')
  })

  it('shows the destination page sliding in underneath while turning', () => {
    const { container } = renderBook({
      index: 1,
      phone: true,
      turning: { from: 1, to: 2, dir: 'next' },
    })

    const single = paper(container, 'single')
    expect(single.textContent).toContain('verso:p2')
    expect(single.textContent).toContain('recto:p2')
    expect(single.querySelector('.folio').textContent).toBe('5')

    const leaf = container.querySelector('.leaf')
    expect(leaf.querySelectorAll('.paper--single').length).toBe(2)
    expect(leaf.querySelector('.face').textContent).toContain('verso:p1')
    expect(leaf.querySelector('.face--back').textContent).toContain('recto:p2')
  })
})

describe('the corner turns', () => {
  it('turns the corner behind and ahead of the open page', () => {
    const goTo = vi.fn()
    const { container } = renderBook({ index: 1, goTo })

    fireEvent.click(container.querySelector('.dogear--prev'))
    expect(goTo).toHaveBeenCalledWith(0)

    fireEvent.click(container.querySelector('.dogear--next'))
    expect(goTo).toHaveBeenCalledWith(2)
  })

  it('hides both corners on the first page and while a leaf is in the air', () => {
    const { container } = renderBook({ index: 0 })
    expect(container.querySelector('.dogear--prev')).toBeNull()
    expect(container.querySelector('.dogear--next')).toBeTruthy()

    const turning = renderBook({ index: 1, turning: { from: 1, to: 2, dir: 'next' } })
    expect(turning.container.querySelectorAll('.dogear').length).toBe(0)
  })
})

describe('swiping', () => {
  it('turns forward on a clear leftward swipe', () => {
    const goTo = vi.fn()
    const { container } = renderBook({ phone: true, goTo })
    const book = container.querySelector('.book')

    fireEvent.touchStart(book, { changedTouches: [{ clientX: 300, clientY: 100 }] })
    fireEvent.touchEnd(book, { changedTouches: [{ clientX: 100, clientY: 100 }] })

    expect(goTo).toHaveBeenCalledWith(1)
  })

  it('turns backward on a rightward swipe', () => {
    const goTo = vi.fn()
    const { container } = renderBook({ index: 1, phone: true, goTo })
    const book = container.querySelector('.book')

    fireEvent.touchStart(book, { changedTouches: [{ clientX: 100, clientY: 100 }] })
    fireEvent.touchEnd(book, { changedTouches: [{ clientX: 300, clientY: 100 }] })

    expect(goTo).toHaveBeenCalledWith(0)
  })

  it('ignores swipes that are too short or more vertical than horizontal', () => {
    const goTo = vi.fn()
    const { container } = renderBook({ index: 1, phone: true, goTo })
    const book = container.querySelector('.book')

    fireEvent.touchStart(book, { changedTouches: [{ clientX: 200, clientY: 100 }] })
    fireEvent.touchEnd(book, { changedTouches: [{ clientX: 180, clientY: 100 }] })
    fireEvent.touchStart(book, { changedTouches: [{ clientX: 200, clientY: 100 }] })
    fireEvent.touchEnd(book, { changedTouches: [{ clientX: 100, clientY: 200 }] })
    fireEvent.touchEnd(book, { changedTouches: [{ clientX: 50, clientY: 150 }] })

    expect(goTo).not.toHaveBeenCalled()
  })
})
