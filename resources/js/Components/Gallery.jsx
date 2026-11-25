import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

const photos = [
  { src: '/breakfast/special%20chechebsa.webp', className: 'gallery-tile--feature' },
  { src: '/drink/Espresso.webp', className: 'gallery-tile--wide' },
  { src: '/lunch/Special%20Burger.webp', className: 'gallery-tile--small' },
  { src: '/lunch/Fruit%20Punch.webp', className: 'gallery-tile--small' },
  { src: '/lunch/Special%20Pizza.webp', className: 'gallery-tile--wide' },
  { src: '/drink/Macchiato.webp', className: 'gallery-tile--wide' },
]

export default function Gallery() {
  const { t } = useI18n()

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-head gallery-head">
          <div>
            <span className="section-eyebrow">{t('home.gallery.eyebrow')}</span>
            <h2>{t('home.gallery.title')}</h2>
            <p className="section-subtitle">{t('home.gallery.subtitle')}</p>
          </div>
          <a className="text-link gallery-link" href="/menu">
            {t('common.nav.seeMenu')}
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="gallery-grid">
          {photos.map(({ src, className }, index) => {
            const caption = t(`home.gallery.items.${index}.caption`)

            return (
              <figure className={`gallery-tile ${className}`} key={src}>
                <img src={src} alt={caption} loading="lazy" decoding="async" />
                <figcaption>{caption}</figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
