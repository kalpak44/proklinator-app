/** Amounts are stored in euro cents, as integers, so basket sums stay exact. */
const FORMAT = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** 8900 → «89 €», 8950 → «89,5 €». */
export function formatMoney(cents) {
  return FORMAT.format(cents / 100)
}
