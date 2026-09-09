import { useEffect, useRef } from 'react'
import MarkerCircle from './MarkerCircle.jsx'
import Ornament from './Ornament.jsx'
import { useLanguage } from '../lib/i18n.js'

/** The two supported languages, shown by their own names. */
const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
]

/** How far an arrow key moves through the options; every direction wraps. */
const ARROW_STEP = {
  ArrowDown: 1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
}

/**
 * Full-page language selection, opened from the header. The book stays mounted
 * underneath, so closing the screen puts the reader back exactly where they
 * were; picking a language applies it and closes the screen in one move.
 */
export default function LanguageScreen({ onSelect, onClose }) {
  const { lang, t } = useLanguage()
  const dialogRef = useRef(null)
  const groupRef = useRef(null)

  // The close callback lives behind a ref: the mount effect below registers
  // document listeners once, so a re-render of the parent (health polls) must
  // not re-open an already open dialog.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // A modal dialog gets its own top layer. Opening is native; Escape is the
  // dialog's own cancel path; and a backdrop click lands on the dialog element
  // itself. All three are wired on the document so the dialog element carries
  // no JSX handlers, and so they behave the same in jsdom, which models none
  // of the top layer.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    const onClick = (event) => {
      if (event.target === dialog) onCloseRef.current()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', onClick)
    groupRef.current?.querySelector('[role="radio"][aria-checked="true"]')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onClick)
    }
  }, [])

  // Arrow keys follow the radio-group pattern: move from the focused option to
  // its neighbour, wrapping past either end, and select it — exactly as
  // clicking that option would.
  function handleKeyDown(event) {
    const step = ARROW_STEP[event.key]
    if (!step) return

    const options = Array.from(groupRef.current?.querySelectorAll('[role="radio"]') ?? [])
    const index = options.indexOf(event.target.closest('[role="radio"]'))
    if (index === -1) return

    event.preventDefault()
    const nextIndex = (index + step + LANGUAGES.length) % LANGUAGES.length
    options[nextIndex].focus()
    onSelect(LANGUAGES[nextIndex].id)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={t('lang.screen.heading')}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-desk/85 px-4 py-10"
    >
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={t('lang.screen.heading')}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-md bg-paper px-8 pt-10 pb-12 shadow-[0_42px_60px_rgba(0,0,0,0.68)]"
      >
        <p className="rubric relative">{t('lang.screen.rubric')}</p>

        <h1 className="font-display text-ink relative mt-2 text-[2rem] leading-[1.05] sm:text-[2.4rem]">
          {t('lang.screen.heading')}
        </h1>

        <Ornament className="relative mt-5" />

        <div className="relative mt-6 space-y-1">
          {LANGUAGES.map(({ id, label }) => {
            const selected = lang === id
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                aria-label={t(`lang.option.${id}`)}
                onClick={() => onSelect(id)}
                className="group relative block w-full cursor-pointer px-3 py-3 text-left"
              >
                {selected && (
                  <span
                    className="marker-wash absolute inset-x-0 inset-y-[0.1rem] origin-left"
                    aria-hidden="true"
                  />
                )}

                <span className="relative flex items-baseline">
                  {selected && <MarkerCircle />}

                  <span
                    className={`font-display relative text-[1.5rem] tracking-[0.02em] transition-colors ${
                      selected ? 'text-ink' : 'text-ink group-hover:text-marker'
                    }`}
                  >
                    {label}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="font-mono border-marker text-marker hover:bg-marker hover:text-paper mt-8 block w-full cursor-pointer border px-5 py-3 text-[0.78rem] tracking-[0.12em] uppercase transition-colors"
        >
          {t('lang.screen.back')}
        </button>
      </div>
    </dialog>
  )
}
