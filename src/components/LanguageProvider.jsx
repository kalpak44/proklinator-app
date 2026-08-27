import { useEffect, useMemo, useState } from 'react'
import {
  CATALOGUES,
  LanguageContext,
  persistLanguage,
  resolveLanguage,
  translate,
} from '../lib/i18n.js'

/**
 * Holds the active language, the message lookup and the active-language
 * catalogue. The language is resolved once on startup and changed only by the
 * toolbar toggle; every switch is written to localStorage immediately.
 */
export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(resolveLanguage)

  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => {
        setLang(next)
        persistLanguage(next)
      },
      t: (key, vars) => translate(key, vars, lang),
      catalogue: CATALOGUES[lang],
    }),
    [lang]
  )

  // The document speaks the active language too: the attribute, the tab, and
  // the description cards. `index.html` pre-applies the same on first paint.
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translate('meta.title', null, lang)
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', translate('meta.description', null, lang))
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', translate('meta.ogTitle', null, lang))
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', translate('meta.ogDescription', null, lang))
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute('content', translate('meta.ogTitle', null, lang))
    document
      .querySelector('meta[name="twitter:description"]')
      ?.setAttribute('content', translate('meta.ogDescription', null, lang))
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute('content', lang === 'ru' ? 'ru_RU' : 'bg_BG')
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
