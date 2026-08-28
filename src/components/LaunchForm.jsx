import { useState } from 'react'
import { startCheckout } from '../lib/checkout.js'
import { formatMoney } from '../lib/money.js'
import Ornament from './Ornament.jsx'
import { useLanguage } from '../lib/i18n.js'

/**
 * Recto of the closing spread: the total and the way to pay it.
 *
 * Checkout sends only the selected ids and redirects to the Stripe Checkout
 * URL the backend returns. The cart is never touched here: it has to survive
 * the trip to Stripe and back, and only the success page clears it.
 */
export default function LaunchForm({ totals, items, available }) {
  const { t } = useLanguage()
  const [state, setState] = useState('idle') // idle | sending | failed

  const canPay = available && totals.count > 0 && state !== 'sending'

  const submit = async (e) => {
    e.preventDefault()
    if (!canPay) return
    setState('sending')
    try {
      await startCheckout({ items })
      // status 'redirect': the browser is already leaving for Stripe.
    } catch {
      setState('failed')
    }
  }

  return (
    <form onSubmit={submit} noValidate className="page-fixed">
      <p className="rubric">{t('checkout.rubric')}</p>

      <h2 className="font-display text-ink mt-2 text-[1.8rem] leading-[1.05] sm:text-[2.2rem]">
        {t('checkout.heading')}
      </h2>

      <p className="text-ink/90 mt-3 text-[0.95rem] leading-[1.55]">
        {t('checkout.intro')}
      </p>

      <Ornament className="mt-5" />

      {state === 'failed' && (
        <p className="font-mono text-marker mt-6 text-[0.72rem] leading-snug">
          {t('checkout.failed')}
        </p>
      )}

      <div className="mt-auto pt-6">
        <button
          type="submit"
          disabled={!canPay}
          className="font-mono border-marker bg-marker text-paper hover:bg-rubric w-full cursor-pointer border px-5 py-3 text-[0.78rem] tracking-[0.12em] uppercase transition-colors disabled:cursor-not-allowed disabled:border-ink-faint/40 disabled:bg-transparent disabled:text-ink-faint"
        >
          {state === 'sending'
            ? t('checkout.sending')
            : totals.count === 0
              ? t('checkout.cta.empty')
              : !available
                ? t('checkout.cta.unavailable')
                : t('checkout.cta.pay', { amount: formatMoney(totals.dueNow) })}
        </button>

        <p className="font-mono text-ink-soft mt-3 text-center text-[0.68rem] leading-snug">
          {t('checkout.stripeNote')}
        </p>
      </div>
    </form>
  )
}
