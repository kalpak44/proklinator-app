import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

/**
 * The browser APIs the book depends on and jsdom does not implement. Stubbed once here
 * rather than per test, because every render of App reaches all three: a spread only
 * exists behind a media query, page size comes from a ResizeObserver, and a page turn
 * plays through Web Audio.
 *
 * matchMedia is answered by `window.__media`, which a test replaces to render the phone
 * layout instead of the spread.
 */
window.__media = (query) => query.includes('min-width')

window.matchMedia = (query) => ({
  media: query,
  get matches() {
    return Boolean(window.__media(query))
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
  onchange: null,
})

// Reports one size immediately, the way a real observer does when it starts observing.
// Without it useBookGeometry never returns a geometry and MeasureLayer never renders.
window.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback
  }
  observe() {
    this.callback([{ contentRect: { width: 1200, height: 800 } }], this)
  }
  unobserve() {}
  disconnect() {}
}

// Enough of Web Audio for pageSound to build a graph against. It never asserts on
// sound; what matters is that a page turn does not throw in an environment without it.
window.AudioContext = class {
  constructor() {
    this.state = 'running'
    this.destination = {}
  }
  resume() {}
  createBufferSource() {
    return {
      buffer: null,
      playbackRate: { value: 1 },
      connect: () => {},
      start: () => {},
    }
  }
  createGain() {
    return { gain: { value: 0 }, connect: () => {} }
  }
  decodeAudioData() {
    return Promise.resolve({})
  }
}

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  window.__media = (query) => query.includes('min-width')
})
