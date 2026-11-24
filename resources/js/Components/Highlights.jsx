import { Beef, Coffee, GlassWater, Heart } from 'lucide-react'

const highlights = [
  { icon: GlassWater, text: 'Juice pressed daily' },
  { icon: Beef, text: 'Burgers grilled to order' },
  { icon: Coffee, text: 'Espresso, hot or iced' },
  { icon: Heart, text: 'Made with love' },
]

export default function Highlights() {
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
