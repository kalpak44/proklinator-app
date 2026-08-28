import PriceRow from './PriceRow.jsx'
import Ornament from './Ornament.jsx'
import { useLanguage } from '../lib/i18n.js'

/**
 * One story block of a curse. The curse is a short multi-page chapter: a
 * legend, an origin, the objects and their symbolism, alleged accounts, a
 * modern investigation, an occasional note from the machine, and a closing
 * choice that feeds the order sheet.
 *
 * Sections are measured like every other block, so none of them may assume it
 * will share its page with anything else.
 */
export default function StorySection({ block, isSelected, onToggle, optionFor }) {
  const { spell, section } = block
  switch (section.kind) {
    case 'account':
      return <AccountSection block={block} />
    case 'ai':
      return <AiSection section={section} />
    case 'effect':
      return (
        <EffectSection
          spell={spell}
          section={section}
          isSelected={isSelected}
          onToggle={onToggle}
          optionFor={optionFor}
        />
      )
    default:
      return <ProseSection block={block} />
  }
}

/** Legend, origin, objects, modern investigation: rubric heading and prose. */
function ProseSection({ block }) {
  const { t } = useLanguage()
  const { spell, section } = block
  const opening = section.kind === 'legend'

  return (
    <section className="relative">
      <p className="rubric relative">{t(`story.${section.kind}`)}</p>

      {opening && (
        <>
          <h3 className="font-display text-ink relative mt-2 text-[1.35rem] leading-tight tracking-[0.02em]">
            {spell.name}
          </h3>
          <p className="dropcap text-ink relative mt-2 text-[0.97rem] leading-[1.6]">
            {spell.description}
          </p>
        </>
      )}

      {section.body.map((paragraph, i) => (
        <p key={i} className="text-ink/90 relative mt-3 text-[0.95rem] leading-[1.6]">
          {paragraph}
        </p>
      ))}
    </section>
  )
}

/**
 * One alleged case: the source it is attributed to, set as an archival line,
 * and the account itself. Only the first account of a curse carries the
 * section rubric; the source line then leads each page on its own.
 */
function AccountSection({ block }) {
  const { t } = useLanguage()
  const { section, heading } = block

  return (
    <section className="relative">
      {heading && <p className="rubric relative">{t('story.accounts')}</p>}

      <p className="font-mono text-rubric relative mt-3 text-[0.68rem] tracking-[0.12em] uppercase">
        {section.source}
      </p>

      <blockquote className="text-ink relative mt-1.5 text-[0.95rem] leading-[1.6]">
        {section.text}
      </blockquote>
    </section>
  )
}

/**
 * The occasional modern aside: where the machine enters the story. Kept apart
 * from the prose so a digitised archive can interrupt the ancient narrative
 * instead of being absorbed into it.
 */
function AiSection({ section }) {
  const { t } = useLanguage()

  return (
    <aside className="border-rubric/40 relative border-l-2 py-1 pl-4 pr-1">
      <p className="font-mono text-rubric flex items-center gap-2 text-[0.66rem] tracking-[0.16em] uppercase">
        <span className="agent-dot bg-marker size-1.5 shrink-0 rounded-full" />
        {t('story.aiRubric')}
      </p>
      <p className="text-ink/90 relative mt-1.5 text-[0.95rem] leading-[1.6] italic">
        {section.body}
      </p>
    </aside>
  )
}

/**
 * The closing section of a curse: the choice. The tier list is the same radio
 * the price list always was - marking one circles it in marker and drops it
 * onto the order sheet - so the story hands over to the commerce without
 * leaving the book. The fictionality note closes the chapter.
 */
function EffectSection({ spell, section, isSelected, onToggle, optionFor }) {
  const { t } = useLanguage()

  return (
    <section className="relative">
      <p className="rubric relative">{t('story.effect')}</p>

      <h3 className="font-display text-ink relative mt-2 text-[1.35rem] leading-tight tracking-[0.02em]">
        {spell.name}
      </h3>

      {section.intro.map((paragraph, i) => (
        <p key={i} className="text-ink/90 relative mt-3 text-[0.95rem] leading-[1.6]">
          {paragraph}
        </p>
      ))}

      <p className="font-mono text-ink-soft relative mt-4 text-[0.72rem] leading-snug">
        {t('story.choose')}
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

      <Ornament className="relative mt-5" />

      <p className="font-mono text-ink-faint relative mt-3 border-t border-ink-faint/30 pt-2 text-[0.68rem] leading-snug">
        {t('story.disclaimer')}
      </p>
    </section>
  )
}
