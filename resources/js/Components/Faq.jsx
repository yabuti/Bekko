import { Plus } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

const questions = [0, 1, 2, 3, 4]

export default function Faq() {
  const { t } = useI18n()

  return (
    <section className="faq-section" id="faq">
      <div className="container faq-grid">
        <div className="faq-intro">
          <span className="section-eyebrow">{t('home.faq.eyebrow')}</span>
          <h2>{t('home.faq.title')}</h2>
          <p className="section-subtitle">{t('home.faq.subtitle')}</p>
          <a className="text-link" href="#visit">{t('common.nav.visit')}</a>
        </div>

        <div className="faq-list">
          {questions.map((index) => (
            <details className="faq-item" key={index} open={index === 0}>
              <summary>
                <span>{t(`home.faq.items.${index}.question`)}</span>
                <Plus className="faq-icon" size={18} aria-hidden="true" />
              </summary>
              <p>{t(`home.faq.items.${index}.answer`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
