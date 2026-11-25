import { Heart, Leaf, Smile } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

export default function Story() {
  const { t } = useI18n()

  const values = [
    { icon: Leaf, title: t('home.story.values.0.title'), text: t('home.story.values.0.text') },
    { icon: Smile, title: t('home.story.values.1.title'), text: t('home.story.values.1.text') },
    { icon: Heart, title: t('home.story.values.2.title'), text: t('home.story.values.2.text') },
  ]

  return (
    <section className="story" id="story">
      <div className="container story-grid">
        <div className="story-card">
          <div className="story-card-shape" />
          <span className="story-quote-mark">“</span>
          <blockquote>{t('home.story.quote')}</blockquote>
          <div className="story-card-foot">
            <span className="story-line" />
            <span>{t('home.story.fromFamily')}</span>
          </div>
        </div>

        <div className="story-copy">
          <span className="section-eyebrow">{t('home.story.eyebrow')}</span>
          <h2>{t('home.story.title')}</h2>
          <p className="story-lead">{t('home.story.lead')}</p>
          <p className="story-text">{t('home.story.text')}</p>
          <p className="story-text">{t('home.story.family')}</p>

          <div className="values-list">
            {values.map(({ icon: Icon, title, text }) => (
              <div className="value" key={title}>
                <span className="value-icon"><Icon size={20} /></span>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
