import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCart } from '../../src/lib/useCart.js'
import { useCatalog } from '../../src/lib/useCatalog.js'
import { useApiHealth } from '../../src/lib/useApiHealth.js'
import { useMedia } from '../../src/lib/useMedia.js'
import { usePageTurn } from '../../src/lib/usePageTurn.js'

describe('useCart', () => {
  it('starts empty and persists what is added', async () => {
    const { result } = renderHook(() => useCart())

    expect(result.current.items).toEqual([])

    act(() => result.current.toggle('veil', 'once'))

    expect(result.current.items).toEqual([{ curseId: 'veil', optionId: 'once' }])
    await waitFor(() =>
      expect(JSON.parse(localStorage.getItem('proklinator.cart.v1'))).toEqual([
        { curseId: 'veil', optionId: 'once' },
      ])
    )
  })

  it('replaces the option when another one of the same curse is chosen', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.toggle('veil', 'once'))
    act(() => result.current.toggle('veil', 'week'))

    // The book's price lists behave like radio buttons; a curse can only be bought once.
    expect(result.current.items).toEqual([{ curseId: 'veil', optionId: 'week' }])
  })

  it('removes the option when the selected one is chosen again', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.toggle('veil', 'once'))
    act(() => result.current.toggle('veil', 'once'))

    expect(result.current.items).toEqual([])
  })

  it('keeps different curses side by side', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.toggle('veil', 'once'))
    act(() => result.current.toggle('drift', 'cycle'))

    expect(result.current.items).toHaveLength(2)
    expect(result.current.isSelected('drift', 'cycle')).toBe(true)
    expect(result.current.isSelected('drift', 'deep')).toBe(false)
  })

  it('removes and clears', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.toggle('veil', 'once'))
    act(() => result.current.toggle('drift', 'cycle'))
    act(() => result.current.remove('veil', 'once'))

    expect(result.current.items).toEqual([{ curseId: 'drift', optionId: 'cycle' }])

    act(() => result.current.clear())

    expect(result.current.items).toEqual([])
  })

  it('reloads a stored cart', () => {
    localStorage.setItem(
      'proklinator.cart.v1',
      JSON.stringify([{ curseId: 'veil', optionId: 'once' }])
    )

    expect(renderHook(() => useCart()).result.current.items).toHaveLength(1)
  })

  const corrupt = [
    ['not json', '{['],
    ['not an array', '{"curseId":"veil"}'],
    ['entries missing an id', '[{"curseId":"veil"},null,{"optionId":"once"}]'],
  ]

  it.each(corrupt)('drops a stored cart that is %s', (_label, stored) => {
    localStorage.setItem('proklinator.cart.v1', stored)

    // A bad entry is dropped rather than thrown on: the reader gets an empty order
    // sheet, not a blank page.
    expect(renderHook(() => useCart()).result.current.items).toEqual([])
  })

  it('survives storage that refuses to be written', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    const { result } = renderHook(() => useCart())

    expect(() => act(() => result.current.toggle('veil', 'once'))).not.toThrow()
    expect(result.current.items).toHaveLength(1)
  })
})

const CATALOG_RESPONSE = {
  curses: [
    {
      id: 'veil',
      name: 'Серая пелена',
      options: [{ id: 'once', name: 'Касание', unitAmount: 1900, currency: 'eur' }],
    },
  ],
}

function fetchReturning(map) {
  return vi.fn(async (url) => {
    const entry = map[String(url)]
    if (!entry) return { ok: false, status: 404, json: async () => null }
    return { ok: true, status: 200, json: async () => entry }
  })
}

