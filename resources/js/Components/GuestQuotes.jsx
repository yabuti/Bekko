import { Coffee, Heart, Utensils } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

const quoteIcons = [Coffee, Utensils, Heart]

export default function GuestQuotes() {
  const { t } = useI18n()

  return (
    <section className="guest-section" id="guests">
      <div className="container">
        <div className="section-head guest-head">
          <span className="section-eyebrow">{t('home.guests.eyebrow')}</span>
          <h2>{t('home.guests.title')}</h2>
          <p className="section-subtitle">{t('home.guests.subtitle')}</p>
        </div>

        <div className="quote-grid">
          {quoteIcons.map((Icon, index) => (
            <figure className="quote-card" key={index}>
              <span className="quote-mark" aria-hidden="true">“</span>
              <blockquote>{t(`home.guests.quotes.${index}.quote`)}</blockquote>
              <figcaption className="quote-person">
                <span className="quote-icon"><Icon size={18} strokeWidth={2} /></span>
                <span>
                  <strong>{t(`home.guests.quotes.${index}.role`)}</strong>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
