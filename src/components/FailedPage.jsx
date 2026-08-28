import Ornament from './Ornament.jsx'
import Sigil from './Sigil.jsx'
import { useLanguage } from '../lib/i18n.js'

/**
 * Where Stripe's `cancel_url` lands when a checkout is cancelled, abandoned or
 * fails before completion. The payment was not confirmed, and that has to stay
 * unmistakable: this is a failed rite, not a pending one. The cart is left
 * untouched, so "try paying again" goes straight back to the order sheet.
 */
export default function FailedPage() {
  const { t } = useLanguage()

  return (
    <div className="rise desk flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md bg-paper px-8 pt-10 pb-12 shadow-[0_42px_60px_rgba(0,0,0,0.68)]">
        <Sigil className="pointer-events-none absolute -top-8 left-1/2 w-40 max-w-[80%] -translate-x-1/2" />

        <p className="rubric relative">{t('failed.rubric')}</p>

        <h1 className="font-display text-ink relative mt-2 text-[2rem] leading-[1.05] sm:text-[2.4rem]">
          {t('failed.heading')}
        </h1>

        <p className="font-mono border-marker text-marker relative mt-5 inline-block border px-3 py-1.5 text-[0.68rem] tracking-[0.16em] uppercase">
          {t('failed.status')}
        </p>

        <Ornament className="relative mt-5" />

        <p className="text-ink/90 relative mt-5 text-[1rem] leading-[1.6]">
          {t('failed.body')}
        </p>

        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/?page=order"
            className="font-mono border-marker bg-marker text-paper hover:bg-rubric flex-1 cursor-pointer border px-5 py-3 text-center text-[0.78rem] tracking-[0.12em] uppercase transition-colors"
          >
            {t('failed.retry')}
          </a>
          <a
            href="/"
            className="font-mono border-ink-faint/50 text-ink hover:border-marker hover:text-marker cursor-pointer border px-5 py-3 text-center text-[0.78rem] tracking-[0.12em] uppercase transition-colors"
          >
            {t('failed.back')}
          </a>
        </div>
      </div>
    </div>
  )
}