describe('useCatalog', () => {
  it('keys the catalog by the ids the frontend shares with the backend', async () => {
    vi.stubGlobal('fetch', fetchReturning({ '/api/curses': CATALOG_RESPONSE }))

    const { result } = renderHook(() => useCatalog(true))

    await waitFor(() => expect(result.current.available).toBe(true))
    expect(result.current.catalog.byId.veil.options.once.unitAmount).toBe(1900)
  })

  it('stays unavailable rather than inventing prices when the backend is down', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 503, json: async () => null }))
    )

    const { result } = renderHook(() => useCatalog(false))

    await waitFor(() => expect(result.current.available).toBe(false))
    expect(result.current.catalog).toBeNull()
  })

  it('stays unavailable when the payload is not a catalog', async () => {
    vi.stubGlobal('fetch', fetchReturning({ '/api/curses': { curses: 'nope' } }))

    const { result } = renderHook(() => useCatalog(false))

    await waitFor(() => expect(result.current.available).toBe(false))
  })

  it('re-fetches when the backend comes back, and not on every poll tick', async () => {
    const fetchMock = fetchReturning({ '/api/curses': CATALOG_RESPONSE })
    vi.stubGlobal('fetch', fetchMock)

    const { rerender } = renderHook(({ ok }) => useCatalog(ok), {
      initialProps: { ok: false },
    })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    rerender({ ok: true })
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    // Still up on the next tick: nothing changed, so nothing is fetched.
    rerender({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})

describe('useApiHealth', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('is false until the backend answers, then true', async () => {
    vi.stubGlobal('fetch', fetchReturning({ '/api/health': { ok: true } }))

    const { result } = renderHook(() => useApiHealth())

    expect(result.current).toBe(false)
    await vi.waitFor(() => expect(result.current).toBe(true))
  })

  it('goes false again when the backend stops answering', async () => {
    let up = true
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        if (!up) throw new Error('connection refused')
        return { ok: true, status: 200, json: async () => ({ ok: true }) }
      })
    )

    const { result } = renderHook(() => useApiHealth())
    await vi.waitFor(() => expect(result.current).toBe(true))

    up = false
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000)
    })

    expect(result.current).toBe(false)
  })

  it('treats a 200 that is not { ok: true } as unhealthy', async () => {
    vi.stubGlobal('fetch', fetchReturning({ '/api/health': { ok: false } }))

    const { result } = renderHook(() => useApiHealth())
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(result.current).toBe(false)
  })
})

describe('useMedia', () => {
  it('answers the query', () => {
    window.__media = (query) => query === '(min-width: 900px)'

    expect(renderHook(() => useMedia('(min-width: 900px)')).result.current).toBe(true)
    expect(
      renderHook(() => useMedia('(prefers-reduced-motion: reduce)')).result.current
    ).toBe(false)
  })
})

describe('usePageTurn', () => {
  it('turns with the arrow keys and ignores them inside a control', async () => {
    const setIndex = vi.fn()
    window.__media = (query) => query.includes('prefers-reduced-motion')
    renderHook(() => usePageTurn(5, 2, setIndex))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    })
    expect(setIndex).toHaveBeenCalledWith(3)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    })
    expect(setIndex).toHaveBeenCalledWith(1)

    // Typing in the order form must not turn the page out from under the reader.
    const input = document.body.appendChild(document.createElement('input'))
    setIndex.mockClear()
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
      )
    })
    expect(setIndex).not.toHaveBeenCalled()
    input.remove()
  })

  it('refuses to turn past either cover', () => {
    const setIndex = vi.fn()
    window.__media = (query) => query.includes('prefers-reduced-motion')

    const first = renderHook(() => usePageTurn(3, 0, setIndex))
    act(() => first.result.current.goTo(-1))

    const last = renderHook(() => usePageTurn(3, 2, setIndex))
    act(() => last.result.current.goTo(3))

    expect(setIndex).not.toHaveBeenCalled()
  })

  it('ignores a second turn while a leaf is in the air', async () => {
    const setIndex = vi.fn()
    window.__media = () => false
    const { result } = renderHook(() => usePageTurn(5, 0, setIndex))

    act(() => result.current.goTo(1))
    expect(result.current.turning).toMatchObject({ from: 0, to: 1, dir: 'next' })

    // Rapid clicks on the bookmarks would otherwise leave the animation and the
    // content on different chapters.
    act(() => result.current.goTo(4))
    expect(result.current.turning.to).toBe(1)

    await waitFor(() => expect(setIndex).toHaveBeenCalledWith(1), { timeout: 3000 })
  })
})
