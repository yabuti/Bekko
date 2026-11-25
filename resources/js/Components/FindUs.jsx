import { ArrowUpRight, Camera, Clock, MapPin, Phone, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useI18n, useSite } from '../i18n/index.jsx'

export default function FindUs({ menuUrl }) {
  const { t } = useI18n()
  const site = useSite()

  return (
    <section className="visit" id="visit">
      <div className="container">
        <div className="section-head visit-head">
          <div>
            <span className="section-eyebrow">{t('home.visit.eyebrow')}</span>
            <h2>{t('home.visit.title')}</h2>
            <p className="section-subtitle">{t('home.visit.subtitle')}</p>
          </div>
        </div>

        <div className="visit-grid">
          <div className="visit-info">
            <div className="info-card">
              <span className="info-icon"><Clock size={21} /></span>
              <div>
                <h3>{t('home.visit.openingHours')}</h3>
                <ul className="hours-list">
                  {site.hours.map(({ day, time }) => (
                    <li key={day}><span>{day}</span><strong>{time}</strong></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon"><MapPin size={21} /></span>
              <div>
                <h3>{t('home.visit.whereToFindUs')}</h3>
                <p className="address">
                  {site.address.map((line) => <span key={line}>{line}</span>)}
                </p>
                <a className="text-link" href={site.directionsUrl} target="_blank" rel="noreferrer">
                  {t('home.visit.getDirections')} <ArrowUpRight size={15} />
                </a>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon"><Phone size={21} /></span>
              <div>
                <h3>{t('home.visit.getInTouch')}</h3>
                <p className="address">
                  <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                <a className="text-link" href={site.instagramUrl} target="_blank" rel="noreferrer">
                  <Camera size={15} /> {site.instagram}
                </a>
              </div>
            </div>
          </div>

          <div className="visit-side">
            <div className="map-card" aria-label={t('common.site.mapPlaceholder')}>
              <div className="map-grid" />
              <div className="map-road map-road-one" />
              <div className="map-road map-road-two" />
              <span className="map-pin"><MapPin size={26} fill="currentColor" /></span>
              <div className="map-label">{site.name}</div>
              {/* Illustrated preview until a real map embed is supplied. */}
              <span className="map-note">{t('common.site.mapNote')}</span>
            </div>

            <div className="qr-card">
              <div className="qr-code">
                <QRCodeSVG value={menuUrl} size={88} fgColor="#10361d" bgColor="#ffffff" level="M" />
              </div>
              <div>
                <span className="qr-label"><QrCode size={15} /> {t('common.site.scanAtTable')}</span>
                <h3>{t('home.visit.menuOnPhone')}</h3>
                <p>{t('home.visit.pointCamera')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
