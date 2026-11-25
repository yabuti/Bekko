import { router, usePage } from '@inertiajs/react'
import { ClipboardList, QrCode, Utensils } from 'lucide-react'
import LanguageSwitcher from '../Components/LanguageSwitcher'
import ThemeToggle from '../Components/ThemeToggle'
import { useI18n } from '../i18n/index.jsx'

export default function Staff({ title, subtitle, children }) {
  const { t } = useI18n()
  const { auth } = usePage().props
  const role = auth?.user?.role
  const logout = () => router.post('/staff/logout')

  return (
    <div className="staff-page">
      <header className="staff-header">
        <div className="container staff-header-inner">
          <div className="staff-brand">
            <span className="staff-brand-mark">B</span>
            <div>
              <strong>Bekko Coffee</strong>
              <span>{t('staffLayout.brandSubtitle')}</span>
            </div>
          </div>
          <nav className="staff-nav">
            {(role === 'waiter' || role === 'admin') && (
              <a href="/staff/waiter"><ClipboardList size={16} /> {t('staffLayout.nav.waiter')}</a>
            )}
            {(role === 'kitchen' || role === 'admin') && (
              <a href="/staff/kitchen"><Utensils size={16} /> {t('staffLayout.nav.kitchen')}</a>
            )}
            <a href="/staff/tables"><QrCode size={16} /> {t('staffLayout.nav.tables')}</a>
          </nav>
          <div className="header-controls">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="staff-user">
            <span>{auth?.user?.name}</span>
            <button type="button" onClick={logout}>{t('staffLayout.logout')}</button>
          </div>
        </div>
      </header>

      <main className="container staff-main">
        <div className="staff-head">
          <div>
            <span className="section-eyebrow">{t('staffLayout.liveOrders')}</span>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <span className="live-badge">{t('common.update.every5')}</span>
        </div>
        {children}
      </main>
    </div>
  )
}
