import Ornament from './Ornament.jsx'
import { formatMoney } from '../lib/money.js'
import { useLanguage } from '../lib/i18n.js'

/** Spread i occupies pages 2i+1 and 2i+2 - the same rule the folios use. */
const folioOf = (spreadIndex) => 2 * spreadIndex + 1

/**
 * Recto of the opening spread: what the book contains. Every row is a way in,
 * so the reader can start from the chapter they came for instead of turning
 * through the ones they did not.
 *
 * @param {number[]} openings spread index each chapter opens on
 */
export default function Contents({ openings, orderIndex, onOpen }) {
  const { t, catalogue } = useLanguage()
  const { BOOK, CONTENTS } = catalogue

  return (
    <div className="page-fixed relative">
      <p className="rubric relative">{t('contents.rubric')}</p>

      <h2 className="font-display text-ink relative mt-2 text-[1.9rem] leading-[1.05] sm:text-[2.3rem]">
        {t('contents.heading')}
      </h2>

      <Ornament className="relative mt-4" />

      <ul className="relative mt-5 space-y-2.5">
        {CONTENTS.map((chapter, i) => (
          <li key={chapter.id}>
            <button
              type="button"
              onClick={() => onOpen(openings[i])}
              className="group hover:text-marker flex w-full cursor-pointer items-baseline gap-2 text-left transition-colors"
            >
              <span className="font-mono text-ink-faint group-hover:text-marker w-[1.6rem] shrink-0 text-[0.7rem] tracking-[0.1em]">
                {chapter.numeral}
              </span>
              <span className="min-w-0">
                <span className="font-display text-ink group-hover:text-marker text-[1.12rem] transition-colors">
                  {chapter.title}
                </span>
                <span className="text-ink-soft text-[0.85rem]">
                  {' '}
                  · {chapter.subtitle}
                </span>
                <span className="text-ink-faint font-mono block text-[0.68rem] tracking-[0.06em]">
                  {t('contents.count', {
                    count: chapter.count,
                    amount: formatMoney(chapter.from),
                  })}
                </span>
              </span>
              <span className="leader" aria-hidden="true" />
              <span className="font-mono text-ink-faint shrink-0 self-start text-[0.72rem] tracking-[0.12em]">
                {folioOf(openings[i])}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="border-ink-faint/30 relative mt-auto border-t pt-4">
        <p className="rubric text-[0.6rem]">{t('contents.how')}</p>

        <ol className="mt-2 space-y-1.5">
          {BOOK.steps.map((step) => (
            <li key={step.n} className="flex items-baseline gap-2">
              <span className="font-mono text-rubric w-[1.6rem] shrink-0 text-[0.68rem] tracking-[0.1em]">
                {step.n}
              </span>
              <span className="text-ink/90 text-[0.9rem] leading-snug">{step.text}</span>
            </li>
          ))}
        </ol>

        <p className="font-mono text-ink-soft mt-3 text-[0.7rem] leading-snug">
          {BOOK.advice}
        </p>

        <button
          type="button"
          onClick={() => onOpen(orderIndex)}
          className="font-mono border-ink-faint/50 text-ink hover:border-marker hover:text-marker mt-3 cursor-pointer border px-4 py-2 text-[0.7rem] tracking-[0.12em] uppercase transition-colors"
        >
          {t('contents.orderSheet')}
        </button>
      </div>
    </div>
  )
}
