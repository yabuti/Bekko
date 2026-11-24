import { useForm } from '@inertiajs/react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import LanguageSwitcher from '../../Components/LanguageSwitcher'
import { useI18n } from '../../i18n/index.jsx'

export default function Login() {
  const { t } = useI18n()
  const form = useForm({ email: '', password: '' })

  const submit = (event) => {
    event.preventDefault()
    form.post('/staff/login')
  }

  return (
    <div className="login-page">
      <a className="login-back" href="/">← {t('staffLogin.back')}</a>
      <LanguageSwitcher />
      <form className="login-card" onSubmit={submit}>
        <span className="login-mark"><ShieldCheck size={24} /></span>
        <span className="section-eyebrow">{t('staffLogin.eyebrow')}</span>
        <h1>{t('staffLogin.heading')}</h1>
        <p>{t('staffLogin.intro')}</p>

        <label>
          {t('staffLogin.email')}
          <input
            type="email"
            value={form.data.email}
            onChange={(event) => form.setData('email', event.target.value)}
            autoComplete="username"
            required
          />
          {form.errors.email && <span className="field-error">{form.errors.email}</span>}
        </label>

        <label>
          {t('staffLogin.password')}
          <input
            type="password"
            value={form.data.password}
            onChange={(event) => form.setData('password', event.target.value)}
            autoComplete="current-password"
            required
          />
          {form.errors.password && <span className="field-error">{form.errors.password}</span>}
        </label>

        <button className="button button-primary" type="submit" disabled={form.processing}>
          {form.processing ? t('staffLogin.signingIn') : t('staffLogin.signIn')} <ArrowRight size={16} />
        </button>

        <div className="login-hint">
          <strong>{t('staffLogin.demoAccounts')}</strong>
          <span>waiter@bekkocoffee.test · password</span>
          <span>kitchen@bekkocoffee.test · password</span>
          <span>admin@bekkocoffee.test · password</span>
        </div>
      </form>
    </div>
  )
}
