import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

const photos = [
  '/breakfast/special%20chechebsa.webp',
  '/drink/Espresso.webp',
  '/lunch/Special%20Burger.webp',
  '/lunch/Fruit%20Punch.webp',
  '/lunch/Special%20Pizza.webp',
  '/drink/Macchiato.webp',
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
          {photos.map((src, index) => {
            const caption = t(`home.gallery.items.${index}.caption`)

            return (
              <figure className="gallery-tile" key={src}>
                <div className="gallery-image">
                  <img src={src} alt={caption} loading="lazy" decoding="async" />
                </div>
                <figcaption>{caption}</figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
