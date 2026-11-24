import { Printer, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Staff from '../../Layouts/Staff'

export default function Tables({ tables }) {
  const urlFor = (code) => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin
    return `${origin}/t/${code}`
  }

  return (
    <Staff
      title="Table QR codes"
      subtitle="Print one code per table and place it where customers can scan it."
    >
      <div className="qr-toolbar">
        <span><QrCode size={16} /> {tables.length} tables ready</span>
        <button type="button" className="button button-primary" onClick={() => window.print()}>
          <Printer size={16} /> Print all QR codes
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
