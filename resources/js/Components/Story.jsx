import { Heart, Leaf, Smile } from 'lucide-react'

const values = [
  { icon: Leaf, title: 'Fresh first', text: 'Juices pressed and food prepared fresh each day.' },
  { icon: Smile, title: 'Everyone welcome', text: 'A relaxed spot for friends, family and regulars.' },
  { icon: Heart, title: 'Made with care', text: 'The little details matter, from the first sip to the last bite.' },
]

export default function Story() {
  return (
    <section className="story" id="story">
      <div className="container story-grid">
        <div className="story-card">
          <div className="story-card-shape" />
          <span className="story-quote-mark">“</span>
          <blockquote>
            Good food tastes better when it’s shared with the people you love.
          </blockquote>
          <div className="story-card-foot">
            <span className="story-line" />
            <span>From our family to yours</span>
          </div>
        </div>

        <div className="story-copy">
          <span className="section-eyebrow">Our story</span>
          <h2>A little place with a big heart</h2>
          <p className="story-lead">
            We started with a simple idea: great juice, honest food and a proper cup of coffee,
            all under one roof.
          </p>
          <p className="story-text">
            Whether you’re grabbing a quick macchiato on the way to work, settling in with a
            burger and fries, or catching up over a fresh juice, there’s a seat here for you.
          </p>
          {/* TEMPORARY: swap in the family's real story here. */}
          <p className="story-text story-placeholder">
            [Add a sentence or two about your uncle and how the cafe started.]
          </p>

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
