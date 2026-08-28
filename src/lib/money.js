/**
 * Amounts arrive from the backend catalog in the smallest currency unit, as
 * integers, so basket sums stay exact. The PoC catalog is single-currency,
 * but formatting takes the currency from the backend value rather than
 * assuming it.
 */
export function formatMoney(amount, currency = 'EUR') {
  const FORMAT = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: String(currency).toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return FORMAT.format(amount / 100)
}
