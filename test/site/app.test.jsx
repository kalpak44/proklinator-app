import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../src/App.jsx'
import { CATALOGUES, LANG_KEY, translate } from '../../src/lib/i18n.js'
import { renderWithLanguage, stubLocation } from './helpers.js'

const CATALOG = {
  curses: CATALOGUES.ru.CHAPTERS.flatMap((chapter) =>
    chapter.spells.map((spell) => ({
      id: spell.id,
      name: spell.title,
      options: spell.prices.map((price) => ({
        id: price.id,
        name: price.label,
        unitAmount: 1900,
        currency: 'eur',
      })),
    }))
  ),
}

function apiUp(catalog = CATALOG) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) => {
      if (String(url).includes('/api/health')) {
        return { ok: true, status: 200, json: async () => ({ ok: true, sha: 'test' }) }
      }
      if (String(url).includes('/api/curses')) {
        return { ok: true, status: 200, json: async () => catalog }
      }
      return {
        ok: false,
        status: 404,
        json: async () => null,
        arrayBuffer: async () => null,
      }
    })
  )
}

const t = (key, vars) => translate(key, vars, 'ru')

/**
 * The footer arrows and the book's own corner-turn buttons carry the same labels, and
 * the header's order button shares its label with the order bookmark, so every query
 * below is scoped to the region it means.
 */
const header = () => within(document.querySelector('header'))
const footer = () => within(document.querySelector('footer'))

beforeEach(() => {
  localStorage.setItem(LANG_KEY, 'ru')
  apiUp()
  stubLocation()
  // Reduced motion by default: a turn then lands synchronously instead of after the
  // 900ms leaf animation, so these tests assert on content rather than on a timeout.
  // One test below opts back into the animation.
  window.__media = (query) =>
    query.includes('min-width') || query.includes('prefers-reduced-motion')
})

describe('the book', () => {
  it('opens on the title page with the whole catalogue reachable', async () => {
    renderWithLanguage(<App />)

    expect(header().getByText(CATALOGUES.ru.BOOK.title)).toBeTruthy()
    expect(await screen.findByText(t('footer.home'))).toBeTruthy()

    // One bookmark per chapter plus the order sheet. They are the only way to reach a
    // chapter directly, so a missing one is a chapter nobody can open.
    for (const chapter of CATALOGUES.ru.CHAPTERS) {
      expect(screen.getAllByText(chapter.tab).length).toBeGreaterThan(0)
    }
  })

  it('turns to the next spread and back', async () => {
    window.__media = (query) => query.includes('min-width')
    const user = userEvent.setup()
    renderWithLanguage(<App />)

    await user.click(footer().getByRole('button', { name: t('nav.next') }))

    await waitFor(() => expect(screen.queryByText(t('footer.home'))).toBeNull(), {
      timeout: 3000,
    })

    await user.click(footer().getByRole('button', { name: t('nav.prev') }))

    await waitFor(() => expect(screen.getByText(t('footer.home'))).toBeTruthy(), {
      timeout: 3000,
    })
  })

  it('cannot turn back from the title page or on from the order sheet', async () => {
    const user = userEvent.setup()
    renderWithLanguage(<App />)

    expect(footer().getByRole('button', { name: t('nav.prev') }).disabled).toBe(true)

    await user.click(header().getByRole('button', { name: /Заказ/ }))

    await waitFor(() =>
      expect(footer().getByRole('button', { name: t('nav.next') }).disabled).toBe(true)
    )
  })

  it('shows the cart total in the header once something is chosen', async () => {
    const user = userEvent.setup()
    renderWithLanguage(<App />)

    const badge = header().getByRole('button', { name: /Заказ/ })
    expect(badge.textContent).toContain(t('order.empty'))

    // Price rows only exist inside a chapter, and only once the backend catalog has
    // arrived — a row with no price renders as plain text and cannot be chosen. The
    // query is scoped to <main> because MeasureLayer renders every row off-screen too.
    await user.click(
      screen.getAllByRole('button', { name: CATALOGUES.ru.CHAPTERS[0].tab })[0]
    )
    const rows = await waitFor(() => {
      const found = within(document.querySelector('main')).getAllByRole('radio')
      expect(found.length).toBeGreaterThan(0)
      return found
    })
    await user.click(rows[0])

    await waitFor(() => expect(badge.textContent).not.toContain(t('order.empty')))
  })

  it('switches language and keeps the reader on the book', async () => {
    const user = userEvent.setup()
    renderWithLanguage(<App />)

    await user.click(screen.getByRole('button', { name: t('lang.current.ru') }))

    await waitFor(() => expect(header().getByText(CATALOGUES.bg.BOOK.title)).toBeTruthy())
    expect(localStorage.getItem(LANG_KEY)).toBe('bg')
  })

  it('toggles the page-turn sound and remembers it', async () => {
    const user = userEvent.setup()
    renderWithLanguage(<App />)

    await user.click(header().getByRole('button', { name: t('sound.off') }))

    expect(header().getByRole('button', { name: t('sound.on') })).toBeTruthy()
    expect(localStorage.getItem('proklinator.sound.v1')).toBe('off')
  })

  it('marks the backend down until it answers', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('connection refused')
      })
    )
    const { container } = renderWithLanguage(<App />)

    // The dot in the header is the only signal that the API is unreachable.
    await waitFor(() => expect(container.querySelector('.agent-dot')).toBeTruthy())
    expect(container.querySelector('.agent-dot').className).toContain('bg-marker')
  })

  it('refuses to charge for a cart it has no prices for', async () => {
    localStorage.setItem(
      'proklinator.cart.v1',
      JSON.stringify([
        { curseId: CATALOGUES.ru.CHAPTERS[0].spells[0].id, optionId: 'once' },
      ])
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) =>
        String(url).includes('/api/health')
          ? { ok: true, status: 200, json: async () => ({ ok: true }) }
          : { ok: false, status: 503, json: async () => null }
      )
    )
    const user = userEvent.setup()
    renderWithLanguage(<App />)

    await user.click(header().getByRole('button', { name: /Заказ/ }))

    // Never an invented amount: the pay button says the catalog is unavailable and
    // stays disabled, rather than charging a total nothing resolved.
    const pay = await screen.findByRole('button', { name: t('checkout.cta.unavailable') })
    expect(pay.disabled).toBe(true)
  })

  it('renders the phone layout with one bookmark strip instead of two edges', async () => {
    window.__media = () => false
    const { container } = renderWithLanguage(<App />)

    await waitFor(() => expect(container.querySelectorAll('.tabs--top').length).toBe(1))
    expect(container.querySelectorAll('.tabs--left, .tabs--right').length).toBe(0)
  })
})

describe('the success page', () => {
  it('replaces the book and clears the cart Stripe was paid for', async () => {
    localStorage.setItem(
      'proklinator.cart.v1',
      JSON.stringify([{ curseId: 'veil', optionId: 'once' }])
    )
    stubLocation({ pathname: '/success' })

    renderWithLanguage(<App />)

    expect(screen.getByText(t('success.heading'))).toBeTruthy()
    // Only a completed payment clears it — a cancelled checkout must leave it alone.
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem('proklinator.cart.v1'))).toEqual([])
    )
  })
})
