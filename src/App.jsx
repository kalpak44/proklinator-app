import { useState } from 'react'
import { TIERS } from './data/tiers.js'
import Ornament from './components/Ornament.jsx'
import Sigil from './components/Sigil.jsx'
import BillingToggle from './components/BillingToggle.jsx'
import TierCard from './components/TierCard.jsx'
import RiteDialog from './components/RiteDialog.jsx'

export default function App() {
  const [billing, setBilling] = useState('once')
  const [selected, setSelected] = useState(null)

  return (
    <div className="grain vignette relative min-h-screen overflow-hidden">
      <div className="altar-glow absolute inset-x-0 top-0 h-[70vh]" aria-hidden="true" />

      <main className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <header className="relative text-center">
          {/* Behind the wordmark, deliberately larger than it. */}
          <Sigil className="pointer-events-none absolute top-1/2 left-1/2 w-[26rem] max-w-[85vw] -translate-x-1/2 -translate-y-1/2 sm:w-[34rem]" />

          <p className="eyebrow rise relative" style={{ animationDelay: '0ms' }}>
            Est. before records
          </p>

          <h1
            className="font-display rise relative mt-6 text-6xl leading-none tracking-[0.09em] text-bone sm:text-8xl"
            style={{ animationDelay: '80ms' }}
          >
            PROKLINATOR
          </h1>

          <div className="rise relative" style={{ animationDelay: '160ms' }}>
            <Ornament className="mt-8" />
            <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed text-ash italic">
              A porcha, properly administered, by arrangement. Choose a severity below.
              Discretion assured. Results not.
            </p>
          </div>
        </header>

        <div
          className="rise mt-16 flex justify-center"
          style={{ animationDelay: '200ms' }}
        >
          <BillingToggle value={billing} onChange={setBilling} />
        </div>

        <section className="mt-14 grid gap-6 lg:grid-cols-3" aria-label="Available rites">
          {TIERS.map((tier, i) => (
            <TierCard
              key={tier.id}
              tier={tier}
              billing={billing}
              index={i}
              onSelect={setSelected}
            />
          ))}
        </section>

        <footer className="rise mt-24 text-center" style={{ animationDelay: '700ms' }}>
          <Ornament />
          <p className="font-mono mx-auto mt-8 max-w-lg text-[0.68rem] leading-loose tracking-[0.16em] text-ash/55 uppercase">
            Payable in coin, grain or livestock. Curses are non-transferable and
            non-refundable. Proklinator accepts no liability for misfortune arriving
            early, late, or at the wrong address.
          </p>
          <p className="font-mono mt-6 text-[0.68rem] tracking-[0.2em] text-ash/40 uppercase">
            This is a joke. Nothing here is real, least of all the pricing.
          </p>
        </footer>
      </main>

      {selected && (
        <RiteDialog tier={selected} billing={billing} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
