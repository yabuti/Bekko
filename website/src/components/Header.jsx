import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu as MenuIcon, X } from 'lucide-react'
import Logo from './Logo'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'Our story', href: '#story' },
  { label: 'Find us', href: '#visit' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#home" className="brand" aria-label="Back to top">
          <Logo className="brand-logo" />
        </a>

        <nav className={`header-nav${open ? ' is-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            className="nav-mobile-cta"
            href="#menu"
            onClick={() => setOpen(false)}
          >
            See the menu <ArrowUpRight size={16} />
          </a>
        </nav>

        <a className="button button-primary header-cta" href="#menu">
          See the menu <ArrowUpRight size={17} />
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={23} /> : <MenuIcon size={23} />}
        </button>
      </div>
    </header>
  )
}
