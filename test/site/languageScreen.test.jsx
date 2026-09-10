import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../../src/App.jsx'
import LanguageScreen from '../../src/components/organisms/LanguageScreen.jsx'
import { CATALOGUES, LANG_KEY, translate } from '../../src/lib/i18n.js'
import { renderWithLanguage, stubLocation } from './helpers.js'

const t = (key, lang) => translate(key, null, lang)

/** The accessible name an option carries on a screen rendered in `screenLang`. */
const optionLabel = (screenLang, optionLang) => t(`lang.option.${optionLang}`, screenLang)

const radio = (dialog, screenLang, optionLang) =>
  within(dialog).getByRole('radio', { name: optionLabel(screenLang, optionLang) })

/** Opens the screen in the given language and hands back its controls. */
function renderScreen(lang) {
  localStorage.setItem(LANG_KEY, lang)
  const user = userEvent.setup()
  const onSelect = vi.fn()
  const onClose = vi.fn()
  renderWithLanguage(<LanguageScreen onSelect={onSelect} onClose={onClose} />)
  const dialog = screen.getByRole('dialog')
  return { user, onSelect, onClose, dialog }
}

describe('the language screen keyboard contract', () => {
  it('opens with focus on the checked language, not on the overlay', () => {
    const { dialog } = renderScreen('ru')

    expect(document.activeElement).toBe(radio(dialog, 'ru', 'ru'))
    expect(document.activeElement).not.toBe(dialog)
  })

  it('is a single tab stop: Tab from the checked language reaches Back directly', async () => {
    const { user, dialog } = renderScreen('en')

    expect(radio(dialog, 'en', 'ru').tabIndex).toBe(-1)

    await user.tab()

    expect(document.activeElement).toBe(
      within(dialog).getByRole('button', { name: t('lang.screen.back', 'en') })
    )
  })

  it.each([
    ['ArrowDown', 'ru', 'en'],
    ['ArrowRight', 'en', 'ru'],
    ['ArrowUp', 'en', 'ru'],
    ['ArrowLeft', 'ru', 'en'],
  ])(
    '%s from %s moves to and selects %s, wrapping at the ends',
    async (key, from, to) => {
      const { user, onSelect, onClose, dialog } = renderScreen(from)

      await user.keyboard(`{${key}}`)

      expect(onSelect).toHaveBeenCalledWith(to)
      expect(document.activeElement).toBe(radio(dialog, from, to))
      expect(onClose).not.toHaveBeenCalled()
    }
  )

  it('ignores arrow keys pressed while focus is outside the options', async () => {
    const { user, onSelect, onClose, dialog } = renderScreen('ru')

    await user.tab()
    expect(document.activeElement).toBe(
      within(dialog).getByRole('button', { name: t('lang.screen.back', 'ru') })
    )

    await user.keyboard('{ArrowDown}')

    expect(onSelect).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('selects the focused option on Enter, as a click would', async () => {
    const { user, onSelect, onClose } = renderScreen('ru')

    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledWith('ru')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('selects the focused option on Space, as a click would', async () => {
    const { user, onSelect, onClose } = renderScreen('en')

    await user.keyboard(' ')

    expect(onSelect).toHaveBeenCalledWith('en')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes with Escape and leaves the language untouched', async () => {
    const { user, onSelect, onClose } = renderScreen('ru')

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('closes on a backdrop click but not on a click inside the panel', async () => {
    const { user, onClose, dialog } = renderScreen('ru')

    await user.click(dialog)
    expect(onClose).toHaveBeenCalledTimes(1)

    onClose.mockClear()
    await user.click(within(dialog).getByRole('radiogroup'))
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('the language screen in the app', () => {
  it('switches the language and closes when an arrow moves onto another option', async () => {
    localStorage.setItem(LANG_KEY, 'ru')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        if (String(url).includes('/api/health')) {
          return { ok: true, status: 200, json: async () => ({ ok: true }) }
        }
        return { ok: true, status: 200, json: async () => ({ curses: [] }) }
      })
    )
    stubLocation()
    const user = userEvent.setup()
    renderWithLanguage(<App />)

    await user.click(
      within(document.querySelector('header')).getByRole('button', {
        name: t('lang.current.ru', 'ru'),
      })
    )

    const dialog = await screen.findByRole('dialog')
    expect(document.activeElement).toBe(radio(dialog, 'ru', 'ru'))

    await user.keyboard('{ArrowDown}')

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(localStorage.getItem(LANG_KEY)).toBe('en')
    expect(
      within(document.querySelector('header')).getByText(CATALOGUES.en.BOOK.title)
    ).toBeTruthy()
  })
})
