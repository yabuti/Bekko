import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import OrderCard from '../../Components/OrderCard'
import Staff from '../../Layouts/Staff'

export default function Waiter({ site, orders }) {
  useEffect(() => {
    const timer = window.setInterval(() => {
      router.reload({ only: ['orders'], preserveState: true })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const active = orders.filter((order) => order.status !== 'served')
  const served = orders.filter((order) => order.status === 'served')

  return (
    <Staff
      title="Waiter dashboard"
      subtitle="Every order from every table, in one place."
    >
      <div className="staff-columns">
        <section>
          <h2 className="staff-section-title">Active orders <span>{active.length}</span></h2>
          <div className="staff-order-grid">
            {active.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                currency={site?.currency || 'ETB'}
                actions={order.status === 'ready'
                  ? [{ label: 'Mark as served', status: 'served' }]
                  : []}
              />
            ))}
            {!active.length && <p className="staff-empty">No active orders yet.</p>}
          </div>
        </section>

        <section>
          <h2 className="staff-section-title">Recently served</h2>
          <div className="staff-order-grid">
            {served.map((order) => (
              <OrderCard key={order.id} order={order} currency={site?.currency || 'ETB'} />
            ))}
            {!served.length && <p className="staff-empty">Nothing served yet.</p>}
          </div>
        </section>
      </div>
    </Staff>
  )
}
