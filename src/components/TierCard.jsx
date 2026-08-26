import { BILLING } from '../data/tiers.js'

function Mark({ struck }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-[0.45rem] block size-[5px] shrink-0 rotate-45 ${
        struck ? 'bg-ash/35' : 'bg-brass'
      }`}
    />
  )
}

export default function TierCard({ tier, billing, index, onSelect }) {
  const price = billing === 'once' ? tier.once : tier.monthly
  const featured = Boolean(tier.featured)

  return (
    <article
      className={`rise relative flex flex-col border p-8 transition-colors duration-500 ${
        featured
          ? 'border-ember/45 bg-crypt shadow-[0_0_60px_-20px_rgba(194,65,42,0.5)]'
          : 'border-bone/10 bg-ink/70 hover:border-brass/30'
      }`}
      style={{ animationDelay: `${240 + index * 120}ms` }}
    >
      {featured && (
        <span className="font-mono absolute -top-[9px] left-8 bg-ember px-3 py-[3px] text-[0.6rem] tracking-[0.24em] text-bone uppercase">
          Most requested
        </span>
      )}

      <header>
        <h3 className="font-display text-2xl tracking-[0.06em] text-bone">{tier.name}</h3>
        <p className="font-mono mt-1 text-[0.65rem] tracking-[0.26em] text-ash uppercase">
          {tier.latin}
        </p>
      </header>

      <p className="mt-5 min-h-[3.5rem] text-[1.05rem] leading-relaxed text-ash italic">
        {tier.blurb}
      </p>

      <div className="mt-6 flex items-baseline gap-2 border-t border-bone/8 pt-6">
        <span className="font-display text-5xl text-bone">
          <span className="text-brass">€</span>
          {price}
        </span>
        <span className="font-mono text-[0.68rem] tracking-[0.16em] text-ash">
          {BILLING[billing].suffix}
        </span>
      </div>

      <dl className="font-mono mt-5 grid grid-cols-2 gap-y-2 text-[0.66rem] tracking-[0.14em] uppercase">
        <dt className="text-ash/60">Potency</dt>
        <dd className="text-right text-brass">{tier.potency}</dd>
        <dt className="text-ash/60">Duration</dt>
        <dd className="text-right text-brass">{tier.duration}</dd>
      </dl>

      <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-bone/8 pt-6 text-[1.02rem] leading-snug">
        {tier.features.map((f) => (
          <li key={f} className="flex gap-3 text-bone/85">
            <Mark />
            {f}
          </li>
        ))}
        {tier.excluded.map((f) => (
          <li key={f} className="flex gap-3 text-ash/45 line-through">
            <Mark struck />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(tier)}
        className={`font-mono mt-8 cursor-pointer border px-6 py-3 text-[0.7rem] tracking-[0.24em] uppercase transition-all duration-300 ${
          featured
            ? 'border-ember bg-ember/90 text-bone hover:bg-ember'
            : 'border-brass/40 text-brass hover:border-brass hover:bg-brass/10'
        }`}
      >
        Commission the rite
      </button>
    </article>
  )
}
