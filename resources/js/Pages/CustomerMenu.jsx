import { useMemo, useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react'
import LanguageSwitcher from '../Components/LanguageSwitcher'
import { useI18n, useSite } from '../i18n/index.jsx'

export default function CustomerMenu({ table, categories, items }) {
  const { t } = useI18n()
  const site = useSite()
  const currency = site.currency || 'ETB'
  const errors = usePage().props.errors
  const [active, setActive] = useState(categories[0]?.id || '')
  const [cart, setCart] = useState({})
  const [notes, setNotes] = useState('')
  const [placing, setPlacing] = useState(false)

  const categoryLabel = (id, fallback) => t(`menu.categories.${id}.label`) === `menu.categories.${id}.label`
    ? fallback
    : t(`menu.categories.${id}.label`)
  const categoryBlurb = (id, fallback) => t(`menu.categories.${id}.blurb`) === `menu.categories.${id}.blurb`
    ? fallback
    : t(`menu.categories.${id}.blurb`)

  const itemById = useMemo(
    () => Object.fromEntries(items.map((item) => [item.id, item])),
    [items],
  )

  const grouped = useMemo(
    () => categories.map((category) => {
      const categoryItems = items.filter((item) => item.category === category.id)
      const groups = new Map()

      categoryItems.forEach((item) => {
        const label = item.group_label || ''
        if (!groups.has(label)) groups.set(label, [])
        groups.get(label).push(item)
      })

      return {
        ...category,
        groups: [...groups.entries()].map(([label, groupItems]) => ({ label, items: groupItems })),
      }
    }),
    [categories, items],
  )

  const visible = grouped.filter((category) => category.id === active)

  const lines = Object.entries(cart)
    .map(([id, quantity]) => ({ id: Number(id), quantity }))
    .filter((line) => line.quantity > 0)

  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce(
    (sum, line) => sum + (itemById[line.id]?.price || 0) * line.quantity,
    0,
  )

  const changeQuantity = (id, delta) => {
    setCart((current) => {
      const next = { ...current }
      const quantity = (next[id] || 0) + delta
      if (quantity <= 0) delete next[id]
      else next[id] = quantity
      return next
    })
  }

  const placeOrder = () => {
    if (!lines.length || placing) return
    setPlacing(true)
    router.post(`/t/${table.code}/orders`, { items: lines, notes }, {
      onFinish: () => setPlacing(false),
    })
  }

  return (
    <div className="order-page">
      <header className="order-topbar">
        <a className="order-back" href="/">
          <ArrowLeft size={17} /> {t('customerMenu.home')}
        </a>
        <div className="order-table-pill">{table.name} · {table.code}</div>
        <LanguageSwitcher />
      </header>

      <section className="order-hero container">
        <span className="section-eyebrow">{t('customerMenu.eyebrow')}</span>
        <h1>{site.name}</h1>
        <p>{t('customerMenu.intro', { table: table.name })}</p>
      </section>

      <div className="container">
        <div className="menu-toolbar" role="tablist" aria-label={t('customerMenu.categoriesLabel')}>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              role="tab"
              aria-selected={active === category.id}
              className={`filter-pill${active === category.id ? ' is-active' : ''}`}
              onClick={() => setActive(category.id)}
            >
              {categoryLabel(category.id, category.label)}
            </button>
          ))}
        </div>

        {visible.map((category) => (
          <div className="menu-stream" key={category.id}>
            {category.groups.map((group) => (
              <div className="menu-block" key={group.label || 'main'}>
                <div className="category-heading screen-only">
                  <div>
                    <h3>{categoryLabel(category.id, category.label)}</h3>
                    <p>{categoryBlurb(category.id, category.blurb)}</p>
                  </div>
                </div>
                {group.label && <h4 className="group-heading">{group.label}</h4>}

                <div className="category-items">
                  {group.items.map((item) => (
                    <article className="menu-item order-item" key={item.id}>
                      <img className="item-image" src={item.image} alt="" loading="lazy" />
                      <div className="item-info">
                        <div className="item-top">
                          <h5>{item.name}</h5>
                        </div>
                        <span className="item-price">{currency} {item.price}</span>
                      </div>
                      {cart[item.id] ? (
                        <div className="quantity-control">
                          <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={t('customerMenu.removeOne', { item: item.name })}>
                            <Minus size={15} />
                          </button>
                          <strong>{cart[item.id]}</strong>
                          <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={t('customerMenu.addOne', { item: item.name })}>
                            <Plus size={15} />
                          </button>
                        </div>
                      ) : (
                        <button type="button" className="add-button" onClick={() => changeQuantity(item.id, 1)}>
                          <Plus size={16} /> {t('customerMenu.add')}
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="cart-dock">
        <div className="container cart-dock-inner">
          <div className="cart-summary">
            <span className="cart-icon"><ShoppingBag size={20} /></span>
            <div>
              <strong>
                {count
                  ? count === 1
                    ? t('customerMenu.itemOne')
                    : t('customerMenu.itemMany', { count })
                  : t('customerMenu.cartEmpty')}
              </strong>
              <span>{currency} {total}</span>
            </div>
          </div>
          <div className="cart-actions">
            <input
              type="text"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={t('customerMenu.notesPlaceholder')}
              maxLength={500}
            />
            <button
              type="button"
              className="button button-primary"
              disabled={!count || placing}
              onClick={placeOrder}
            >
              {placing ? t('customerMenu.sending') : t('customerMenu.placeOrder')} <Plus size={16} />
            </button>
          </div>
        </div>
        {errors.items && <p className="cart-error container">{errors.items}</p>}
        {errors.notes && <p className="cart-error container">{errors.notes}</p>}
      </div>
    </div>
  )
}
