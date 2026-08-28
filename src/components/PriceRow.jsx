import { formatMoney } from '../lib/money.js'
import MarkerCircle from './MarkerCircle.jsx'
import { useLanguage } from '../lib/i18n.js'

/**
 * A price list row. Tiers of one curse are mutually exclusive, so this is a
 * radio rather than a checkbox: picking a second one drops the first (useCart).
 *
 * The price comes from the backend catalog — `commerce` — never from frontend
 * data. A row whose option has no backend entry yet (while the catalog loads,
 * or if the id vanished) renders as a plain line instead of a control; the
 * warding chapter's free "included" line is such a line by design.
 *
 * The wash covers the whole tier, note included, since that is what was chosen.
 * The drawn loop stays on the priced line: taking in the note underneath would
 * drop it half a line and run it through the row below.
 */
export default function PriceRow({ price, commerce, selected, onToggle }) {
  const { t } = useLanguage()

  if (!commerce) {
    return (
      <li>
        <div className="relative flex items-baseline px-2 py-[0.35rem]">
          <span className="font-body text-ink/70 relative text-[0.98rem]">
            {price.label}
          </span>
          <span className="leader" aria-hidden="true" />
          <span className="font-mono text-ink-soft relative text-[0.9rem] whitespace-nowrap">
            {price.included ? t('price.free') : '—'}
          </span>
        </div>
        <span className="text-ink-soft relative block px-2 pb-[0.35rem] text-[0.8rem] leading-snug">
          {price.note}
        </span>
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onToggle}
        className="group relative block w-full cursor-pointer px-2 py-[0.35rem] text-left"
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
            className={`font-body relative text-[0.98rem] transition-colors ${
              selected ? 'text-ink' : 'text-ink group-hover:text-marker'
            }`}
          >
            {price.label}
          </span>

          <span className="leader" aria-hidden="true" />

          <span
            className={`font-mono relative text-[0.9rem] whitespace-nowrap ${
              selected ? 'text-marker' : 'text-ink'
            }`}
          >
            {formatMoney(commerce.unitAmount, commerce.currency)}
          </span>
        </span>

        <span className="text-ink-soft relative mt-[0.1rem] block text-[0.8rem] leading-snug">
          {price.note}
        </span>
      </button>
    </li>
  )
}
