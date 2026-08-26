import { BILLING } from '../data/tiers.js'

const MODES = [BILLING.once, BILLING.monthly]

export default function BillingToggle({ value, onChange }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Способ оплаты"
        className="inline-flex rounded-sm border border-brass/25 bg-ink/60 p-1"
      >
        {MODES.map((mode) => {
          const active = value === mode.id
          return (
            <button
              key={mode.id}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(mode.id)}
              className={`font-mono cursor-pointer px-5 py-2 text-[0.8rem] tracking-[0.12em] uppercase transition-colors duration-300 ${
                active ? 'bg-ember/90 text-bone' : 'text-ash hover:text-bone'
              }`}
            >
              {mode.label}
            </button>
          )
        })}
      </div>
      <p className="font-mono text-[0.78rem] tracking-[0.12em] text-ash">
        {BILLING[value].note}
      </p>
    </div>
  )
}
