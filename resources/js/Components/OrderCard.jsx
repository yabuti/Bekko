import { router } from '@inertiajs/react'
import { Clock } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

export default function OrderCard({ order, currency, actions = [] }) {
  const { t } = useI18n()
  const time = new Date(order.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className={`staff-order status-${order.status}`}>
      <div className="staff-order-head">
        <div>
          <span className="staff-order-table">{order.cafe_table?.name}</span>
          <span className="staff-order-number">{t('common.orderCard.order', { id: order.id })}</span>
        </div>
        <span className={`order-status status-${order.status}`}>{t(`common.status.${order.status}`)}</span>
      </div>

      <ul className="staff-order-items">
        {order.items.map((item) => (
          <li key={item.id}>
            <strong>{item.quantity}×</strong>
            <span>{item.name}</span>
            <span>{currency} {item.price * item.quantity}</span>
          </li>
        ))}
      </ul>

      {order.notes && <p className="staff-order-note">{t('common.orderCard.note', { note: order.notes })}</p>}

      <div className="staff-order-foot">
        <span className="order-time"><Clock size={14} /> {time}</span>
        <strong className="order-total">{currency} {order.total}</strong>
      </div>

      {actions.length > 0 && (
        <div className="staff-order-actions">
          {actions.map((action) => (
            <button
              key={action.status}
              type="button"
              className={`button ${action.variant || 'button-primary'}`}
              onClick={() => router.post(`/staff/orders/${order.id}/status`, { status: action.status })}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </article>
  )
}
