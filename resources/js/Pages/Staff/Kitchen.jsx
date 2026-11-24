import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import OrderCard from '../../Components/OrderCard'
import Staff from '../../Layouts/Staff'

export default function Kitchen({ site, orders }) {
  useEffect(() => {
    const timer = window.setInterval(() => {
      router.reload({ only: ['orders'], preserveState: true })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const actionsFor = (status) => {
    if (status === 'new') return [{ label: 'Start preparing', status: 'preparing' }]
    if (status === 'preparing') return [{ label: 'Mark ready', status: 'ready' }]
    return []
  }

  return (
    <Staff
      title="Kitchen dashboard"
      subtitle="New tickets appear here the moment a customer orders."
    >
      <div className="staff-order-grid staff-order-grid-wide">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            currency={site?.currency || 'ETB'}
            actions={actionsFor(order.status)}
          />
        ))}
        {!orders.length && <p className="staff-empty">The kitchen is clear. Nice work.</p>}
      </div>
    </Staff>
  )
}
