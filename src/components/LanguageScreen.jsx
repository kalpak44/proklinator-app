import { useEffect, useRef } from 'react'
import MarkerCircle from './MarkerCircle.jsx'
import Ornament from './Ornament.jsx'
import { useLanguage } from '../lib/i18n.js'

/** The two supported languages, shown by their own names. */
const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
]

/**
 * Full-page language selection, opened from the header. The book stays mounted
 * underneath, so closing the screen puts the reader back exactly where they
 * were; picking a language applies it and closes the screen in one move.
 */
export default function LanguageScreen({ onSelect, onClose }) {
  const { lang, t } = useLanguage()
  const dialogRef = useRef(null)

  // The overlay takes focus on open so keyboard users can leave it with Esc.
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('lang.screen.heading')}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-desk/85 px-4 py-10"
    >
      <div
        role="radiogroup"
        aria-label={t('lang.screen.heading')}
        onClick={(e) => e.stopPropagation()}
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
          className="font-mono border-marker text-marker hover:bg-marker hover:text-paper mt-8 inline-block cursor-pointer border px-5 py-3 text-[0.78rem] tracking-[0.12em] uppercase transition-colors"
        >
          {t('lang.screen.back')}
        </button>
      </div>
    </div>
  )
}
