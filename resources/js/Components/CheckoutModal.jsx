import { useEffect } from 'react'
import { MapPin, ShoppingBag, Store, X } from 'lucide-react'
import { useI18n, useSite } from '../i18n/index.jsx'

export default function CheckoutModal({
  open,
  count,
  total,
  name,
  orderType,
  tableNumber,
  location,
  errors,
  submitting,
  onNameChange,
  onOrderTypeChange,
  onTableNumberChange,
  onLocationChange,
  onClose,
  onSubmit,
}) {
  const { t } = useI18n()
  const site = useSite()
  const currency = site.currency || 'ETB'

  useEffect(() => {
    if (!open) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="checkout-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <form
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onSubmit={onSubmit}
        noValidate
      >
        <button type="button" className="checkout-close" onClick={onClose} aria-label={t('checkout.cancel')}>
          <X size={18} />
        </button>

        <span className="section-eyebrow">{t('checkout.eyebrow')}</span>
        <h2 id="checkout-title">{t('checkout.title')}</h2>
        <p className="checkout-subtitle">{t('checkout.subtitle')}</p>

        <div className="checkout-summary">
          <ShoppingBag size={18} />
          <span>{count === 1 ? t('customerMenu.itemOne') : t('customerMenu.itemMany', { count })}</span>
          <strong>{currency} {total}</strong>
        </div>

        <label className="checkout-field">
          <span>{t('checkout.nameLabel')}</span>
          <input
            type="text"
            autoComplete="name"
            maxLength={120}
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder={t('checkout.namePlaceholder')}
            aria-invalid={Boolean(errors.customer_name)}
          />
          {errors.customer_name && <span className="field-error">{errors.customer_name}</span>}
        </label>

        <fieldset className="checkout-types">
          <legend>{t('checkout.typeLabel')}</legend>
          <div className="checkout-type-row">
            <button
              type="button"
              className={`checkout-type${orderType === 'dine_in' ? ' is-active' : ''}`}
              onClick={() => onOrderTypeChange('dine_in')}
            >
              <Store size={17} /> {t('checkout.dineIn')}
            </button>
            <button
              type="button"
              className={`checkout-type${orderType === 'delivery' ? ' is-active' : ''}`}
              onClick={() => onOrderTypeChange('delivery')}
            >
              <MapPin size={17} /> {t('checkout.delivery')}
            </button>
          </div>
        </fieldset>

        {orderType === 'dine_in' ? (
          <label className="checkout-field">
            <span>{t('checkout.tableLabel')}</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={10}
              value={tableNumber}
              onChange={(event) => onTableNumberChange(event.target.value)}
              placeholder={t('checkout.tablePlaceholder')}
              aria-invalid={Boolean(errors.table_number)}
            />
            <span className="checkout-help">{t('checkout.tableHelp')}</span>
            {errors.table_number && <span className="field-error">{errors.table_number}</span>}
          </label>
        ) : (
          <label className="checkout-field">
            <span>{t('checkout.locationLabel')}</span>
            <input
              type="text"
              autoComplete="off"
              maxLength={255}
              value={location}
              onChange={(event) => onLocationChange(event.target.value)}
              placeholder={t('checkout.locationPlaceholder')}
              aria-invalid={Boolean(errors.delivery_location)}
            />
            <span className="checkout-help">{t('checkout.locationHelp')}</span>
            {errors.delivery_location && <span className="field-error">{errors.delivery_location}</span>}
          </label>
        )}

        <div className="checkout-actions">
          <button type="button" className="button button-outline" onClick={onClose}>
            {t('checkout.cancel')}
          </button>
          <button type="submit" className="button button-primary" disabled={submitting}>
            {submitting ? t('checkout.sending') : t('checkout.confirm')}
          </button>
        </div>
      </form>
    </div>
  )
}
