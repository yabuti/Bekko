import { Link, router, usePage } from '@inertiajs/react'
import { BookOpen, ClipboardList, LogOut, QrCode, Utensils } from 'lucide-react'
import LanguageSwitcher from '../Components/LanguageSwitcher'
import ThemeToggle from '../Components/ThemeToggle'
import { useI18n } from '../i18n/index.jsx'

export default function StaffSidebar({ title, subtitle, children }) {
  const { t } = useI18n()
  const page = usePage()
  const role = page.props.auth?.user?.role
  const roleLabel = role ? t(`staffLayout.role.${role}`) : ''

  const links = [
    ...(role === 'admin'
      ? [{ href: '/staff/menu', label: t('staffLayout.nav.menu'), icon: BookOpen }]
      : []),
    ...(role === 'waiter' || role === 'admin'
      ? [{ href: '/staff/waiter', label: t('staffLayout.nav.waiter'), icon: ClipboardList }]
      : []),
    ...(role === 'kitchen' || role === 'admin'
      ? [{ href: '/staff/kitchen', label: t('staffLayout.nav.kitchen'), icon: Utensils }]
      : []),
    { href: '/staff/tables', label: t('staffLayout.nav.tables'), icon: QrCode },
  ]

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <div className="staff-sidebar-brand">
          <span className="staff-brand-mark">B</span>
          <div>
            <strong>Bekko Coffee</strong>
            <span>{t('staffLayout.brandSubtitle')}</span>
          </div>
        </div>

        <nav className="staff-sidebar-nav" aria-label={t('staffLayout.nav.menu')}>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`staff-sidebar-link${page.url === href ? ' is-active' : ''}`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        <div className="staff-sidebar-foot">
          <div className="staff-sidebar-user">
            <span className="staff-sidebar-avatar">
              {(page.props.auth?.user?.name || '?').slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{page.props.auth?.user?.name}</strong>
              <span>{roleLabel}</span>
            </div>
          </div>
          <div className="header-controls">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button type="button" onClick={() => router.post('/staff/logout')}>
            <LogOut size={16} /> {t('staffLayout.logout')}
          </button>
        </div>
      </aside>

      <div className="staff-content">
        <header className="staff-content-head">
          <span className="section-eyebrow">{t('staffLayout.nav.menu')}</span>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </header>
        <main className="staff-content-main">{children}</main>
      </div>
    </div>
  )
}
