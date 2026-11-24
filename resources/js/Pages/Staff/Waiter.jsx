import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import OrderCard from '../../Components/OrderCard'
import Staff from '../../Layouts/Staff'
import { useI18n, useSite } from '../../i18n/index.jsx'

export default function Waiter({ orders }) {
  const { t } = useI18n()
  const site = useSite()
  const currency = site.currency || 'ETB'

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
      title={t('staffWaiter.title')}
      subtitle={t('staffWaiter.subtitle')}
    >
      <div className="staff-columns">
        <section>
          <h2 className="staff-section-title">{t('staffWaiter.activeOrders')} <span>{active.length}</span></h2>
          <div className="staff-order-grid">
            {active.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                currency={currency}
                actions={order.status === 'ready'
                  ? [{ label: t('staffWaiter.markServed'), status: 'served' }]
                  : []}
              />
            ))}
            {!active.length && <p className="staff-empty">{t('staffWaiter.noActive')}</p>}
          </div>
        </section>

        <section>
          <h2 className="staff-section-title">{t('staffWaiter.recentlyServed')}</h2>
          <div className="staff-order-grid">
            {served.map((order) => (
              <OrderCard key={order.id} order={order} currency={currency} />
            ))}
            {!served.length && <p className="staff-empty">{t('staffWaiter.nothingServed')}</p>}
          </div>
        </section>
      </div>
    </Staff>
  )
}
