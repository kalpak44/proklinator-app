import { formatMoney } from '../lib/money.js'
import Ornament from './Ornament.jsx'
import Sigil from './Sigil.jsx'
import { useLanguage } from '../lib/i18n.js'

/** Verso of the closing spread: exactly what is being paid for. */
export default function OrderSummary({ totals, onRemove, onBrowse }) {
  const { t } = useLanguage()
  const byChapter = totals.lines.reduce((acc, line) => {
    ;(acc[line.chapterTitle] ??= []).push(line)
    return acc
  }, {})

  return (
    <div className="page-fixed relative">
      <Sigil className="pointer-events-none absolute -top-6 left-1/2 w-[22rem] max-w-[95%] -translate-x-1/2" />

      <p className="rubric relative">{t('order.summaryRubric')}</p>

      <h2 className="font-display text-ink relative mt-2 text-[2rem] leading-[1.05] sm:text-[2.6rem]">
        {t('order.yourChoice')}
      </h2>

      <Ornament className="relative mt-5" />

      {totals.count === 0 ? (
        <div className="relative mt-8">
          <p className="text-ink text-[1rem] leading-[1.62] italic">
            {t('order.emptySheet')}
          </p>
          <button
            type="button"
            onClick={onBrowse}
            className="font-mono border-ink-faint/50 text-ink hover:border-marker hover:text-marker mt-5 cursor-pointer border px-4 py-2 text-[0.72rem] tracking-[0.12em] uppercase transition-colors"
          >
            {t('order.toFirstChapter')}
          </button>
        </div>
      ) : (
        <ul className="relative mt-6 space-y-4">
          {Object.entries(byChapter).map(([chapter, lines]) => (
            <li key={chapter}>
              <p className="rubric text-[0.6rem]">{chapter}</p>
              <ul className="mt-1.5 space-y-1.5">
                {lines.map((line) => (
                  <li
                    key={`${line.curseId}/${line.optionId}`}
                    className="flex items-baseline gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => onRemove(line.curseId, line.optionId)}
                      aria-label={t('order.removeLine', {
                        spell: line.curseName,
                        option: line.optionLabel,
                      })}
                      className="font-mono text-ink-faint hover:text-marker shrink-0 cursor-pointer text-[0.9rem] transition-colors"
                    >
                      ×
                    </button>
                    <span className="min-w-0">
                      <span className="text-ink text-[0.98rem]">{line.curseName}</span>
                      <span className="text-ink-soft text-[0.85rem]">
                        {' '}
                        · {line.optionLabel}
                      </span>
                    </span>
                    <span className="leader" aria-hidden="true" />
                    <span className="font-mono text-ink shrink-0 text-[0.88rem]">
                      {line.unitAmount == null
                        ? '—'
                        : formatMoney(line.unitAmount, line.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <div className="border-ink-faint/30 relative mt-auto border-t pt-4">
        <div className="flex items-baseline justify-between">
          <span className="rubric text-[0.62rem]">{t('order.oneTime')}</span>
          <span className="font-display text-ink text-[1.9rem] leading-none">
            {totals.known ? formatMoney(totals.dueNow) : '—'}
          </span>
        </div>

        <p className="font-mono text-ink-soft mt-3 text-[0.7rem] leading-snug">
          {t('order.footnote')}
        </p>
      </div>
    </div>
  )
}
