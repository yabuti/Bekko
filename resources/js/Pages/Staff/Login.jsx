import { useForm } from '@inertiajs/react'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function Login() {
  const form = useForm({ email: '', password: '' })

  const submit = (event) => {
    event.preventDefault()
    form.post('/staff/login')
  }

  return (
    <div className="login-page">
      <a className="login-back" href="/">← Back to website</a>
      <form className="login-card" onSubmit={submit}>
        <span className="login-mark"><ShieldCheck size={24} /></span>
        <span className="section-eyebrow">Staff only</span>
        <h1>Sign in to your dashboard</h1>
        <p>Use your staff account to see orders from every table.</p>

        <label>
          Email address
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
          Password
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
          {form.processing ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} />
        </button>

        <div className="login-hint">
          <strong>Demo accounts</strong>
          <span>waiter@bekkocoffee.test · password</span>
          <span>kitchen@bekkocoffee.test · password</span>
          <span>admin@bekkocoffee.test · password</span>
        </div>
      </form>
    </div>
  )
}
