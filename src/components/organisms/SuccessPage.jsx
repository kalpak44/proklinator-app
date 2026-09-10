import { useEffect } from 'react'
import Ornament from '../atoms/Ornament.jsx'
import Sigil from '../atoms/Sigil.jsx'
import SheetHeading from '../atoms/SheetHeading.jsx'
import LineName from '../molecules/LineName.jsx'
import { useLanguage } from '../../lib/i18n.js'

/**
 * The confirmation page the processing sequence hands over to. Payment has
 * gone through, so the cart is cleared here — the one place this PoC knows a
 * payment happened. The book itself never clears it: a cancelled or failed
 * checkout has to leave the reader exactly where they were.
 *
 * `order` is the presentation side of what was paid for, captured on `/success`
 * before the cart is cleared, so the confirmation can name the curses.
 */
export default function SuccessPage({ order = [], onClearCart }) {
  const { t } = useLanguage()

  useEffect(() => {
    onClearCart()
  }, [onClearCart])

  return (
    <div className="rise desk flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-md bg-paper px-8 pt-10 pb-12 shadow-[0_42px_60px_rgba(0,0,0,0.68)]">
        <Sigil className="pointer-events-none absolute -top-8 left-1/2 w-40 max-w-[80%] -translate-x-1/2" />

        <SheetHeading rubric={t('success.rubric')} title={t('success.heading')} />

        <Ornament className="relative mt-5" />

        <p className="text-ink/90 relative mt-6 text-[1rem] leading-[1.6]">
          {t('success.body')}
        </p>

        {order.length > 0 && (
          <ul className="relative mt-6 space-y-1.5">
            {order.map((line) => (
              <li
                key={`${line.curseId}/${line.optionId}`}
                className="flex items-baseline gap-2"
              >
                <LineName curseName={line.curseName} optionLabel={line.optionLabel} />
                <span className="leader" aria-hidden="true" />
                <span className="font-mono text-marker shrink-0 text-[0.68rem] tracking-[0.14em] uppercase">
                  {t('success.sealed')}
                </span>
              </li>
            ))}
          </ul>
        )}

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
