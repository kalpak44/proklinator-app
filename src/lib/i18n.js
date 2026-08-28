import { createContext, useContext } from 'react'
import * as catalogueRu from '../data/book.js'
import * as catalogueBg from '../data/book.bg.js'

/**
 * Localisation. Two languages, resolved once on startup in this order:
 * a stored choice, then the browser's own preference, then Bulgarian.
 *
 * The catalogue is translated wholesale (src/data/book.bg.js), so switching
 * languages swaps the whole data module instead of re-resolving strings.
 * Everything else - the chrome, the form, the log, the document metadata -
 * lives in the message tables below.
 */
export const LANG_KEY = 'proklinator.lang'
export const DEFAULT_LANG = 'bg'

export const CATALOGUES = { ru: catalogueRu, bg: catalogueBg }

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
    'lang.current.bg': 'Язык: болгарский',
    'lang.switch.ru': 'Переключить на русский',
    'lang.switch.bg': 'Переключить на болгарский',

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

  bg: {
    'meta.title': 'Проклинатор - книга за проклятия, която агентът чете',
    'meta.description':
      'Агентът е обучен върху тъмни сводове: списъци, преписвани на ръка, мрежи без изход навън и книги, които са горили и не са изгорели. Отворете глава, оградете нужното, останалото той ще свърши сам.',
    'meta.ogTitle': 'Проклинатор - книга за проклятия, която агентът чете',
    'meta.ogDescription':
      'Книга, която вие листате, а словото подбира агентът. Шест глави: помрачение, разрив, отлив, безпокойство, наследство, пазително.',

    'order.tab': 'Поръчка',
    'order.empty': 'празно',
    'header.backToTitle': 'Към заглавната страница',

    'sound.off': 'Изключване на звука',
    'sound.on': 'Включване на звука',
    'sound.title.on': 'Звукът на страниците е включен',
    'sound.title.off': 'Звукът на страниците е изключен',

    'lang.current.ru': 'Език: руски',
    'lang.current.bg': 'Език: български',
    'lang.switch.ru': 'Превключете на руски',
    'lang.switch.bg': 'Превключете на български',

    'nav.prev': 'Предишен разворот',
    'nav.next': 'Следващ разворот',
    'nav.prevLabel': '‹ назад',
    'nav.nextLabel': 'напред ›',
    'footer.home': 'Заглавна страница',
    'footer.order': 'Лист за поръчка',
    'footer.chapter': 'Глава {numeral}',

    'checkout.rubric': 'Плащане',
    'checkout.heading': 'Платете поръчката',
    'checkout.intro':
      'Плащането е еднократно, с карта чрез Stripe. Първо ще попаднете на страницата на Stripe, а след плащането - на страницата за потвърждение. Избраното остава в листа, ако се върнете без плащане.',
    'checkout.sending': 'Преминаване към Stripe…',
    'checkout.failed':
      'Неуспешно започване на плащането. Проверете връзката и опитайте отново - избраното не е загубено.',
    'checkout.cta.empty': 'Първо изберете проклятие',
    'checkout.cta.unavailable': 'Поръчките временно са недостъпни',
    'checkout.cta.pay': 'Платете {amount}',
    'checkout.stripeNote':
      'Плащане с карта чрез Stripe. След плащането агентът взема словото на работа.',

    'success.rubric': 'Плащане',
    'success.heading': 'Плащането е минало',
    'success.body':
      'Поръчката е приета и агентът взема словото на работа. Разписката ще дойде от Stripe, а нататък всичко прави той.',
    'success.back': 'Върнете се към книгата',

    'order.summaryRubric': 'Лист за поръчка',
    'order.yourChoice': 'Вашият избор',
    'order.emptySheet':
      'Засега е празно. Отворете която и да е глава и оградете нужното: то ще легне тук, а агентът ще научи за него преди вас.',
    'order.toFirstChapter': 'Към първата глава',
    'order.removeLine': 'Махни: {spell}, {option}',
    'order.oneTime': 'Еднократно плащане',
    'order.footnote':
      'Плащането е еднократно и назад не се взема. Преди преминаването към Stripe можете да промените избора.',

    'title.rubric': 'Свод',
    'title.chapters': 'Глави',
    'title.curses': 'Проклятия',
    'title.from': 'Цена от',

    'contents.rubric': 'Съдържание',
    'contents.heading': 'Какво има в книгата',
    'contents.count': '{count} проклятия · от {amount}',
    'contents.how': 'Как работи',
    'contents.orderSheet': 'Лист за поръчка',

    'price.free': 'включено',
    'spell.tiers': 'Тарифи: {name}',
    'chapter.rubric': 'Глава {numeral}',

    'bookmarks.past': 'Преминати глави',
    'bookmarks.all': 'Глави на книгата',
  },
}

/**
 * The stored choice wins over everything; then the browser's own preference
 * (matched on the primary subtag, so `ru-RU` and `bg-BG` both work); then the
 * Bulgarian fallback. An unreadable or unrecognised stored value is ignored.
 */
export function resolveLanguage() {
  try {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored === 'ru' || stored === 'bg') return stored
  } catch {
    // Storage unavailable: fall through to the browser preference.
  }
  for (const candidate of navigator.languages ?? []) {
    const primary = String(candidate).split('-')[0]
    if (primary === 'ru' || primary === 'bg') return primary
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
