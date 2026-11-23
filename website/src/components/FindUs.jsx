import { ArrowUpRight, Camera, Clock, MapPin, Phone, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { directionsUrl, site } from '../data/site'

export default function FindUs({ menuUrl }) {
  return (
    <section className="visit" id="visit">
      <div className="container">
        <div className="section-head visit-head">
          <div>
            <span className="section-eyebrow">Find us</span>
            <h2>Come say hello</h2>
            <p className="section-subtitle">Pull up a chair — the coffee’s on.</p>
          </div>
        </div>

        <div className="visit-grid">
          <div className="visit-info">
            <div className="info-card">
              <span className="info-icon"><Clock size={21} /></span>
              <div>
                <h3>Opening hours</h3>
                <ul className="hours-list">
                  {site.hours.map(({ day, time }) => (
                    <li key={day}><span>{day}</span><strong>{time}</strong></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon"><MapPin size={21} /></span>
              <div>
                <h3>Where to find us</h3>
                <p className="address">
                  {site.address.map((line) => <span key={line}>{line}</span>)}
                </p>
                <a className="text-link" href={directionsUrl} target="_blank" rel="noreferrer">
                  Get directions <ArrowUpRight size={15} />
                </a>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon"><Phone size={21} /></span>
              <div>
                <h3>Get in touch</h3>
                <p className="address">
                  <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                <a className="text-link" href={site.instagramUrl} target="_blank" rel="noreferrer">
                  <Camera size={15} /> {site.instagram}
                </a>
              </div>
            </div>
          </div>

          <div className="visit-side">
            <div className="map-card" aria-label="Map placeholder">
              <div className="map-grid" />
              <div className="map-road map-road-one" />
              <div className="map-road map-road-two" />
              <span className="map-pin"><MapPin size={26} fill="currentColor" /></span>
              <div className="map-label">{site.name}</div>
              {/* TEMPORARY: replace with a Google Maps embed once the real address is set. */}
              <span className="map-note">Map preview — add your real address</span>
            </div>

            <div className="qr-card">
              <div className="qr-code">
                <QRCodeSVG value={menuUrl} size={88} fgColor="#10361d" bgColor="#ffffff" level="M" />
              </div>
              <div>
                <span className="qr-label"><QrCode size={15} /> Scan at your table</span>
                <h3>The menu, on your phone</h3>
                <p>Point your camera here to see the full menu.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
