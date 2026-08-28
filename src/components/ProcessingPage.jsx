import { useEffect, useMemo, useState } from 'react'
import Sigil from './Sigil.jsx'
import Ornament from './Ornament.jsx'
import SuccessPage from './SuccessPage.jsx'
import { useCart } from '../lib/useCart.js'
import { useLanguage } from '../lib/i18n.js'
import { useMedia } from '../lib/useMedia.js'

/** The theatrical sequence runs for roughly thirty seconds, then the confirmation takes over. */
const TOTAL_MS = 30000
/** How often the progress clock ticks; the handwriting and the line move with it. */
const TICK_MS = 100

/** One small decorative mark per log slot, drawn so the sequence never needs a font glyph. */
const GLYPH_PATHS = [
  'M50 10 L82 66 L18 66 Z',
  'M50 12 a38 38 0 1 0 .01 0 Z M50 12 v76 M12 50 h76',
  'M18 32 h64 M18 50 h64 M18 68 h64',
  'M50 8 a42 42 0 0 1 0 84 a34 34 0 0 1 0 -68 a26 26 0 0 1 0 52 a18 18 0 0 1 0 -36',
  'M50 8 L80 50 L50 92 L20 50 Z M50 42 v16 M42 50 h16',
  'M62 8 L36 46 h20 L36 92',
]

function ProcessingGlyph({ index }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="processing-glyph"
      aria-hidden="true"
      focusable="false"
    >
      <path d={GLYPH_PATHS[index % GLYPH_PATHS.length]} />
    </svg>
  )
}

/**
 * What `/success` shows after Stripe has confirmed the payment. This is a
 * theatrical interlude, not payment processing: the payment is already through,
 * and the book is putting on the rite while the reader watches. The selection
 * is captured before the confirmation clears the cart, so the rite is themed
 * to the curse that was actually paid for.
 */
export default function ProcessingPage() {
  const { t, catalogue } = useLanguage()
  const { items, clear } = useCart()
  const reduced = useMedia('(prefers-reduced-motion: reduce)')

  // Snapshot the paid selection on mount; SuccessPage clears the cart when the
  // sequence ends, so the themed lines must survive that.
  const [order] = useState(() => items)

  // One clock drives the stage, the progress line and the handwriting.
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const started = Date.now()
    const timer = setInterval(() => {
      setElapsed(Math.min(Date.now() - started, TOTAL_MS))
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [])

  const done = elapsed >= TOTAL_MS
  const progress = elapsed / TOTAL_MS

  // Three generic steps are replaced by the selected curse's own lines, so the
  // rite never reads like a generic loader; an empty cart falls back to spares.
  const themed = catalogue.PROCESSING?.[order[0]?.curseId] ?? []
  const stages = [
    t('processing.stage.recover'),
    t('processing.stage.examine'),
    t('processing.stage.archive'),
    themed[0] ?? t('processing.stage.spare.1'),
    t('processing.stage.fragments'),
    themed[1] ?? t('processing.stage.spare.2'),
    t('processing.stage.connection'),
    t('processing.stage.ai'),
    themed[2] ?? t('processing.stage.spare.3'),
    t('processing.stage.write'),
    t('processing.stage.seal'),
  ]
  const stageIndex = Math.min(Math.floor(progress * stages.length), stages.length - 1)

  const lines = useMemo(
    () =>
      order
        .map((item) => catalogue.OPTION_CONTENT[`${item.curseId}/${item.optionId}`])
        .filter(Boolean),
    [order, catalogue]
  )

  // The manuscript writes the curse's name over the last 85% of the sequence,
  // finishing just before the seal; reduced motion skips the reveal.
  const manuscriptName = lines[0]?.curseName ?? t('processing.fallbackName')
  const revealRatio = Math.min(progress / 0.85, 1)
  const revealCount = reduced
    ? manuscriptName.length
    : Math.floor(revealRatio * manuscriptName.length)
  const nameRevealed = manuscriptName.slice(0, revealCount)
  const nameDone = revealCount >= manuscriptName.length

  if (done) return <SuccessPage order={lines} onClearCart={clear} />

  return (
    <div className="desk flex min-h-dvh items-center justify-center px-3 py-6 sm:px-6 sm:py-8">
      <div className="processing-sheet">
        <section className="paper paper--verso processing-half">
          <div className="page-body processing-body">
            <p className="rubric">{t('processing.rubric')}</p>

            <h1 className="font-display text-ink mt-2 text-[2rem] leading-[1.05] sm:text-[2.6rem]">
              {t('processing.heading')}
            </h1>

            <p className="text-ink-soft mt-3 text-[0.92rem] leading-[1.55]">
              {t('processing.intro')}
            </p>

            <Ornament className="mt-4" />

            <ol className="processing-log relative mt-5" aria-hidden="true">
              {stages.map((text, i) => (
                <li
                  key={i}
                  className={
                    i === stageIndex ? 'is-current' : i < stageIndex ? 'is-past' : ''
                  }
                >
                  <ProcessingGlyph index={i} />
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="paper paper--recto processing-half">
          <div className="page-body processing-body">
            <Sigil className="pointer-events-none absolute -top-8 right-[-3rem] w-64 max-w-[70%] opacity-[0.07]" />

            <div className="processing-manuscript">
              <p className="rubric relative">{t('processing.manuscript')}</p>

              <p className="font-display text-ink relative mt-3 min-h-[3.2em] text-[2.1rem] leading-[1.1] sm:text-[2.6rem]">
                {nameRevealed}
                {!nameDone && <span className="processing-caret" aria-hidden="true" />}
              </p>

              <div className="processing-fragments relative mt-4" aria-hidden="true">
                {Array.from({ length: 9 }, (_, i) => (
                  <span key={i} className={progress > (i + 1) / 10 ? 'is-lit' : ''} />
                ))}
              </div>

              <p
                className={`processing-written relative mt-4 ${nameDone ? 'is-visible' : ''}`}
              >
                {t('processing.written')}
              </p>
            </div>

            <div className="processing-seal relative mt-auto pt-7">
              <div className="processing-progress" role="presentation" aria-hidden="true">
                <div className="processing-progress__track">
                  <div
                    className="processing-progress__fill"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <span
                  className="processing-progress__marker"
                  style={{ left: `${Math.round(progress * 100)}%` }}
                />
              </div>

              <p role="status" className="processing-status mt-3">
                <ProcessingGlyph key={stageIndex} index={stageIndex} />
                <span>{stages[stageIndex]}</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
