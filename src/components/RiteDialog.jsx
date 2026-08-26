import { useEffect, useRef, useState } from 'react'
import { BILLING } from '../data/tiers.js'
import Ornament from './Ornament.jsx'
import Sigil from './Sigil.jsx'
import TargetUpload from './TargetUpload.jsx'

const PHASES = [
  'Устанавливаем связь…',
  'Определяем объект по изображению…',
  'Наводим порчу…',
  'Скрепляем печатью…',
]

const PHASE_MS = 850

export default function RiteDialog({ tier, billing, onClose }) {
  const [step, setStep] = useState('target')
  const [phase, setPhase] = useState(0)
  const [photo, setPhoto] = useState(null)
  const [name, setName] = useState('')
  const closeRef = useRef(null)

  // Escape closes — except mid-ritual, where there is no way out but through.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && step !== 'casting') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, step])

  // Object URLs are leaked unless explicitly revoked.
  useEffect(() => {
    return () => {
      if (photo?.url) URL.revokeObjectURL(photo.url)
    }
  }, [photo])

  // Walk the phases, then land on the confirmation.
  useEffect(() => {
    if (step !== 'casting') return
    const timers = PHASES.map((_, i) => setTimeout(() => setPhase(i), i * PHASE_MS))
    timers.push(setTimeout(() => setStep('done'), PHASES.length * PHASE_MS + 400))
    return () => timers.forEach(clearTimeout)
  }, [step])

  useEffect(() => {
    if (step === 'done') closeRef.current?.focus()
  }, [step])

  const price = billing === 'once' ? tier.once : tier.monthly
  const target = name.trim() || 'Объект'

  const pickPhoto = (file) => {
    if (photo?.url) URL.revokeObjectURL(photo.url)
    setPhoto({ url: URL.createObjectURL(file), fileName: file.name })
  }

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
        disabled={step === 'casting'}
        className="absolute inset-0 cursor-default bg-void/92 backdrop-blur-[3px] disabled:cursor-wait"
      />

      <div
        className={`rise relative w-full max-w-md border bg-ink p-9 text-center ${
          step === 'casting'
            ? `pulse-ember border-ember/60 shudder-${phase}`
            : 'border-brass/30'
        }`}
      >
        {/* ---- Step 1: pick the target ---- */}
        {step === 'target' && (
          <>
            <p className="eyebrow">Шаг 1 — объект</p>

            <h2 id="rite-title" className="font-display mt-4 text-3xl text-bone">
              {tier.name}
            </h2>

            <Ornament className="my-6" />

            <TargetUpload
              photoUrl={photo?.url}
              fileName={photo?.fileName}
              onPick={pickPhoto}
            />

            <label className="mt-5 block text-left">
              <span className="font-mono block text-[0.72rem] tracking-[0.12em] text-ash uppercase">
                Имя объекта — необязательно
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Кого проклинаем?"
                className="mt-2 w-full border border-brass/25 bg-void/50 px-4 py-3 text-[1.05rem] text-bone placeholder:text-ash/50 focus:border-ember focus:outline-none"
              />
            </label>

            <button
              onClick={() => setStep('casting')}
              disabled={!photo}
              className="font-mono mt-7 w-full cursor-pointer border border-ember bg-ember/90 px-7 py-3 text-[0.78rem] tracking-[0.1em] text-bone uppercase transition-colors duration-300 hover:bg-ember disabled:cursor-not-allowed disabled:border-ash/25 disabled:bg-transparent disabled:text-ash/50"
            >
              {photo ? 'Наложить порчу' : 'Сначала выберите фотографию'}
            </button>
          </>
        )}

        {/* ---- Step 2: the wait ---- */}
        {step === 'casting' && (
          <div aria-live="polite" aria-busy="true">
            <p className="eyebrow text-ember-soft">Идёт обряд — не закрывайте</p>

            <div className="relative mx-auto mt-7 h-40 w-40">
              <img
                src={photo.url}
                alt=""
                className="h-40 w-40 border border-ember/40 object-cover grayscale contrast-125"
              />
              <div
                className="absolute inset-0 bg-ember mix-blend-multiply"
                style={{ opacity: 0.15 + phase * 0.18 }}
                aria-hidden="true"
              />
              <Sigil className="absolute inset-0 h-full w-full !opacity-70" />
            </div>

            <p className="font-display mt-7 text-xl text-bone">{PHASES[phase]}</p>

            <div className="mt-5 h-[3px] w-full bg-bone/10" aria-hidden="true">
              <div
                className="h-full bg-ember transition-all duration-700 ease-out"
                style={{ width: `${((phase + 1) / PHASES.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ---- Step 3: it is done ---- */}
        {step === 'done' && (
          <>
            <p className="eyebrow text-ember-soft">Порча отправлена</p>

            <h2 id="rite-title" className="font-display mt-4 text-3xl text-bone">
              {tier.name}
            </h2>

            <Ornament className="my-6" />

            <p className="text-[1.15rem] leading-relaxed text-bone/90">
              <span className="italic">{target}</span> уже в списке. Порча настигнет его в
              ближайшие дни — точный срок зависит от погоды и расположения светил.
            </p>

            <p className="mt-4 text-[1.05rem] leading-relaxed text-ash">
              Тариф «{tier.subtitle}»,{' '}
              <span className="font-mono text-brass">
                €{price} {BILLING[billing].suffix}
              </span>
              . Наш практикующий свяжется с вами способом, на который вы согласия не
              давали.
            </p>

            <p className="font-mono mt-6 border-t border-bone/10 pt-5 text-[0.72rem] leading-relaxed tracking-[0.06em] text-ash">
              Оплата не принята. Порча не наложена. Фотография никуда не отправлялась. Это
              шуточное приложение.
            </p>

            <button
              ref={closeRef}
              onClick={onClose}
              className="font-mono mt-7 cursor-pointer border border-brass/40 px-7 py-3 text-[0.78rem] tracking-[0.1em] text-brass uppercase transition-colors duration-300 hover:border-brass hover:bg-brass/10"
            >
              Да будет так
            </button>
          </>
        )}
      </div>
    </div>
  )
}
