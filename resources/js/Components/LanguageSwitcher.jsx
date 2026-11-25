import { locales, useI18n } from '../i18n/index.jsx'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className="language-switcher" role="group" aria-label={t('common.language.label')}>
      {locales.map(({ code }) => (
        <button
          key={code}
          type="button"
          className={locale === code ? 'is-active' : ''}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
