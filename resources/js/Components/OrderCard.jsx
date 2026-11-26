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
          <span className="staff-order-table">
            {order.order_type === 'delivery'
              ? t('common.orderCard.delivery')
              : (order.cafe_table?.name || t('common.orderCard.tableUnknown'))}
          </span>
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

      {(order.customer_name || order.delivery_location) && (
        <p className="staff-order-note">
          {order.customer_name && <><strong>{t('common.orderCard.customer')}:</strong> {order.customer_name}</>}
          {order.customer_name && order.delivery_location && <br />}
          {order.delivery_location && <><strong>{t('common.orderCard.location')}:</strong> {order.delivery_location}</>}
        </p>
      )}
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
