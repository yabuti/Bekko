import { useState } from 'react'
import { Beef, ChevronDown, Coffee, GlassWater, Printer, Utensils } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { menu } from '../data/menu'
import { itemImage } from '../data/menuImages'
import { useI18n, useSite } from '../i18n/index.jsx'
import Logo from './Logo'
import MenuItemDetail from './MenuItemDetail'

const categoryIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  bites: Beef,
  drinks: Coffee,
  fresh: GlassWater,
}

const PAGE_SIZE = 12

function paginateCategory(category, limit) {
  const groups = []
  let remaining = limit

  category.groups.forEach((group) => {
    if (remaining <= 0) return

    const items = group.items.slice(0, remaining)
    if (!items.length) return

    groups.push({ ...group, items })
    remaining -= items.length
  })

  return groups
}

export default function MenuSection({ menuUrl, categories, items }) {
  const { t } = useI18n()
  const site = useSite()
  const sourceCategories = categories ?? menu
  const [active, setActive] = useState(sourceCategories[0]?.id ?? 'breakfast')
  const [selected, setSelected] = useState(null)
  const [limits, setLimits] = useState({})

  // Database-backed items are grouped here so admin edits show up on the public menu.
  const view = sourceCategories.map((category) => {
    if (!items) return category

    const groups = new Map()
    items.filter((item) => item.category === category.id).forEach((item) => {
      const label = item.group_label || ''
      if (!groups.has(label)) groups.set(label, [])
      groups.get(label).push(item)
    })

    return {
      ...category,
      groups: [...groups.entries()].map(([label, groupItems]) => ({ label, items: groupItems })),
    }
  })

  const filters = view.map(({ id }) => ({ id }))
  const visible = active === 'all' ? view : view.filter((category) => category.id === active)

  const currentCategory = view.find((category) => category.id === active)
  const currentTotal = currentCategory
    ? currentCategory.groups.reduce((sum, group) => sum + group.items.length, 0)
    : 0
  const currentLimit = active === 'all' ? currentTotal : limits[active] ?? PAGE_SIZE
  const currentShown = Math.min(currentLimit, currentTotal)
  const canLoadMore = active !== 'all' && currentShown < currentTotal

  const categoryLabel = (id, fallback) => t(`menu.categories.${id}.label`) === `menu.categories.${id}.label`
    ? fallback
    : t(`menu.categories.${id}.label`)
  const categoryBlurb = (id, fallback) => t(`menu.categories.${id}.blurb`) === `menu.categories.${id}.blurb`
    ? fallback
    : t(`menu.categories.${id}.blurb`)

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
          <span>{t('common.site.scanForMenu')}</span>
        </div>
      </div>

      <div className="container">
        <div className="menu-page-nav">
          <a href="/">← {t('common.site.backToHome')}</a>
          <span>{t('common.nav.menu')}</span>
        </div>

        <div className="section-head menu-head">
          <div>
            <span className="section-eyebrow">{t('menu.eyebrow')}</span>
            <h2>{t('menu.heading')}</h2>
            <p className="section-subtitle">{t('menu.subtitle')}</p>
          </div>
          <button type="button" className="button button-outline print-button" onClick={handlePrint}>
            <Printer size={17} /> {t('menu.print')}
          </button>
        </div>

        <div className="menu-toolbar" role="tablist" aria-label={t('menu.categoriesLabel')}>
          {filters.map((filter) => {
            const category = view.find((entry) => entry.id === filter.id)
            return (
              <button
                type="button"
                key={filter.id}
                role="tab"
                aria-selected={active === filter.id}
                className={`filter-pill${active === filter.id ? ' is-active' : ''}`}
                onClick={() => setActive(filter.id)}
              >
                {categoryLabel(filter.id, category?.label)}
              </button>
            )
          })}
        </div>

        <div className="menu-stream">
          {visible.flatMap((category) => {
            const Icon = categoryIcons[category.id] ?? Utensils
            const limit = active === 'all' ? Infinity : limits[category.id] ?? PAGE_SIZE

            return paginateCategory(category, limit).map((group, groupIndex) => (
              <div className="menu-block" key={`${category.id}-${group.label || 'main'}`}>
                {groupIndex === 0 && (
                  <>
                    <h3 className="print-category">{categoryLabel(category.id, category.label)}</h3>
                    <div className="category-heading screen-only">
                      <span className="category-icon"><Icon size={20} /></span>
                      <div>
                        <h3>{categoryLabel(category.id, category.label)}</h3>
                        <p>{categoryBlurb(category.id, category.blurb)}</p>
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

                <div className="formal-grid">
                  {group.items.map((item, index) => {
                    const image = item.image || itemImage(item.name, category.id, group.label)

                    return (
                      <button
                        type="button"
                        className={`formal-item${index % 2 === 1 ? ' is-reversed' : ''}`}
                        key={item.id ?? item.name}
                        onClick={() => setSelected({
                          item: { ...item, image },
                          category: categoryLabel(category.id, category.label),
                          group: group.label,
                        })}
                        aria-label={`${t('menuDetail.view')}: ${item.name}`}
                      >
                        <div className="formal-item-photo">
                          <img src={image} alt="" loading="lazy" />
                        </div>
                        <div className="formal-item-body">
                          <div className="formal-item-top">
                            <h5>{item.name}</h5>
                            <span className="formal-item-price">{site.currency} {item.price}</span>
                          </div>
                          {item.tag && <span className="formal-item-tag">{item.tag}</span>}
                          {item.description && <p className="formal-item-description">{item.description}</p>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          })}
        </div>

        {canLoadMore && (
          <div className="menu-more">
            <button
              type="button"
              className="button button-outline"
              onClick={() => setLimits((current) => ({
                ...current,
                [active]: (current[active] ?? PAGE_SIZE) + PAGE_SIZE,
              }))}
            >
              <ChevronDown size={17} /> {t('menu.loadMore')}
            </button>
            <span>{t('menu.showing', { shown: currentShown, total: currentTotal })}</span>
          </div>
        )}
      </div>

      <MenuItemDetail
        item={selected?.item}
        category={selected?.category}
        group={selected?.group}
        currency={site.currency}
        onClose={() => setSelected(null)}
      />
    </section>
  )
}
