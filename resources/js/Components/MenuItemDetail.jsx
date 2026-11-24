import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

const splitIngredients = (value) => (value || '')
  .split(/[\n,;]+/)
  .map((part) => part.trim())
  .filter(Boolean)

export default function MenuItemDetail({ item, category, group, currency, onClose, children }) {
  const { t } = useI18n()

  useEffect(() => {
    if (!item) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [item, onClose])

  if (!item) return null

  const ingredients = splitIngredients(item.ingredients)

  return (
    <div
      className="detail-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button type="button" className="detail-close" onClick={onClose} aria-label={t('menuDetail.close')}>
          <X size={18} />
        </button>

        <div className="detail-photo">
          <img src={item.image} alt="" />
        </div>

        <div className="detail-content">
          <span className="detail-eyebrow">{[category, group].filter(Boolean).join(' · ')}</span>
          <h2 id="detail-title">{item.name}</h2>
          <div className="detail-price">{currency} {item.price}</div>

          <div className="detail-section">
            <h3>{t('menuDetail.about')}</h3>
            <p>{item.description || t('menuDetail.noDescription')}</p>
          </div>

          <div className="detail-section">
            <h3>{t('menuDetail.ingredients')}</h3>
            {ingredients.length ? (
              <ul className="detail-ingredients">
                {ingredients.map((ingredient, index) => (
                  <li key={`${ingredient}-${index}`}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="detail-muted">{t('menuDetail.noIngredients')}</p>
            )}
          </div>

          {children && <div className="detail-actions">{children}</div>}
        </div>
      </div>
    </div>
  )
}
