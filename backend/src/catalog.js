/**
 * The curses catalog — hardcoded, in-memory, and the single source of truth
 * for everything commerce-related. Only commerce fields live here: stable ids
 * shared with the frontend, backend-owned names used on the Stripe invoice,
 * and prices in the smallest currency unit.
 *
 * The frontend keeps its own presentation content (localized names, notes,
 * translations) and maps it to these entities by id. Nothing here is localized;
 * the Russian source names are the ones the buyer sees on the Stripe page.
 *
 * One-time purchases only: there are no recurring options, and nothing here
 * costs zero — a free "included" line is presentation, not commerce.
 *
 * `unitAmount` is in the smallest currency unit (euro cents). The whole
 * catalog shares one currency, which is what lets a cart always be a single
 * Stripe Checkout Session.
 */
export const CURRENCY = 'eur'

export const CURSES = [
  {
    id: 'veil',
    name: 'Серая пелена',
    options: [
      { id: 'once', name: 'Касание', unitAmount: 1900, currency: CURRENCY },
      { id: 'week', name: 'Наваждение', unitAmount: 4900, currency: CURRENCY },
    ],
  },
  {
    id: 'misstep',
    name: 'Ложный шаг',
    options: [
      { id: 'once', name: 'Касание', unitAmount: 2400, currency: CURRENCY },
      { id: 'wide', name: 'Наваждение', unitAmount: 5900, currency: CURRENCY },
    ],
  },
  {
    id: 'hum',
    name: 'Тихий шум',
    options: [
      { id: 'once', name: 'Касание', unitAmount: 1500, currency: CURRENCY },
      { id: 'month', name: 'Наваждение', unitAmount: 4400, currency: CURRENCY },
    ],
  },
  {
    id: 'drift',
    name: 'Расхождение',
    options: [
      { id: 'cycle', name: 'Работа', unitAmount: 8900, currency: CURRENCY },
      { id: 'deep', name: 'До основания', unitAmount: 16900, currency: CURRENCY },
    ],
  },
  {
    id: 'cold-side',
    name: 'Холодная сторона',
    options: [
      { id: 'cycle', name: 'Работа', unitAmount: 7900, currency: CURRENCY },
      { id: 'deep', name: 'До основания', unitAmount: 14900, currency: CURRENCY },
    ],
  },
  {
    id: 'empty-circle',
    name: 'Пустой круг',
    options: [{ id: 'cycle', name: 'Работа', unitAmount: 11900, currency: CURRENCY }],
  },
  {
    id: 'leaking-hand',
    name: 'Дырявая горсть',
    options: [
      { id: 'cycle', name: 'Работа', unitAmount: 8900, currency: CURRENCY },
      { id: 'deep', name: 'До основания', unitAmount: 17900, currency: CURRENCY },
    ],
  },
  {
    id: 'still-water',
    name: 'Стоячая вода',
    options: [{ id: 'cycle', name: 'Работа', unitAmount: 14900, currency: CURRENCY }],
  },
  {
    id: 'reversal',
    name: 'Обратный ход',
    options: [
      { id: 'point', name: 'Касание', unitAmount: 6900, currency: CURRENCY },
      { id: 'cycle', name: 'Работа', unitAmount: 13900, currency: CURRENCY },
    ],
  },
  {
    id: 'fourth-hour',
    name: 'Четвёртый час',
    options: [
      { id: 'once', name: 'Касание', unitAmount: 2400, currency: CURRENCY },
      { id: 'week', name: 'Наваждение', unitAmount: 6900, currency: CURRENCY },
    ],
  },
  {
    id: 'scatter',
    name: 'Рассеяние',
    options: [
      { id: 'once', name: 'Касание', unitAmount: 2900, currency: CURRENCY },
      { id: 'cycle', name: 'Работа', unitAmount: 6400, currency: CURRENCY },
    ],
  },
  {
    id: 'borrowed-dreams',
    name: 'Чужие сны',
    options: [
      { id: 'once', name: 'Касание', unitAmount: 3400, currency: CURRENCY },
      { id: 'series', name: 'Наваждение', unitAmount: 9900, currency: CURRENCY },
    ],
  },
  {
    id: 'long-shadow',
    name: 'Долгая тень',
    options: [{ id: 'cycle', name: 'Работа', unitAmount: 69000, currency: CURRENCY }],
  },
  {
    id: 'name-seal',
    name: 'Печать имени',
    options: [
      { id: 'cycle', name: 'Работа', unitAmount: 49000, currency: CURRENCY },
      { id: 'perm', name: 'Навсегда', unitAmount: 89000, currency: CURRENCY },
    ],
  },
  {
    id: 'irreversible',
    name: 'Необратимость',
    options: [{ id: 'once', name: 'Печать', unitAmount: 24900, currency: CURRENCY }],
  },
  {
    id: 'circle',
    name: 'Круг заказчика',
    options: [{ id: 'order', name: 'Работа', unitAmount: 8900, currency: CURRENCY }],
  },
  {
    id: 'return',
    name: 'Возврат',
    options: [{ id: 'once', name: 'Немедля', unitAmount: 6900, currency: CURRENCY }],
  },
]
