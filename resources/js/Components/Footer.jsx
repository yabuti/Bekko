import { ArrowUpRight, Camera } from 'lucide-react'
import { useI18n, useSite } from '../i18n/index.jsx'
import Logo from './Logo'

const year = new Date().getFullYear()

export default function Footer() {
  const { t } = useI18n()
  const site = useSite()

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo-box"><Logo className="footer-logo" /></div>
          <p>{site.tagline}</p>
        </div>

        <div className="footer-col">
          <h4>{t('home.footer.explore')}</h4>
          <a href="/#home">{t('common.nav.home')}</a>
          <a href="/menu">{t('common.nav.menu')}</a>
          <a href="/#story">{t('common.nav.story')}</a>
          <a href="/#visit">{t('common.nav.visit')}</a>
        </div>

        <div className="footer-col">
          <h4>{t('home.footer.visit')}</h4>
          {site.hours.map(({ day, time }) => (
            <p key={day}>{day}: {time}</p>
          ))}
          <a className="footer-inline-link" href={site.directionsUrl} target="_blank" rel="noreferrer">
            {t('home.footer.directions')} <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="footer-col">
          <h4>{t('home.footer.sayHi')}</h4>
          <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a className="footer-inline-link" href={site.instagramUrl} target="_blank" rel="noreferrer">
            <Camera size={14} /> {site.instagram}
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {year} {site.name}. {t('home.footer.madeWithLove')}</span>
        <a href="/#home">{t('common.nav.backToTop')} ↑</a>
      </div>
    </footer>
  )
}
