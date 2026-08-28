import PriceRow from './PriceRow.jsx'
import { useLanguage } from '../lib/i18n.js'

/**
 * One curse: name, a paragraph of description, and its list of options.
 *
 * The rule between entries belongs to the page, not to the block: a block has
 * to measure the same height wherever it lands, including at the top of a page
 * where there is nothing to rule it off from.
 */
export default function SpellEntry({ spell, isSelected, onToggle, optionFor }) {
  const { t } = useLanguage()

  return (
    <article>
      <h3 className="font-display text-ink text-[1.35rem] leading-tight tracking-[0.02em]">
        {spell.name}
      </h3>

      <p className="text-ink/90 mt-1.5 text-[0.95rem] leading-[1.55]">
        {spell.description}
      </p>

      <ul
        role="radiogroup"
        aria-label={t('spell.tiers', { name: spell.name })}
        className="mt-2.5 -ml-2 space-y-0.5"
      >
        {spell.prices.map((price) => (
          <PriceRow
            key={price.id}
            price={price}
            commerce={optionFor(spell.id, price.id)}
            selected={isSelected(spell.id, price.id)}
            onToggle={() => onToggle(spell.id, price.id)}
          />
        ))}
      </ul>
    </article>
  )
}
