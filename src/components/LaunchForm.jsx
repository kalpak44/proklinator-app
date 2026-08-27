import { useEffect, useState } from 'react'
import { startCheckout } from '../lib/checkout.js'
import { formatMoney } from '../lib/money.js'
import { CONSOLE_MS, consoleLines } from '../lib/agentLog.js'
import AgentConsole from './AgentConsole.jsx'
import Ornament from './Ornament.jsx'
import TargetUpload from './TargetUpload.jsx'
import { useLanguage } from '../lib/i18n.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Recto of the closing spread: the target, the contact, and the launch. */
export default function LaunchForm({ totals, orderKeys, onLaunched }) {
  const { lang, t } = useLanguage()
  const [photo, setPhoto] = useState(null)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [touched, setTouched] = useState(false)
  const [state, setState] = useState('form')
  const [result, setResult] = useState(null)

  // An object URL lives until revoked, otherwise the photo stays in tab memory.
  useEffect(() => {
    return () => {
      if (photo?.url) URL.revokeObjectURL(photo.url)
    }
  }, [photo])

  const pickPhoto = (file) => {
    if (photo?.url) URL.revokeObjectURL(photo.url)
    setPhoto({ url: URL.createObjectURL(file), name: file.name })
  }

  const clearPhoto = () => {
    if (photo?.url) URL.revokeObjectURL(photo.url)
    setPhoto(null)
  }

  const emailValid = EMAIL.test(email.trim())
  const ready = totals.count > 0 && photo && emailValid && consent

  const submit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (!ready) return

    setState('running')
    const [checkout] = await Promise.all([
      startCheckout({ keys: orderKeys, contact: { email: email.trim() }, locale: lang }),
      wait(CONSOLE_MS),
    ])

    // On status === 'redirect' the browser is already leaving for Stripe.
    if (checkout.status === 'redirect') return

    setResult(checkout)
    setState('done')
    onLaunched()
  }

  if (state === 'running' || state === 'done') {
    return (
      <div className="page-fixed">
        <p className="rubric">{t('launch.rubric')}</p>
        <h2 className="font-display text-ink mt-2 text-[1.8rem] leading-[1.05] sm:text-[2.2rem]">
          {state === 'running' ? t('launch.accepted') : t('launch.started')}
        </h2>

        <Ornament className="mt-5" />

        <div className="mt-6">
          <AgentConsole
            lines={consoleLines({
              fileName: photo?.name ?? t('log.anonymous'),
              count: totals.count,
              lang,
            })}
          />
        </div>

        {state === 'done' && (
          <div className="rise mt-6">
            <p className="text-ink text-[1rem] leading-[1.62]">
              {t('launch.referenceBefore')}
              <span className="font-mono text-marker">{result.reference}</span>
              {t('launch.referenceAfter')}
              <span className="italic">{email.trim()}</span>
              {t('launch.referenceTail')}
            </p>
            <p className="font-mono text-ink-soft mt-4 text-[0.72rem] leading-snug">
              {t('launch.erasure')}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="page-fixed">
      <p className="rubric">{t('launch.rubric')}</p>
      <h2 className="font-display text-ink mt-2 text-[1.8rem] leading-[1.05] sm:text-[2.2rem]">
        {t('launch.handover')}
      </h2>

      <p className="text-ink/90 mt-3 text-[0.95rem] leading-[1.55]">
        {t('launch.intro')}
      </p>

      <Ornament className="mt-5" />

      <div className="mt-6 space-y-5">
        <TargetUpload photo={photo} onPick={pickPhoto} onClear={clearPhoto} />
        {touched && !photo && (
          <p className="font-mono text-marker text-[0.72rem]">{t('launch.faceNeeded')}</p>
        )}

        <label className="block">
          <span className="rubric text-[0.62rem]">{t('launch.emailLabel')}</span>

          {/* A full 1rem and not a hair under: below 900px the root is 16px, and
              iOS Safari zooms the whole page in on a focused field set smaller
              than that, leaving the book cropped and off-centre behind it. */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border-ink-faint/50 text-ink placeholder:text-ink-faint focus:border-marker mt-1.5 w-full border bg-transparent px-3 py-2.5 text-[1rem] focus:outline-none"
          />
          {touched && !emailValid && (
            <span className="font-mono text-marker mt-1 block text-[0.72rem]">
              {t('launch.emailInvalid')}
            </span>
          )}
        </label>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="accent-marker mt-[0.2rem] size-4 shrink-0 cursor-pointer"
          />
          <span className="text-ink-soft text-[0.82rem] leading-snug">
            {t('launch.consent')}
          </span>
        </label>
      </div>

      <div className="mt-auto pt-6">
        <button
          type="submit"
          disabled={totals.count === 0}
          className="font-mono border-marker bg-marker text-paper hover:bg-rubric w-full cursor-pointer border px-5 py-3 text-[0.78rem] tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed disabled:border-ink-faint/40 disabled:bg-transparent disabled:text-ink-faint"
        >
          {totals.count === 0
            ? t('launch.cta.empty')
            : t('launch.cta.pay', { amount: formatMoney(totals.dueNow) })}
        </button>

        <p className="font-mono text-ink-soft mt-3 text-center text-[0.68rem] leading-snug">
          {t('launch.stripeNote')}
        </p>
      </div>
    </form>
  )
}
