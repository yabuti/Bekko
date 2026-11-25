import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe2 } from 'lucide-react'
import { locales, useI18n } from '../i18n/index.jsx'

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="language-dropdown" ref={rootRef}>
      <button
        type="button"
        className="language-trigger"
        aria-label={t('common.language.label')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={15} aria-hidden="true" />
        <span>{locale}</span>
        <ChevronDown className={`language-chevron${open ? ' is-open' : ''}`} size={14} aria-hidden="true" />
      </button>

      {open && (
        <div className="language-menu" role="menu" aria-label={t('common.language.label')}>
          {locales.map(({ code }) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={locale === code}
              className={locale === code ? 'is-active' : ''}
              onClick={() => {
                setLocale(code)
                setOpen(false)
              }}
            >
              <span>{code}</span>
              {locale === code && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
