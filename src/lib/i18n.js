import { createContext, useContext } from 'react'
import * as catalogueRu from '../data/book.js'
import * as catalogueEn from '../data/book.en.js'

/**
 * Localisation. Two languages, resolved once on startup in this order:
 * a stored choice, then the browser's own preference, then English.
 *
 * The catalogue is translated wholesale (src/data/book.en.js), so switching
 * languages swaps the whole data module instead of re-resolving strings.
 * Everything else - the chrome, the form, the log, the document metadata -
 * lives in the message tables below.
 */
export const LANG_KEY = 'proklinator.lang'
export const DEFAULT_LANG = 'en'

export const CATALOGUES = { ru: catalogueRu, en: catalogueEn }

/**
 * Every UI string in both languages. The Russian text is the source; keys are
 * flat and stable, `{name}` placeholders are filled by `translate`.
 */
const MESSAGES = {
  ru: {
    'meta.title': 'Проклинатор - книга проклятий, которую читает агент',
    'meta.description':
      'Агент обучен на тёмных сводах: списках, что переписывали от руки, сетях без выхода наружу и книгах, которые жгли и не сожгли. Откройте главу, обведите нужное, остальное он сделает сам.',
    'meta.ogTitle': 'Проклинатор - книга проклятий, которую читает агент',
    'meta.ogDescription':
      'Книга, которую листаете вы, а слово подбирает агент. Шесть глав: помрачение, разрыв, убывание, неспокойствие, наследие, обережное.',

    'order.tab': 'Заказ',
    'order.empty': 'пусто',
    'header.backToTitle': 'К титульному листу',

    'sound.off': 'Выключить звук',
    'sound.on': 'Включить звук',
    'sound.title.on': 'Звук страниц включён',
    'sound.title.off': 'Звук страниц выключен',

    'lang.current.ru': 'Язык: русский',
    'lang.current.en': 'Язык: английский',
    'lang.screen.rubric': 'Язык',
    'lang.screen.heading': 'Выберите язык',
    'lang.screen.back': 'Назад',
    'lang.option.ru': 'Русский',
    'lang.option.en': 'Английский',

    'nav.prev': 'Предыдущий разворот',
    'nav.next': 'Следующий разворот',
    'nav.prevLabel': '‹ назад',
    'nav.nextLabel': 'вперёд ›',
    'footer.home': 'Титульный лист',
    'footer.order': 'Лист заказа',
    'footer.chapter': 'Глава {numeral}',

    'checkout.rubric': 'Оплата',
    'checkout.heading': 'Оплатить заказ',
    'checkout.intro':
      'Плата разовая, картой через Stripe. Сначала вы попадёте на страницу Stripe, после оплаты - на страницу подтверждения. Выбранное останется на листе, если вы вернётесь без оплаты.',
    'checkout.sending': 'Переход в Stripe…',
    'checkout.failed':
      'Не удалось начать оплату. Проверьте соединение и попробуйте ещё раз - выбранное не потеряно.',
    'checkout.cta.empty': 'Сначала выберите проклятие',
    'checkout.cta.unavailable': 'Заказы временно недоступны',
    'checkout.cta.pay': 'Оплатить {amount}',
    'checkout.stripeNote':
      'Оплата картой через Stripe. После оплаты агент берёт слово в работу.',

    'success.rubric': 'Оплата',
    'success.heading': 'Оплата прошла',
    'success.body':
      'Заказ принят, и агент берёт слово в работу. Квитанция уйдёт от Stripe, а дальше всё делает он.',
    'success.back': 'Вернуться к книге',

    'order.summaryRubric': 'Лист заказа',
    'order.yourChoice': 'Ваш выбор',
    'order.emptySheet':
      'Пока пусто. Откройте любую главу и обведите нужное: оно ляжет сюда, и агент узнает об этом раньше вас.',
    'order.toFirstChapter': 'К первой главе',
    'order.removeLine': 'Убрать: {spell}, {option}',
    'order.oneTime': 'Разовый платёж',
    'order.footnote':
      'Плата разовая и назад не берётся. До перехода в Stripe вы можете менять выбор.',

    'title.rubric': 'Свод',
    'title.chapters': 'Глав',
    'title.curses': 'Проклятий',
    'title.from': 'Цена от',

    'contents.rubric': 'Оглавление',
    'contents.heading': 'Что в книге',
    'contents.count': '{count} проклятия · от {amount}',
    'contents.how': 'Как это работает',
    'contents.orderSheet': 'Лист заказа',

    'price.free': 'включено',
    'spell.tiers': 'Тарифы: {name}',
    'chapter.rubric': 'Глава {numeral}',

    'bookmarks.past': 'Пройденные главы',
    'bookmarks.all': 'Главы книги',
  },

  en: {
    'meta.title': 'Proklinator - a book of curses read by an AI',
    'meta.description':
      'Trained on dark ledgers: lists copied by hand, networks with no way out, and books that were burned and yet did not burn. Open a chapter, circle what you need - the rest it does itself.',
    'meta.ogTitle': 'Proklinator - a book of curses read by an AI',
    'meta.ogDescription':
      'A book you turn, while the AI picks the word. Six chapters: dimming, severing, waning, unrest, inheritance, warding.',

    'order.tab': 'Order',
    'order.empty': 'empty',
    'header.backToTitle': 'Back to the title page',

    'sound.off': 'Turn the sound off',
    'sound.on': 'Turn the sound on',
    'sound.title.on': 'Page sound is on',
    'sound.title.off': 'Page sound is off',

    'lang.current.ru': 'Language: Russian',
    'lang.current.en': 'Language: English',
    'lang.screen.rubric': 'Language',
    'lang.screen.heading': 'Choose a language',
    'lang.screen.back': 'Back',
    'lang.option.ru': 'Russian',
    'lang.option.en': 'English',

    'nav.prev': 'Previous spread',
    'nav.next': 'Next spread',
    'nav.prevLabel': '‹ back',
    'nav.nextLabel': 'forward ›',
    'footer.home': 'Title page',
    'footer.order': 'Order sheet',
    'footer.chapter': 'Chapter {numeral}',

    'checkout.rubric': 'Payment',
    'checkout.heading': 'Pay for the order',
    'checkout.intro':
      'The fee is one-time, paid by card through Stripe. First you will go to the Stripe page, after payment - to the confirmation page. Your selection stays on the sheet if you come back without paying.',
    'checkout.sending': 'Going to Stripe…',
    'checkout.failed':
      'Could not start the payment. Check your connection and try again - your selection is not lost.',
    'checkout.cta.empty': 'Choose a curse first',
    'checkout.cta.unavailable': 'Orders are temporarily unavailable',
    'checkout.cta.pay': 'Pay {amount}',
    'checkout.stripeNote':
      'Paid by card through Stripe. After payment the agent takes the word to work.',

    'success.rubric': 'Payment',
    'success.heading': 'Payment received',
    'success.body':
      'The order is accepted and the AI takes the word to work. The receipt will come from Stripe, and from then on it does everything.',
    'success.back': 'Return to the book',

    'order.summaryRubric': 'Order sheet',
    'order.yourChoice': 'Your choice',
    'order.emptySheet':
      'Empty for now. Open any chapter and circle what you need: it will land here, and the AI will know about it before you do.',
    'order.toFirstChapter': 'To the first chapter',
    'order.removeLine': 'Remove: {spell}, {option}',
    'order.oneTime': 'One-time payment',
    'order.footnote':
      'The fee is one-time and is not taken back. You can change your selection before going to Stripe.',

    'title.rubric': 'Ledger',
    'title.chapters': 'Chapters',
    'title.curses': 'Curses',
    'title.from': 'From',

    'contents.rubric': 'Contents',
    'contents.heading': 'What is in the book',
    'contents.count': '{count} curses · from {amount}',
    'contents.how': 'How it works',
    'contents.orderSheet': 'Order sheet',

    'price.free': 'included',
    'spell.tiers': 'Tiers: {name}',
    'chapter.rubric': 'Chapter {numeral}',

    'bookmarks.past': 'Chapters behind',
    'bookmarks.all': 'Chapters of the book',
  },
}

/**
 * The stored choice wins over everything; then the browser's own preference
 * (matched on the primary subtag, so `ru-RU` and `en-US` both work); then the
 * English fallback. An unreadable or unrecognised stored value is ignored.
 */
export function resolveLanguage() {
  try {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored === 'ru' || stored === 'en') return stored
  } catch {
    // Storage unavailable: fall through to the browser preference.
  }
  for (const candidate of navigator.languages ?? []) {
    const primary = String(candidate).split('-')[0]
    if (primary === 'ru' || primary === 'en') return primary
  }
  return DEFAULT_LANG
}

export function persistLanguage(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // Private mode or a full quota: the choice simply will not survive a reload.
  }
}

/** Looks a message key up in the active language, falling back to Russian. */
export function translate(key, vars, lang) {
  const table = MESSAGES[lang] ?? MESSAGES[DEFAULT_LANG]
  let text = table[key] ?? MESSAGES.ru[key] ?? key
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, value)
    }
  }
  return text
}

export const LanguageContext = createContext(null)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
