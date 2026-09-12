import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'

/**
 * The Yandex.Metrika counter lives in index.html, outside `src`, so nothing else in the
 * suite touches it. Parsing the real entry document keeps the snippet honest: the tag is
 * inserted and the counter is initialised, whatever the markup around it looks like.
 */
const load = () =>
  new JSDOM(html, { runScripts: 'dangerously', url: 'https://www.proklinator.online/' })

describe('Yandex.Metrika counter', () => {
  it('inserts the tag for the counter and initialises it', () => {
    const { window } = load()

    const tag = window.document.querySelector(
      'script[src^="https://mc.yandex.ru/metrika/tag.js"]'
    )
    expect(tag?.getAttribute('src')).toBe(
      'https://mc.yandex.ru/metrika/tag.js?id=112528186'
    )

    expect(window.ym.a[0][0]).toBe(112528186)
    expect(window.ym.a[0][1]).toBe('init')
    expect(window.ym.a[0][2]).toMatchObject({ webvisor: true, clickmap: true, ssr: true })
  })
})
