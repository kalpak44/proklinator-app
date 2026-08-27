import Ornament from './Ornament.jsx'
import Sigil from './Sigil.jsx'
import { AGENT, BOOK, BOOK_STATS } from '../data/book.js'
import { formatMoney } from '../lib/money.js'

/**
 * Verso of the opening spread: the title page. It says what the book is before
 * it says what it costs, which is the one place in the app allowed to do that.
 *
 * Fixed content, like the order sheet: it is not paginated, so everything here
 * has to fit one page on its own.
 */
export default function TitlePage() {
  return (
    <div className="page-fixed relative">
      <Sigil className="pointer-events-none absolute -top-10 left-1/2 w-[26rem] max-w-[100%] -translate-x-1/2" />

      <p className="rubric relative">Свод</p>

      <h1 className="font-display text-ink relative mt-2 text-[2.6rem] leading-[0.95] tracking-[0.02em] uppercase sm:text-[3.4rem]">
        {BOOK.title}
      </h1>

      <p className="font-display text-rubric relative mt-2 text-[1.05rem] italic">
        {BOOK.subtitle}
      </p>

      <Ornament className="relative mt-4" />

      <blockquote className="border-rubric/40 text-rubric relative mt-5 border-l pl-4 text-[1.02rem] leading-[1.45] italic">
        {BOOK.epigraph}
      </blockquote>

      <p className="dropcap text-ink relative mt-4 text-[0.97rem] leading-[1.6]">
        {BOOK.about[0]}
      </p>

      <p className="text-ink/90 relative mt-3 text-[0.95rem] leading-[1.6]">
        {BOOK.about[1]}
      </p>

      {/* Who is on the other side of the order, said outright. */}
      <p className="border-rubric/30 text-ink relative mt-3 border-l pl-4 text-[0.95rem] leading-[1.55]">
        {AGENT.nature}
      </p>

      <dl className="border-ink-faint/30 relative mt-5 grid grid-cols-3 gap-x-3 border-t pt-3">
        <div>
          <dt className="rubric text-[0.6rem]">Глав</dt>
          <dd className="font-display text-ink mt-0.5 text-[1.05rem] leading-tight">
            {BOOK_STATS.chapters}
          </dd>
        </div>
        <div>
          <dt className="rubric text-[0.6rem]">Проклятий</dt>
          <dd className="font-display text-ink mt-0.5 text-[1.05rem] leading-tight">
            {BOOK_STATS.spells}
          </dd>
        </div>
        <div>
          <dt className="rubric text-[0.6rem]">Цена от</dt>
          <dd className="font-display text-ink mt-0.5 text-[1.05rem] leading-tight">
            {formatMoney(BOOK_STATS.cheapest)}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-ink-soft relative mt-3 flex items-start gap-2 text-[0.7rem] leading-snug">
        <span className="agent-dot bg-marker mt-[0.45em] size-1.5 shrink-0 rounded-full" />
        <span>
          {AGENT.name} {AGENT.version}, {AGENT.state}. {AGENT.corpus}.
        </span>
      </p>
    </div>
  )
}
