import { render } from '@testing-library/react'
import { vi } from 'vitest'
import LanguageProvider from '../../src/components/LanguageProvider.jsx'

/**
 * A `window.location` that records navigation instead of performing it.
 *
 * jsdom marks `assign` non-writable, so it cannot be spied on — but the `location`
 * property of the window is configurable, which is what this replaces. Restored by
 * `vi.unstubAllGlobals()` in the setup file's afterEach.
 */
export function stubLocation({ pathname = '/' } = {}) {
  const assign = vi.fn()
  vi.stubGlobal('location', {
    ...window.location,
    pathname,
    href: `http://localhost${pathname}`,
    origin: 'http://localhost',
    assign,
  })
  return assign
}

/** Nothing in the app renders outside the language context; every render needs it. */
export function renderWithLanguage(ui, options) {
  return render(ui, { wrapper: LanguageProvider, ...options })
}
