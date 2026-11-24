import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { site as siteData, directionsUrl } from '../data/site'
// Each language has its own folder; every page has one file in each folder.
const translationFiles = import.meta.glob('./{en,am,or}/*.js', { eager: true })

export const locales = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'am', label: 'አማርኛ', short: 'AM' },
  { code: 'or', label: 'Afaan Oromoo', short: 'OR' },
]

const DEFAULT_LOCALE = 'en'
const STORAGE_KEY = 'bekkocoffee.locale'

function flatten(value, prefix = '', result = {}) {
  Object.entries(value).forEach(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key

    if (Array.isArray(entry)) {
      entry.forEach((item, index) => {
        if (item && typeof item === 'object') flatten(item, `${path}.${index}`, result)
        else result[`${path}.${index}`] = item
      })
    } else if (entry && typeof entry === 'object') {
      flatten(entry, path, result)
    } else {
      result[path] = entry
    }
  })

  return result
}

const dictionaries = Object.fromEntries(
  locales.map(({ code }) => [
    code,
    Object.entries(translationFiles).reduce((dictionary, [path, module]) => {
      if (!path.startsWith(`./${code}/`)) return dictionary
      return { ...dictionary, ...flatten(module.default ?? {}) }
    }, {}),
  ]),
)

function translate(locale, key, variables) {
  const dictionary = dictionaries[locale] ?? {}
  let text = dictionary[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key

  if (variables) {
    Object.entries(variables).forEach(([name, value]) => {
      text = String(text).replaceAll(`{${name}}`, String(value))
    })
  }

  return text
}

function initialLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return locales.some(({ code }) => code === saved) ? saved : DEFAULT_LOCALE
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale === 'or' ? 'om' : locale
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const t = useCallback((key, variables) => translate(locale, key, variables), [locale])
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}

export function useSite() {
  const { t } = useI18n()

  return useMemo(() => ({
    ...siteData,
    tagline: t('common.site.tagline'),
    description: t('common.site.description'),
    badge: t('common.site.badge'),
    hours: [
      { day: t('common.site.weekday'), time: t('common.site.weekdayTime') },
      { day: t('common.site.weekend'), time: t('common.site.weekendTime') },
    ],
    directionsUrl,
  }), [t])
}
