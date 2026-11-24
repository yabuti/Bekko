import { ArrowRight, Beef, Coffee, GlassWater, Leaf, MapPin, Sparkles } from 'lucide-react'
import { site } from '../data/site'
import Logo from './Logo'

const floatingCards = [
  { icon: GlassWater, label: 'Fresh juice', className: 'float-juice' },
  { icon: Beef, label: 'Big burgers', className: 'float-burger' },
  { icon: Coffee, label: 'Good coffee', className: 'float-coffee' },
]

const perks = [
  { icon: Leaf, text: 'Pressed & prepared fresh' },
  { icon: Sparkles, text: 'Made to order, always' },
  { icon: Coffee, text: 'Something for everyone' },
]

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" /> {site.badge}
          </span>

          <h1>
            Fresh juice. Big burgers.{' '}
            <span className="text-green">Really good coffee.</span>
          </h1>

          <p className="hero-description">{site.description}</p>

          <div className="hero-actions">
            <a className="button button-primary button-large" href="/menu">
              See the menu <ArrowRight size={18} />
            </a>
            <a className="button button-ghost button-large" href="/#visit">
              <MapPin size={18} /> Find us
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
              <span className="visual-kicker">Welcome to</span>
              <Logo className="visual-logo" />
              <span className="visual-line" />
              <span className="visual-caption">Juice · Burgers · Coffee</span>
            </div>
          </div>

          <span className="open-sticker">OPEN<br />TODAY</span>

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
