import { Beef, Coffee, GlassWater, Heart } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

export default function Highlights() {
  const { t } = useI18n()

  const highlights = [
    { icon: GlassWater, text: t('home.highlights.0.text') },
    { icon: Beef, text: t('home.highlights.1.text') },
    { icon: Coffee, text: t('home.highlights.2.text') },
    { icon: Heart, text: t('home.highlights.3.text') },
  ]

  return (
    <div className="highlights">
      <div className="container highlights-inner">
        {highlights.map(({ icon: Icon, text }, index) => (
          <div className="highlight" key={text}>
            <Icon size={19} strokeWidth={2.1} />
            <span>{text}</span>
            {index < highlights.length - 1 && <span className="highlight-divider" />}
          </div>
        ))}
      </div>
    </div>
  )
}
