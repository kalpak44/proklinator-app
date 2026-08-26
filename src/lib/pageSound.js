/**
 * Page-turn sound.
 *
 * The recording lives in public/sounds and is decoded once into an AudioBuffer.
 * Web Audio rather than an <audio> element: turns can overlap, and a buffer
 * source can be started again while the previous one is still ringing out.
 * Playback rate is jittered slightly so repeated turns are not identical.
 *
 * The context is created lazily and resumed on use. Every turn starts from a
 * click, a key press or a swipe, so autoplay policy is always satisfied.
 */
const STORAGE_KEY = 'proklinator.sound.v1'
const SOURCE = '/sounds/page-turn.wav'
const VOLUME = 0.55

let ctx = null
let buffer = null
let loading = null
let enabled = readStoredPreference()

function readStoredPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

export function isSoundEnabled() {
  return enabled
}

export function setSoundEnabled(value) {
  enabled = value
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off')
  } catch {
    // Private mode: the preference simply will not survive a reload.
  }
  if (value) load()
}

function audioContext() {
  const Ctor = window.AudioContext ?? window.webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Fetch and decode once; concurrent callers share the same promise. */
function load() {
  if (buffer || loading) return loading
  const ac = audioContext()
  if (!ac) return null
  loading = fetch(SOURCE)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.status))))
    .then((data) => ac.decodeAudioData(data))
    .then((decoded) => {
      buffer = decoded
      return decoded
    })
    .catch(() => {
      // Missing or undecodable asset: turns stay silent rather than throwing.
      loading = null
      return null
    })
  return loading
}

/** Warms the buffer up so the first turn is not the one that waits for it. */
export function primePageTurn() {
  if (enabled) load()
}

function play(decoded, ac) {
  const source = ac.createBufferSource()
  source.buffer = decoded
  source.playbackRate.value = 0.94 + Math.random() * 0.12

  const gain = ac.createGain()
  gain.gain.value = VOLUME

  source.connect(gain)
  gain.connect(ac.destination)
  source.start()
}

/** Called once per page turn. A no-op while muted or without Web Audio. */
export function playPageTurn() {
  if (!enabled) return
  const ac = audioContext()
  if (!ac) return
  if (buffer) {
    play(buffer, ac)
    return
  }
  load()?.then((decoded) => {
    if (decoded && enabled) play(decoded, ac)
  })
}
