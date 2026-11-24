import { useEffect, useMemo, useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { ImagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import StaffSidebar from '../../Layouts/StaffSidebar'
import { useI18n, useSite } from '../../i18n/index.jsx'

const fallbackFor = (category) => ({
  breakfast: '/images/breakfast.svg',
  lunch: '/images/lunch.svg',
  bites: '/images/burger.svg',
  drinks: '/images/coffee.svg',
  fresh: '/images/juice.svg',
}[category] || '/images/lunch.svg')

export default function MenuManager({ categories = [], items = [] }) {
  const { t } = useI18n()
  const site = useSite()
  const errors = usePage().props.errors || {}
  const flash = usePage().props.flash?.success
  const [flashHidden, setFlashHidden] = useState(false)

  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState({
    name: '',
    category: categories[0]?.id ?? 'breakfast',
    group_label: '',
    price: '',
    sort_order: '',
    photo: null,
    removePhoto: false,
  })
  const [preview, setPreview] = useState('')

  useEffect(() => {
    setFlashHidden(false)
  }, [flash])

  useEffect(() => {
    if (!form.photo) {
      setPreview('')
      return undefined
    }

    const url = URL.createObjectURL(form.photo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [form.photo])

  const categoryLabel = (id, fallback) => t(`menu.categories.${id}.label`) === `menu.categories.${id}.label`
    ? fallback
    : t(`menu.categories.${id}.label`)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return items.filter((item) => {
      const inCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matches = !needle
        || item.name.toLowerCase().includes(needle)
        || (item.group_label || '').toLowerCase().includes(needle)

      return inCategory && matches
    })
  }, [items, query, categoryFilter])

  const openAdd = () => {
    setEditing(null)
    setForm({
      name: '',
      category: categoryFilter === 'all' ? (categories[0]?.id ?? 'breakfast') : categoryFilter,
      group_label: '',
      price: '',
      sort_order: '',
      photo: null,
      removePhoto: false,
    })
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name: item.name,
      category: item.category,
      group_label: item.group_label || '',
      price: String(item.price),
      sort_order: item.sort_order == null ? '' : String(item.sort_order),
      photo: null,
      removePhoto: false,
    })
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return
    setShowForm(false)
    setEditing(null)
  }

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = (event) => {
    event.preventDefault()
    if (saving) return

    setSaving(true)
    const payload = new FormData()
    payload.append('name', form.name)
    payload.append('category', form.category)
    payload.append('group_label', form.group_label)
    payload.append('price', form.price)
    payload.append('sort_order', form.sort_order === '' ? '0' : form.sort_order)
    if (form.photo) payload.append('image', form.photo)
    if (editing && form.removePhoto) payload.append('remove_photo', '1')

    const options = {
      preserveScroll: true,
      onFinish: () => setSaving(false),
      onSuccess: () => {
        setShowForm(false)
        setEditing(null)
      },
    }

    if (editing) {
      payload.append('_method', 'put')
      router.post(`/staff/menu/${editing.id}`, payload, options)
    } else {
      router.post('/staff/menu', payload, options)
    }
  }

  const remove = (item) => {
    if (!window.confirm(t('staffMenu.confirmDelete', { name: item.name }))) return

    setDeleting(item.id)
    router.delete(`/staff/menu/${item.id}`, {
      preserveScroll: true,
      onFinish: () => setDeleting(null),
    })
  }

  const currentImage = preview
    || (editing?.image && !form.removePhoto ? editing.image : fallbackFor(form.category))
  const flashMessage = flash
    ? (flash.startsWith('staffMenu.flash.') ? t(flash) : flash)
    : ''

  return (
    <StaffSidebar title={t('staffMenu.title')} subtitle={t('staffMenu.subtitle')}>
      {flashMessage && !flashHidden && (
        <div className="admin-flash" role="status">
          <span>{flashMessage}</span>
          <button type="button" onClick={() => setFlashHidden(true)} aria-label={t('staffMenu.close')}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={17} />
          <input
            type="search"
            value={query}
            placeholder={t('staffMenu.search')}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <select
          className="admin-filter"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label={t('staffMenu.fields.category')}
        >
          <option value="all">{t('staffMenu.allCategories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {categoryLabel(category.id, category.label)}
            </option>
          ))}
        </select>
        <span className="admin-count">{t('staffMenu.itemsCount', { count: filtered.length })}</span>
        <button type="button" className="button button-primary" onClick={openAdd}>
          <Plus size={16} /> {t('staffMenu.addMeal')}
        </button>
      </div>

      {filtered.length ? (
        <div className="admin-grid">
          {filtered.map((item) => (
            <article className="admin-item-card" key={item.id}>
              <div className="admin-item-photo">
                <img src={item.image || fallbackFor(item.category)} alt="" loading="lazy" />
              </div>
              <div className="admin-item-body">
                <span className="admin-item-meta">
                  {categoryLabel(item.category, item.category)}
                  {item.group_label ? ` · ${item.group_label}` : ''}
                </span>
                <h3>{item.name}</h3>
                <strong>{site.currency} {item.price}</strong>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => openEdit(item)}>
                    <Pencil size={15} /> {t('staffMenu.edit')}
                  </button>
                  <button
                    type="button"
                    className="is-danger"
                    disabled={deleting === item.id}
                    onClick={() => remove(item)}
                  >
                    <Trash2 size={15} /> {t('staffMenu.delete')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="staff-empty">{t('staffMenu.noResults')}</p>
      )}

      {showForm && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm()
          }}
        >
          <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-form-title">
            <div className="admin-modal-head">
              <h2 id="admin-form-title">{editing ? t('staffMenu.edit') : t('staffMenu.addMeal')}</h2>
              <button type="button" onClick={closeForm} aria-label={t('staffMenu.close')}>
                <X size={18} />
              </button>
            </div>

            <form className="admin-form" onSubmit={submit}>
              <label>
                <span>{t('staffMenu.fields.name')}</span>
                <input
                  type="text"
                  value={form.name}
                  maxLength={255}
                  required
                  onChange={(event) => change('name', event.target.value)}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>

              <div className="admin-form-row">
                <label>
                  <span>{t('staffMenu.fields.category')}</span>
                  <select value={form.category} onChange={(event) => change('category', event.target.value)}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {categoryLabel(category.id, category.label)}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="field-error">{errors.category}</span>}
                </label>
                <label>
                  <span>{t('staffMenu.fields.group')}</span>
                  <input
                    type="text"
                    value={form.group_label}
                    maxLength={255}
                    onChange={(event) => change('group_label', event.target.value)}
                  />
                  {errors.group_label && <span className="field-error">{errors.group_label}</span>}
                </label>
              </div>

              <div className="admin-form-row">
                <label>
                  <span>{t('staffMenu.fields.price')}</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    required
                    onChange={(event) => change('price', event.target.value)}
                  />
                  {errors.price && <span className="field-error">{errors.price}</span>}
                </label>
                <label>
                  <span>{t('staffMenu.fields.sortOrder')}</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.sort_order}
                    onChange={(event) => change('sort_order', event.target.value)}
                  />
                  {errors.sort_order && <span className="field-error">{errors.sort_order}</span>}
                </label>
              </div>

              <div className="admin-photo-field">
                <img src={currentImage} alt="" />
                <div>
                  <label className="admin-upload">
                    <ImagePlus size={16} />
                    {form.photo
                      ? form.photo.name
                      : editing?.image
                        ? t('staffMenu.replacePhoto')
                        : t('staffMenu.uploadPhoto')}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => change('photo', event.target.files?.[0] || null)}
                    />
                  </label>
                  {editing?.image && (
                    <label className="admin-remove-photo">
                      <input
                        type="checkbox"
                        checked={form.removePhoto}
                        onChange={(event) => change('removePhoto', event.target.checked)}
                      />
                      {t('staffMenu.removePhoto')}
                    </label>
                  )}
                  <small>{t('staffMenu.photoHint')}</small>
                  {errors.image && <span className="field-error">{errors.image}</span>}
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="button button-outline" onClick={closeForm}>
                  {t('staffMenu.cancel')}
                </button>
                <button type="submit" className="button button-primary" disabled={saving}>
                  {saving
                    ? (editing ? t('staffMenu.saving') : t('staffMenu.adding'))
                    : t('staffMenu.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StaffSidebar>
  )
}
