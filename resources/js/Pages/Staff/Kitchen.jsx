import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import OrderCard from '../../Components/OrderCard'
import Staff from '../../Layouts/Staff'
import { useI18n, useSite } from '../../i18n/index.jsx'

export default function Kitchen({ orders }) {
  const { t } = useI18n()
  const site = useSite()
  const currency = site.currency || 'ETB'

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.reload({ only: ['orders'], preserveState: true })
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const actionsFor = (status) => {
    if (status === 'new') return [{ label: t('staffKitchen.startPreparing'), status: 'preparing' }]
    if (status === 'preparing') return [{ label: t('staffKitchen.markReady'), status: 'ready' }]
    return []
  }

  return (
    <Staff
      title={t('staffKitchen.title')}
      subtitle={t('staffKitchen.subtitle')}
    >
      <div className="staff-order-grid staff-order-grid-wide">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            currency={currency}
            actions={actionsFor(order.status)}
          />
        ))}
        {!orders.length && <p className="staff-empty">{t('staffKitchen.clear')}</p>}
      </div>
    </Staff>
  )
}
