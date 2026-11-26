import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Check, ChefHat, ClipboardList, Clock, Coffee, RefreshCw } from 'lucide-react'
import LanguageSwitcher from '../Components/LanguageSwitcher'
import ThemeToggle from '../Components/ThemeToggle'
import { useI18n, useSite } from '../i18n/index.jsx'

const steps = [
  { key: 'pending', icon: Clock },
  { key: 'new', icon: ClipboardList },
  { key: 'preparing', icon: ChefHat },
  { key: 'ready', icon: Coffee },
  { key: 'served', icon: Check },
]

export default function OrderStatus({ order }) {
  const { t } = useI18n()
  const site = useSite()
  const currency = site.currency || 'ETB'
  const destination = order.order_type === 'delivery' ? t('orderStatus.delivery') : order.table?.name
  const isPending = order.status === 'pending'

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.reload({ only: ['order'], preserveState: true })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const current = steps.findIndex((step) => step.key === order.status)

  return (
    <div className="status-page">
      <header className="order-topbar">
        <a className="order-back" href="/">{t('orderStatus.home')}</a>
        <div className="order-table-pill">{destination}</div>
        <div className="header-controls">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <div className="container status-card">
        <div className="status-head">
          <span className="section-eyebrow">{t('orderStatus.eyebrow', { id: order.id })}</span>
          <h1>{t('orderStatus.heading')}</h1>
          <p>{t('orderStatus.intro', { table: destination })}</p>
          <span className="live-badge"><RefreshCw size={13} /> {t('orderStatus.live')}</span>
        </div>

        {isPending ? (
          <div className="status-pending">
            <Clock size={20} />
            <div>
              <strong>{t('orderStatus.pendingTitle')}</strong>
              <p>{t('orderStatus.pendingHint', { name: order.customer_name })}</p>
            </div>
          </div>
        ) : (
          <div className="status-track">
            {steps.map((step, index) => {
              const Icon = step.icon
              const state = index < current ? 'done' : index === current ? 'current' : ''
              return (
                <div className={`status-step ${state}`} key={step.key}>
                  <span className="status-step-icon"><Icon size={19} /></span>
                  <div>
                    <strong>{t(`orderStatus.steps.${index}.label`)}</strong>
                    <span>{t(`orderStatus.steps.${index}.hint`)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="status-receipt">
          <h2>{t('orderStatus.yourOrder')}</h2>
          <p className="receipt-customer">
            {t('orderStatus.customer')}: {order.customer_name}
            {order.delivery_location && <> · {order.delivery_location}</>}
          </p>
          {order.items.map((item) => (
            <div className="receipt-line" key={item.id}>
              <span>{item.quantity} × {item.name}</span>
              <strong>{currency} {item.price * item.quantity}</strong>
            </div>
          ))}
          {order.notes && <p className="receipt-note">{t('orderStatus.note', { note: order.notes })}</p>}
          <div className="receipt-total">
            <span>{t('orderStatus.total')}</span>
            <strong>{currency} {order.total}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
