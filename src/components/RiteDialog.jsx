import { useEffect, useRef } from 'react'
import { BILLING } from '../data/tiers.js'
import Ornament from './Ornament.jsx'

export default function RiteDialog({ tier, billing, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const price = billing === 'once' ? tier.once : tier.monthly

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rite-title"
    >
      <button
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-void/92 backdrop-blur-[3px]"
      />

      <div className="rise relative w-full max-w-md border border-brass/30 bg-ink p-9 text-center">
        <p className="eyebrow">Обряд принят в работу</p>

        <h2 id="rite-title" className="font-display mt-4 text-3xl text-bone">
          {tier.name}
        </h2>

        <Ornament className="my-6" />

        <p className="text-[1.1rem] leading-relaxed text-ash">
          «<span className="text-bone italic">{tier.subtitle}</span>» внесён в книгу учёта
          на сумму{' '}
          <span className="font-mono text-brass">
            €{price} {BILLING[billing].suffix}
          </span>
          . Наш практикующий свяжется с вами способом, на который вы согласия не давали.
        </p>

        <p className="font-mono mt-6 border-t border-bone/10 pt-5 text-[0.66rem] leading-relaxed tracking-[0.12em] text-ash/60 uppercase">
          Оплата не принята. Порча не наложена.
          <br />
          Это шуточное приложение.
        </p>

        <button
          ref={closeRef}
          onClick={onClose}
          className="font-mono mt-7 cursor-pointer border border-brass/40 px-7 py-3 text-[0.7rem] tracking-[0.2em] text-brass uppercase transition-colors duration-300 hover:border-brass hover:bg-brass/10"
        >
          Да будет так
        </button>
      </div>
    </div>
  )
}
