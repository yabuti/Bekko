import { ArrowRight, Beef, Coffee, GlassWater, Leaf, MapPin, Sparkles } from 'lucide-react'
import { useI18n, useSite } from '../i18n/index.jsx'
import { useOpenStatus } from '../openHours'
import Logo from './Logo'

export default function Hero() {
  const { t } = useI18n()
  const site = useSite()
  const { isOpen, schedule } = useOpenStatus(site.hours)

  const badge = isOpen ? t('common.site.badgeOpen') : t('common.site.badgeClosed')
  const stickerTop = isOpen ? t('home.hero.openNow') : t('home.hero.closedNow')
  const stickerBottom = isOpen
    ? schedule?.dayKey === 'sunday'
      ? t('home.hero.sundayCloseHint')
      : t('home.hero.openHint')
    : t('home.hero.closedHint')

  const floatingCards = [
    { icon: GlassWater, label: t('home.hero.floating.juice'), className: 'float-juice' },
    { icon: Beef, label: t('home.hero.floating.burgers'), className: 'float-burger' },
    { icon: Coffee, label: t('home.hero.floating.coffee'), className: 'float-coffee' },
  ]

  const perks = [
    { icon: Leaf, text: t('home.hero.perks.0.text') },
    { icon: Sparkles, text: t('home.hero.perks.1.text') },
    { icon: Coffee, text: t('home.hero.perks.2.text') },
  ]

  return (
    <section className="hero" id="home">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" /> {badge}
          </span>

          <h1>
            {t('home.hero.title1')}{' '}
            <span className="text-green">{t('home.hero.title2')}</span>
          </h1>

          <p className="hero-description">{site.description}</p>

          <div className="hero-actions">
            <a className="button button-primary button-large" href="/menu">
              {t('common.nav.seeMenu')} <ArrowRight size={18} />
            </a>
            <a className="button button-ghost button-large" href="/#visit">
              <MapPin size={18} /> {t('home.hero.findUs')}
            </a>
          </div>

          <ul className="hero-perks">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="perk-icon"><Icon size={15} /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="visual-blob" />
          <div className="visual-card">
            <div className="visual-card-inner">
              <span className="visual-kicker">{t('home.hero.welcome')}</span>
              <Logo className="visual-logo" />
              <span className="visual-line" />
              <span className="visual-caption">{t('home.hero.caption')}</span>
            </div>
          </div>

          <span className={`open-sticker${isOpen ? '' : ' is-closed'}`}>
            {stickerTop}<br />{stickerBottom}
          </span>

          {floatingCards.map(({ icon: Icon, label, className }) => (
            <div className={`float-card ${className}`} key={label}>
              <span className="float-icon"><Icon size={18} /></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
