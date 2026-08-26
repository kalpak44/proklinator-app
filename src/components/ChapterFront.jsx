import Ornament from './Ornament.jsx'
import Sigil from './Sigil.jsx'
import { AGENT } from '../data/book.js'

/**
 * The chapter frontispiece block: heading, opening paragraph, the numbers that
 * apply to every curse in the chapter, and what the agent does on its own.
 *
 * It flows like any other block, because pagination measures it and decides how
 * much of the chapter fits on the page underneath it.
 */
export default function ChapterFront({ chapter }) {
  return (
    <section className="relative">
      <Sigil className="pointer-events-none absolute -top-8 left-1/2 w-[22rem] max-w-[95%] -translate-x-1/2" />

      <p className="rubric relative">Глава {chapter.numeral}</p>

      <h2 className="font-display text-ink relative mt-2 text-[2rem] leading-[1.05] tracking-[0.02em] sm:text-[2.6rem]">
        {chapter.title}
      </h2>

      <p className="font-display text-rubric relative mt-1 text-[1.05rem] italic">
        {chapter.subtitle}
      </p>

      <Ornament className="relative mt-4" />

      {/* A line from the corpus the agent was trained on, set as an epigraph. */}
      <blockquote className="border-rubric/40 text-rubric relative mt-5 border-l pl-4 text-[1.02rem] leading-[1.45] italic">
        {chapter.epigraph}
      </blockquote>

      <p className="dropcap text-ink relative mt-4 text-[0.97rem] leading-[1.6]">
        {chapter.intro}
      </p>

      <p className="text-ink/90 relative mt-3 text-[0.95rem] leading-[1.6]">
        {chapter.lore}
      </p>

      <dl className="border-ink-faint/30 relative mt-5 grid grid-cols-3 gap-x-3 border-t pt-3">
        {chapter.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="rubric text-[0.6rem]">{stat.label}</dt>
            <dd className="font-display text-ink mt-0.5 text-[1.05rem] leading-tight">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="font-mono text-ink-soft relative mt-3 flex items-start gap-2 text-[0.7rem] leading-snug">
        <span className="agent-dot bg-marker mt-[0.45em] size-1.5 shrink-0 rounded-full" />
        <span>
          Агент {AGENT.version}. {chapter.agentNote}
        </span>
      </p>
    </section>
  )
}
