import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CATALOGUES,
  DEFAULT_LANG,
  LANG_KEY,
  persistLanguage,
  resolveLanguage,
  translate,
} from '../../src/lib/i18n.js'

beforeEach(() => {
  localStorage.clear()
})

describe('resolveLanguage', () => {
  it('prefers a stored choice over everything else', () => {
    localStorage.setItem(LANG_KEY, 'ru')
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-GB'])

    expect(resolveLanguage()).toBe('ru')
  })

  it('ignores a stored value that is not a language it has', () => {
    localStorage.setItem(LANG_KEY, 'de')
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ru-RU'])

    expect(resolveLanguage()).toBe('ru')
  })

  it('falls back to the browser preference, matching on the primary subtag', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de-DE', 'ru-RU'])

    expect(resolveLanguage()).toBe('ru')
  })

  it('falls back to the default when nothing matches', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-FR', 'de'])

    expect(resolveLanguage()).toBe(DEFAULT_LANG)
  })

  it('survives storage being unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('private mode')
    })
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ru'])

    expect(resolveLanguage()).toBe('ru')
  })
})

describe('persistLanguage', () => {
  it('writes the choice', () => {
    persistLanguage('ru')

    expect(localStorage.getItem(LANG_KEY)).toBe('ru')
  })

  it('swallows a full or unavailable quota rather than breaking the switch', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })

    expect(() => persistLanguage('ru')).not.toThrow()
  })
})

describe('translate', () => {
  it('looks a key up in the active language', () => {
    expect(translate('order.tab', null, 'ru')).not.toBe(
      translate('order.tab', null, 'bg')
    )
  })

  it('fills placeholders', () => {
    expect(translate('footer.chapter', { numeral: 'IV' }, 'ru')).toContain('IV')
  })

  it('falls back to the default language for one it does not have', () => {
    expect(translate('order.tab', null, 'de')).toBe(
      translate('order.tab', null, DEFAULT_LANG)
    )
  })

  it('returns the key itself for a message that does not exist', () => {
    // Visible in the UI rather than an empty string, so a missing string is obvious.
    expect(translate('no.such.key', null, 'ru')).toBe('no.such.key')
  })
})

describe('the catalogues', () => {
  it('translates the book wholesale, chapter for chapter', () => {
    expect(Object.keys(CATALOGUES)).toEqual(['ru', 'en'])
    expect(CATALOGUES.en.CHAPTERS).toHaveLength(CATALOGUES.ru.CHAPTERS.length)
  })

  it('keeps the same ids in both, since the cart and the catalog key off them', () => {
    const ids = (catalogue) =>
      catalogue.CHAPTERS.flatMap((chapter) => chapter.spells.map((spell) => spell.id))

    expect(ids(CATALOGUES.en)).toEqual(ids(CATALOGUES.ru))
    expect(Object.keys(CATALOGUES.en.OPTION_CONTENT)).toEqual(
      Object.keys(CATALOGUES.ru.OPTION_CONTENT)
    )
  })
})
