import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from './i18n/index.jsx'
import { ThemeProvider } from './theme.jsx'
import '../css/app.css'
import '../css/ordering.css'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <ThemeProvider>
        <I18nProvider>
          <App {...props} />
        </I18nProvider>
      </ThemeProvider>,
    )
  },
})
