import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import { Check, ChefHat, ClipboardList, Coffee, RefreshCw } from 'lucide-react'

const steps = [
  { key: 'new', label: 'Order received', hint: 'The kitchen has your order', icon: ClipboardList },
  { key: 'preparing', label: 'Being prepared', hint: 'We are making it fresh', icon: ChefHat },
  { key: 'ready', label: 'Ready to serve', hint: 'Your waiter is on the way', icon: Coffee },
  { key: 'served', label: 'Enjoy your order', hint: 'Thank you for visiting', icon: Check },
]

export default function OrderStatus({ site, order }) {
  useEffect(() => {
    const timer = window.setInterval(() => {
      router.reload({ only: ['order'], preserveState: true })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const currency = site?.currency || 'ETB'
  const current = steps.findIndex((step) => step.key === order.status)

  return (
    <div className="status-page">
      <header className="order-topbar">
        <a className="order-back" href="/">Home</a>
        <div className="order-table-pill">{order.table.name}</div>
      </header>

      <div className="container status-card">
        <div className="status-head">
          <span className="section-eyebrow">Order #{order.id}</span>
          <h1>Thanks — we’ve got your order</h1>
          <p>
            Sit tight at {order.table.name}. This page updates automatically every 5 seconds.
          </p>
          <span className="live-badge"><RefreshCw size={13} /> Live updates</span>
        </div>

        <div className="status-track">
          {steps.map((step, index) => {
            const Icon = step.icon
            const state = index < current ? 'done' : index === current ? 'current' : ''
            return (
              <div className={`status-step ${state}`} key={step.key}>
                <span className="status-step-icon"><Icon size={19} /></span>
                <div>
                  <strong>{step.label}</strong>
                  <span>{step.hint}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="status-receipt">
          <h2>Your order</h2>
          {order.items.map((item) => (
            <div className="receipt-line" key={item.id}>
              <span>{item.quantity} × {item.name}</span>
              <strong>{currency} {item.price * item.quantity}</strong>
            </div>
          ))}
          {order.notes && <p className="receipt-note">Note: {order.notes}</p>}
          <div className="receipt-total">
            <span>Total</span>
            <strong>{currency} {order.total}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
