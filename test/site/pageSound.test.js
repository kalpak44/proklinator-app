import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * pageSound keeps its context, buffer and preference in module scope, so every case
 * here re-imports it. Without that, the first test to decode a buffer would satisfy
 * every later one.
 */
async function load(stored) {
  localStorage.clear()
  if (stored) localStorage.setItem('proklinator.sound.v1', stored)
  vi.resetModules()
  return import('../../src/lib/pageSound.js')
}

function audioFetch() {
  return vi.fn(async () => ({
    ok: true,
    status: 200,
    arrayBuffer: async () => new ArrayBuffer(8),
  }))
}

beforeEach(() => {
  vi.stubGlobal('fetch', audioFetch())
})

describe('the page-turn sound', () => {
  it('is on unless it was switched off', async () => {
    expect((await load()).isSoundEnabled()).toBe(true)
    expect((await load('off')).isSoundEnabled()).toBe(false)
    expect((await load('on')).isSoundEnabled()).toBe(true)
  })

  it('remembers being switched off', async () => {
    const sound = await load()

    sound.setSoundEnabled(false)

    expect(sound.isSoundEnabled()).toBe(false)
    expect(localStorage.getItem('proklinator.sound.v1')).toBe('off')
  })

  it('plays nothing at all while muted', async () => {
    const sound = await load('off')

    sound.playPageTurn()
    sound.primePageTurn()

    expect(fetch).not.toHaveBeenCalled()
  })

  it('fetches the recording once, however many turns there are', async () => {
    const sound = await load()

    sound.primePageTurn()
    sound.playPageTurn()
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled())
    sound.playPageTurn()

    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('stays silent rather than throwing when the recording is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 404 }))
    )
    const sound = await load()

    expect(() => sound.playPageTurn()).not.toThrow()
  })

  it('stays silent in a browser without Web Audio', async () => {
    vi.stubGlobal('AudioContext', undefined)
    vi.stubGlobal('webkitAudioContext', undefined)
    const sound = await load()

    expect(() => sound.playPageTurn()).not.toThrow()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('survives storage that cannot be read or written', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('private mode')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('private mode')
    })

    const sound = await load()

    expect(sound.isSoundEnabled()).toBe(true)
    expect(() => sound.setSoundEnabled(false)).not.toThrow()
  })
})
