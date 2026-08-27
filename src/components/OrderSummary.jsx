import { formatMoney } from '../lib/money.js'
import Ornament from './Ornament.jsx'
import Sigil from './Sigil.jsx'

/** Verso of the closing spread: exactly what is being handed to the agent. */
export default function OrderSummary({ totals, onRemove, onBrowse }) {
  const byChapter = totals.lines.reduce((acc, line) => {
    ;(acc[line.chapterTitle] ??= []).push(line)
    return acc
  }, {})

  return (
    <div className="page-fixed relative">
      <Sigil className="pointer-events-none absolute -top-6 left-1/2 w-[22rem] max-w-[95%] -translate-x-1/2" />

      <p className="rubric relative">Лист заказа</p>

      <h2 className="font-display text-ink relative mt-2 text-[2rem] leading-[1.05] sm:text-[2.6rem]">
        Ваш выбор
      </h2>

      <Ornament className="relative mt-5" />

      {totals.count === 0 ? (
        <div className="relative mt-8">
          <p className="text-ink text-[1rem] leading-[1.62] italic">
            Пока пусто. Откройте любую главу и обведите нужное: оно ляжет сюда, и агент
            узнает об этом раньше вас.
          </p>
          <button
            type="button"
            onClick={onBrowse}
            className="font-mono border-ink-faint/50 text-ink hover:border-marker hover:text-marker mt-5 cursor-pointer border px-4 py-2 text-[0.72rem] tracking-[0.12em] uppercase transition-colors"
          >
            К первой главе
          </button>
        </div>
      ) : (
        <ul className="relative mt-6 space-y-4">
          {Object.entries(byChapter).map(([chapter, lines]) => (
            <li key={chapter}>
              <p className="rubric text-[0.6rem]">{chapter}</p>
              <ul className="mt-1.5 space-y-1.5">
                {lines.map((line) => (
                  <li key={line.key} className="flex items-baseline gap-2">
                    <button
                      type="button"
                      onClick={() => onRemove(line.key)}
                      aria-label={`Убрать: ${line.spellName}, ${line.tierLabel}`}
                      className="font-mono text-ink-faint hover:text-marker shrink-0 cursor-pointer text-[0.9rem] transition-colors"
                    >
                      ×
                    </button>
                    <span className="min-w-0">
                      <span className="text-ink text-[0.98rem]">{line.spellName}</span>
                      <span className="text-ink-soft text-[0.85rem]">
                        {' '}
                        · {line.tierLabel}
                      </span>
                    </span>
                    <span className="leader" aria-hidden="true" />
                    <span className="font-mono text-ink shrink-0 text-[0.88rem]">
                      {formatMoney(line.price)}
                      {line.recurring && (
                        <span className="text-ink-soft text-[0.75rem]"> / мес</span>
                      )}
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
          <span className="rubric text-[0.62rem]">Разовый платёж</span>
          <span className="font-display text-ink text-[1.9rem] leading-none">
            {formatMoney(totals.dueNow)}
          </span>
        </div>

        {totals.monthly > 0 && (
          <div className="mt-2 flex items-baseline justify-between">
            <span className="rubric text-[0.62rem]">Далее ежемесячно</span>
            <span className="font-display text-ink text-[1.25rem] leading-none">
              {formatMoney(totals.monthly)}
            </span>
          </div>
        )}

        <p className="font-mono text-ink-soft mt-3 text-[0.7rem] leading-snug">
          Списание после подтверждения. Неотступное снимается в один клик, разовое назад
          не берут.
        </p>
      </div>
    </div>
  )
}
