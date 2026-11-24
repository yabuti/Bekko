import { Printer, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Staff from '../../Layouts/Staff'
import { useI18n } from '../../i18n/index.jsx'

export default function Tables({ tables }) {
  const { t } = useI18n()
  const urlFor = (code) => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin
    return `${origin}/t/${code}`
  }

  return (
    <Staff
      title={t('staffTables.title')}
      subtitle={t('staffTables.subtitle')}
    >
      <div className="qr-toolbar">
        <span><QrCode size={16} /> {t('staffTables.ready', { count: tables.length })}</span>
        <button type="button" className="button button-primary" onClick={() => window.print()}>
          <Printer size={16} /> {t('staffTables.printAll')}
        </button>
      </div>

      <div className="qr-grid">
        {tables.map((table) => (
          <article className="qr-card-item" key={table.id}>
            <QRCodeSVG
              value={urlFor(table.code)}
              size={148}
              fgColor="#10361d"
              bgColor="#ffffff"
              level="M"
            />
            <strong>{table.name}</strong>
            <span>{urlFor(table.code)}</span>
          </article>
        ))}
      </div>
    </Staff>
  )
}
