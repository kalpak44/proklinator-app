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

    'launch.rubric': 'Запуск',
    'launch.accepted': 'Агент принял слово',
    'launch.started': 'Начато',
    'launch.referenceBefore': 'Слово принято под знаком ',
    'launch.referenceAfter': '. Весть о том, что начато, придёт на ',
    'launch.referenceTail': '. Другого подтверждения не будет.',
    'launch.erasure':
      'Снимок и всё, чем вы назвали объекта, исчезнут вместе с закрытием заказа. Ни у нас, ни у агента не останется.',
    'launch.handover': 'Передать агенту',
    'launch.intro':
      'Дальше вас ни о чём не спросят. Агент прочтёт лицо, подберёт слово из свода и начнёт сам. Человеческой руки в этом не будет.',
    'launch.faceNeeded': 'Без лица агенту не за что взяться.',
    'launch.emailLabel': 'Куда прислать весть',
    'launch.emailInvalid': 'Проверьте адрес: весть уйдёт только на него.',
    'launch.consent':
      'Мне есть 18 лет, я принимаю условия и подтверждаю, что вправе передать этот снимок. Я понимаю, к чему это ведёт.',
    'launch.cta.empty': 'Сначала выберите проклятие',
    'launch.cta.pay': 'Оплатить {amount} и передать агенту',
    'launch.stripeNote':
      'Оплата картой через Stripe. Агент начнёт, как только платёж подтвердится.',

    'console.title': 'Агент работает',

    'upload.alt': 'Объект',
    'upload.empty': 'Фотография объекта',
    'upload.hint.empty': 'Агенту нужно лицо. Больше он ничего не спросит.',
    'upload.hint.filled': 'Принято. Нажмите, если хотите заменить.',
    'upload.remove': 'Убрать снимок',

    'order.summaryRubric': 'Лист заказа',
    'order.yourChoice': 'Ваш выбор',
    'order.emptySheet':
      'Пока пусто. Откройте любую главу и обведите нужное: оно ляжет сюда, и агент узнает об этом раньше вас.',
    'order.toFirstChapter': 'К первой главе',
    'order.removeLine': 'Убрать: {spell}, {tier}',
    'order.perMonth': ' / мес',
    'order.oneTime': 'Разовый платёж',
    'order.monthly': 'Далее ежемесячно',
    'order.footnote':
      'Списание после подтверждения. Неотступное снимается в один клик, разовое назад не берут.',

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
    'price.perMonth': ' / мес',
    'spell.tiers': 'Тарифы: {name}',
    'chapter.rubric': 'Глава {numeral}',

    'bookmarks.past': 'Пройденные главы',
    'bookmarks.all': 'Главы книги',

    'log.awake': 'агент {version} пробуждается',
    'log.shot': 'снимок принят: {fileName}',
    'log.read': 'черты считаны ... объект узнан',
    'log.codex': 'свод открыт ... слово выбрано',
    'log.taken': 'взято в работу: {count}',
    'log.name': 'имя вписано, круг замкнут',
    'log.begun': 'начато',
    'log.anonymous': 'объект',
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

    'launch.rubric': 'Старт',
    'launch.accepted': 'Агентът прие словото',
    'launch.started': 'Започнато',
    'launch.referenceBefore': 'Словото е прието под знака ',
    'launch.referenceAfter': '. Вестта, че е започнато, ще дойде на ',
    'launch.referenceTail': '. Друго потвърждение няма да има.',
    'launch.erasure':
      'Снимката и всичко, с което назовахте обекта, ще изчезнат заедно със затварянето на поръчката. Няма да остане нито у нас, нито у агента.',
    'launch.handover': 'Предай на агента',
    'launch.intro':
      'Оттук нататък нищо повече няма да ви питат. Агентът ще прочете лицето, ще подбере слово от свода и ще започне сам. Човешка ръка в това няма да има.',
    'launch.faceNeeded': 'Без лице агентът няма за какво да се захване.',
    'launch.emailLabel': 'Къде да се изпрати вестта',
    'launch.emailInvalid': 'Проверете адреса: вестта ще отиде само на него.',
    'launch.consent':
      'Навършил(а) съм 18 години, приемам условията и потвърждавам, че имам право да предам тази снимка. Разбирам до какво води това.',
    'launch.cta.empty': 'Първо изберете проклятие',
    'launch.cta.pay': 'Платете {amount} и предайте на агента',
    'launch.stripeNote':
      'Плащане с карта чрез Stripe. Агентът ще започне, щом плащането се потвърди.',

    'console.title': 'Агентът работи',

    'upload.alt': 'Обект',
    'upload.empty': 'Снимка на обекта',
    'upload.hint.empty': 'На агента му трябва лице. Повече нищо няма да попита.',
    'upload.hint.filled': 'Прието. Натиснете, ако искате да смените.',
    'upload.remove': 'Премахни снимката',

    'order.summaryRubric': 'Лист за поръчка',
    'order.yourChoice': 'Вашият избор',
    'order.emptySheet':
      'Засега е празно. Отворете която и да е глава и оградете нужното: то ще легне тук, а агентът ще научи за него преди вас.',
    'order.toFirstChapter': 'Към първата глава',
    'order.removeLine': 'Махни: {spell}, {tier}',
    'order.perMonth': ' / месец',
    'order.oneTime': 'Еднократно плащане',
    'order.monthly': 'След това ежемесечно',
    'order.footnote':
      'Отписване след потвърждение. Неотстъпното се маха с едно кликване, еднократното назад не се взема.',

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
    'price.perMonth': ' / месец',
    'spell.tiers': 'Тарифи: {name}',
    'chapter.rubric': 'Глава {numeral}',

    'bookmarks.past': 'Преминати глави',
    'bookmarks.all': 'Глави на книгата',

    'log.awake': 'агентът {version} се пробужда',
    'log.shot': 'снимка приета: {fileName}',
    'log.read': 'черти разчетени ... обектът разпознат',
    'log.codex': 'сводът отворен ... словото избрано',
    'log.taken': 'взето на работа: {count}',
    'log.name': 'името вписано, кръгът затворен',
    'log.begun': 'започнато',
    'log.anonymous': 'обект',
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
