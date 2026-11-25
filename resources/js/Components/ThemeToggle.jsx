import { Moon, Sun } from 'lucide-react'
import { useI18n } from '../i18n/index.jsx'
import { useTheme } from '../theme.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const isDark = theme === 'dark'
  const label = t(isDark ? 'common.theme.light' : 'common.theme.dark')

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}
