import { useId } from 'react'
import { useForm } from '@inertiajs/react'
import { ArrowRight, Hash } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'

export default function TableEntryForm({ compact = false }) {
  const { t } = useI18n()
  const inputId = useId()
  const form = useForm({ table_number: '' })

  const change = (event) => {
    form.setData('table_number', event.target.value)
    if (form.errors.table_number) form.clearErrors('table_number')
  }

  const submit = (event) => {
    event.preventDefault()

    const value = form.data.table_number.trim()

    if (!value) {
      form.setError('table_number', t('tableEntry.errorRequired'))
      return
    }

    if (!/^T?\s*\d{1,2}$/i.test(value)) {
      form.setError('table_number', t('tableEntry.errorInvalid'))
      return
    }

    form.clearErrors('table_number')
    form.post('/order/table', {
      onError: () => form.setError('table_number', t('tableEntry.errorNotFound')),
    })
  }

  return (
    <form className={`table-entry${compact ? ' is-compact' : ''}`} onSubmit={submit} noValidate>
      <span className="table-entry-icon"><Hash size={20} /></span>

      <div className="table-entry-copy">
        <span className="table-entry-eyebrow">{t('tableEntry.eyebrow')}</span>
        <h3>{t('tableEntry.title')}</h3>
        <p>{t('tableEntry.description')}</p>
      </div>

      <div className="table-entry-controls">
        <label htmlFor={inputId}>{t('tableEntry.label')}</label>
        <div className="table-entry-row">
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            value={form.data.table_number}
            onChange={change}
            placeholder={t('tableEntry.placeholder')}
            aria-invalid={Boolean(form.errors.table_number)}
            aria-describedby={`${inputId}-help`}
          />
          <button className="button button-primary" type="submit" disabled={form.processing}>
            {form.processing ? t('tableEntry.submitting') : t('tableEntry.button')}
            <ArrowRight size={16} />
          </button>
        </div>
        <span className="table-entry-help" id={`${inputId}-help`}>{t('tableEntry.help')}</span>
        {form.errors.table_number && (
          <span className="table-entry-error" role="alert">{form.errors.table_number}</span>
        )}
      </div>
    </form>
  )
}
