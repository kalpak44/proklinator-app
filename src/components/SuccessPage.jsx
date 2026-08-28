import { useEffect } from 'react'
import Ornament from './Ornament.jsx'
import Sigil from './Sigil.jsx'
import { useLanguage } from '../lib/i18n.js'

/**
 * The confirmation page Stripe's `success_url` lands on. Payment has gone
 * through, so the cart is cleared here — the one place this PoC knows a
 * payment happened. The book itself never clears it: a cancelled or failed
 * checkout has to leave the reader exactly where they were.
 */
export default function SuccessPage({ onClearCart }) {
  const { t } = useLanguage()

  useEffect(() => {
    onClearCart()
  }, [onClearCart])

  return (
    <div className="desk flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md bg-paper px-8 pt-10 pb-12 shadow-[0_42px_60px_rgba(0,0,0,0.68)]">
        <Sigil className="pointer-events-none absolute -top-8 left-1/2 w-40 max-w-[80%] -translate-x-1/2" />

        <p className="rubric relative">{t('success.rubric')}</p>

        <h1 className="font-display text-ink relative mt-2 text-[2rem] leading-[1.05] sm:text-[2.4rem]">
          {t('success.heading')}
        </h1>

        <Ornament className="relative mt-5" />

        <p className="text-ink/90 relative mt-6 text-[1rem] leading-[1.6]">
          {t('success.body')}
        </p>

        <a
          href="/"
          className="font-mono border-marker text-marker hover:bg-marker hover:text-paper mt-8 inline-block cursor-pointer border px-5 py-3 text-[0.78rem] tracking-[0.12em] uppercase transition-colors"
        >
          {t('success.back')}
        </a>
      </div>
    </div>
  )
}
