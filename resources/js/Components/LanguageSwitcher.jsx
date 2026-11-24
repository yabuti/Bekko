import { Languages } from 'lucide-react'
import { locales, useI18n } from '../i18n/index.jsx'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <label className="language-switcher" aria-label={t('common.language.label')}>
      <Languages size={16} aria-hidden="true" />
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
        aria-label={t('common.language.label')}
      >
        {locales.map(({ code, label, short }) => (
          <option key={code} value={code}>{short} · {label}</option>
        ))}
      </select>
    </label>
  )
}
