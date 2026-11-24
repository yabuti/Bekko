import { useState } from 'react'
import { Beef, Coffee, GlassWater, Printer, Utensils } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { menu } from '../data/menu'
import { itemImage } from '../data/menuImages'
import { site } from '../data/site'
import Logo from './Logo'

const categoryIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  bites: Beef,
  drinks: Coffee,
  fresh: GlassWater,
}

const filters = menu.map(({ id, label }) => ({ id, label }))

export default function MenuSection({ menuUrl }) {
  const [active, setActive] = useState('breakfast')
  const visible = active === 'all' ? menu : menu.filter((category) => category.id === active)

  const handlePrint = () => {
    // Print the whole menu, then return to the category the user was viewing.
    const previous = active
    const restore = () => {
      setActive(previous)
      window.removeEventListener('afterprint', restore)
    }
    window.addEventListener('afterprint', restore)
    setActive('all')
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()))
  }

  return (
    <section className="menu-section" id="menu">
      <div className="print-menu-header">
        <div className="print-brand">
          <div className="print-logo-box"><Logo className="print-logo" /></div>
          <div>
            <h2>{site.name}</h2>
            <p>{site.tagline}</p>
          </div>
        </div>
        <div className="print-qr">
          <QRCodeSVG value={menuUrl} size={78} fgColor="#10361d" bgColor="#ffffff" level="M" />
          <span>Scan for the menu</span>
        </div>
      </div>

      <div className="container">
        <div className="menu-page-nav">
          <a href="#home">← Back to home</a>
          <span>Menu</span>
        </div>

        <div className="section-head menu-head">
          <div>
            <span className="section-eyebrow">The menu</span>
            <h2>Something for every craving</h2>
            <p className="section-subtitle">
              From breakfast favourites to fresh juice and ice-cold mojitos — there’s something for every craving.
            </p>
          </div>
          <button type="button" className="button button-outline print-button" onClick={handlePrint}>
            <Printer size={17} /> Print menu
          </button>
        </div>

        <div className="menu-toolbar" role="tablist" aria-label="Menu categories">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.id}
              role="tab"
              aria-selected={active === filter.id}
              className={`filter-pill${active === filter.id ? ' is-active' : ''}`}
              onClick={() => setActive(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="menu-stream">
          {visible.flatMap((category) => {
            const Icon = categoryIcons[category.id]

            return category.groups.map((group, groupIndex) => (
              <div className="menu-block" key={`${category.id}-${group.label || 'main'}`}>
                {groupIndex === 0 && (
                  <>
                    <h3 className="print-category">{category.label}</h3>
                    <div className="category-heading screen-only">
                      <span className="category-icon"><Icon size={20} /></span>
                      <div>
                        <h3>{category.label}</h3>
                        <p>{category.blurb}</p>
                      </div>
                    </div>
                  </>
                )}

                {group.label && (
                  <>
                    <h4 className="group-heading screen-only">{group.label}</h4>
                    <h4 className="print-group">{group.label}</h4>
                  </>
                )}

                <div className="category-items">
                  {group.items.map((item) => (
                    <article className="menu-item" key={item.name}>
                      <img
                        className="item-image"
                        src={itemImage(item.name, category.id, group.label)}
                        alt=""
                        loading="lazy"
                      />
                      <div className="item-info">
                        <div className="item-top">
                          <h5>{item.name}</h5>
                          {item.tag && <span className="item-tag">{item.tag}</span>}
                        </div>
                        {item.description && <p className="item-description">{item.description}</p>}
                      </div>
                      <span className="item-price">{site.currency} {item.price}</span>
                    </article>
                  ))}
                </div>
              </div>
            ))
          })}
        </div>
      </div>
    </section>
  )
}
