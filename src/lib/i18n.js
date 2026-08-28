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

    'processing.rubric': 'Платёж подтверждён',
    'processing.heading': 'Проклятие готовится',
    'processing.intro':
      'Платёж подтверждён — книга берёт слово. Обряд складывается сейчас; каждая строка ниже — шаг работы.',
    'processing.stage.recover': 'Восстанавливаю исходный обряд…',
    'processing.stage.examine': 'Осматриваю выбранную цель…',
    'processing.stage.archive': 'Ищу в архиве…',
    'processing.stage.fragments': 'Восстанавливаю недостающие фрагменты…',
    'processing.stage.connection': 'Налаживаю связь…',
    'processing.stage.ai': 'Реконструкция ИИ идёт…',
    'processing.stage.write': 'Пишу проклятие…',
    'processing.stage.seal': 'Запечатываю последние слова…',
    'processing.stage.spare.1': 'Сверяюсь с маргиналиями…',
    'processing.stage.spare.2': 'Сличаю списки из свода…',
    'processing.stage.spare.3': 'Привязываю слова к цели…',
    'processing.manuscript': 'Книга пишет',
    'processing.written': 'Слова запечатаны.',
    'success.sealed': 'запечатано',
    'processing.fallbackName': 'Книга держит слово',

    'failed.rubric': 'Обряд',
    'failed.heading': 'Обряд не удалось завершить.',
    'failed.status': 'Платёж не подтверждён',
    'failed.body':
      'Что-то прервало работу до того, как легла последняя печать. Платёж не подтверждён, проклятие не начато, ничего не списано. Ваш выбор остался на листе заказа.',
    'failed.retry': 'Попробовать оплатить снова',
    'failed.back': 'Вернуться к книге',

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

    'story.legend': 'Легенда',
    'story.origin': 'Происхождение',
    'story.objects': 'Предметы и символы',
    'story.accounts': 'Свидетельства',
    'story.modern': 'Современное расследование',
    'story.effect': 'Выбор',
    'story.aiRubric': 'Запись машины',
    'story.choose':
      'Отметьте ступень - она ляжет в лист заказа. Слово подберёт и произнесёт не человек, а особый ИИ.',
    'story.disclaimer':
      'Свод, места, люди и архивы в этой главе вымышлены. Обрядов не существует, и всё описанное - художественный вымысел, а не исторические факты. Ниже - только каталог работ.',

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

    'processing.rubric': 'Payment confirmed',
    'processing.heading': 'The curse is being prepared',
    'processing.intro':
      'Payment confirmed - the book takes the word. The rite is being composed now; each line below is a step of the work.',
    'processing.stage.recover': 'Recovering the original ritual…',
    'processing.stage.examine': 'Examining the selected target…',
    'processing.stage.archive': 'Searching the archive…',
    'processing.stage.fragments': 'Reconstructing missing fragments…',
    'processing.stage.connection': 'Establishing the connection…',
    'processing.stage.ai': 'AI reconstruction in progress…',
    'processing.stage.write': 'Writing the curse…',
    'processing.stage.seal': 'Sealing the final words…',
    'processing.stage.spare.1': 'Consulting the marginal notes…',
    'processing.stage.spare.2': 'Comparing the copies in the ledger…',
    'processing.stage.spare.3': 'Binding the words to the target…',
    'processing.manuscript': 'The book writes',
    'processing.written': 'The words are sealed.',
    'success.sealed': 'sealed',
    'processing.fallbackName': 'The book keeps its word',

    'failed.rubric': 'The rite',
    'failed.heading': 'The ritual could not be completed.',
    'failed.status': 'Payment: not confirmed',
    'failed.body':
      'Something interrupted the process before the final seal was placed. Your payment was not confirmed, so no curse has been initiated and nothing has been charged. Your selection is still on the order sheet.',
    'failed.retry': 'Try paying again',
    'failed.back': 'Return to the book',

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

    'story.legend': 'Legend',
    'story.origin': 'Origin',
    'story.objects': 'Objects and symbolism',
    'story.accounts': 'Accounts',
    'story.modern': 'Modern investigation',
    'story.effect': 'The choice',
    'story.aiRubric': "The machine's note",
    'story.choose':
      'Mark the tier you want - it goes to the order sheet. The word is chosen and spoken not by a person but by a special AI.',
    'story.disclaimer':
      'The ledgers, places, people and archives in this chapter are invented. The rites do not exist, and everything above is fiction, not recorded fact. Below is only a catalogue of work.',

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
