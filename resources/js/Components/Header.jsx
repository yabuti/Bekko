import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu as MenuIcon, X } from 'lucide-react'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useI18n, useSite } from '../i18n/index.jsx'
import { useOpenStatus } from '../openHours'

export default function Header() {
  const { t } = useI18n()
  const site = useSite()
  const { isOpen } = useOpenStatus(site.hours)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const badge = isOpen ? t('common.site.badgeOpen') : t('common.site.badgeClosed')

  const links = [
    { label: t('common.nav.home'), href: '/#home' },
    { label: t('common.nav.menu'), href: '/menu' },
    { label: t('common.nav.story'), href: '/#story' },
    { label: t('common.nav.visit'), href: '/#visit' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="/#home" className="brand" aria-label={t('common.nav.backToTop')}>
          <Logo className="brand-logo" />
          <span className="brand-wordmark">
            <strong>{site.name}</strong>
            <small>{badge}</small>
          </span>
        </a>

        <nav className={`header-nav${open ? ' is-open' : ''}`} aria-label={t('common.nav.mainNavigation')}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="header-controls header-controls--mobile">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <a
            className="nav-mobile-cta"
            href="/menu"
            onClick={() => setOpen(false)}
          >
            {t('common.nav.seeMenu')} <ArrowUpRight size={16} />
          </a>
        </nav>

        <div className="header-controls header-controls--desktop">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <a className="button button-primary header-cta" href="/menu">
          {t('common.nav.seeMenu')} <ArrowUpRight size={17} />
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? t('common.nav.closeMenu') : t('common.nav.openMenu')}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={23} /> : <MenuIcon size={23} />}
        </button>
      </div>
    </header>
  )
}
