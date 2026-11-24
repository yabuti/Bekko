import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Check, ChefHat, ClipboardList, Coffee, RefreshCw } from 'lucide-react'
import LanguageSwitcher from '../Components/LanguageSwitcher'
import { useI18n, useSite } from '../i18n/index.jsx'

const steps = [
  { key: 'new', icon: ClipboardList },
  { key: 'preparing', icon: ChefHat },
  { key: 'ready', icon: Coffee },
  { key: 'served', icon: Check },
]

export default function OrderStatus({ order }) {
  const { t } = useI18n()
  const site = useSite()
  const currency = site.currency || 'ETB'

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
        <div className="order-table-pill">{order.table.name}</div>
        <LanguageSwitcher />
      </header>

      <div className="container status-card">
        <div className="status-head">
          <span className="section-eyebrow">{t('orderStatus.eyebrow', { id: order.id })}</span>
          <h1>{t('orderStatus.heading')}</h1>
          <p>{t('orderStatus.intro', { table: order.table.name })}</p>
          <span className="live-badge"><RefreshCw size={13} /> {t('orderStatus.live')}</span>
        </div>

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

        <div className="status-receipt">
          <h2>{t('orderStatus.yourOrder')}</h2>
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
