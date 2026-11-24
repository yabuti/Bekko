import { router, usePage } from '@inertiajs/react'
import { ClipboardList, QrCode, Utensils } from 'lucide-react'

export default function Staff({ title, subtitle, children }) {
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
              <span>Staff dashboard</span>
            </div>
          </div>
          <nav className="staff-nav">
            {(role === 'waiter' || role === 'admin') && (
              <a href="/staff/waiter"><ClipboardList size={16} /> Waiter</a>
            )}
            {(role === 'kitchen' || role === 'admin') && (
              <a href="/staff/kitchen"><Utensils size={16} /> Kitchen</a>
            )}
            <a href="/staff/tables"><QrCode size={16} /> Table QR</a>
          </nav>
          <div className="staff-user">
            <span>{auth?.user?.name}</span>
            <button type="button" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="container staff-main">
        <div className="staff-head">
          <div>
            <span className="section-eyebrow">Live orders</span>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <span className="live-badge">Updates every 5 seconds</span>
        </div>
        {children}
      </main>
    </div>
  )
}
