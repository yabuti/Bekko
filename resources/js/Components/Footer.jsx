import { ArrowUpRight, Camera } from 'lucide-react'
import { directionsUrl, site } from '../data/site'
import Logo from './Logo'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo-box"><Logo className="footer-logo" /></div>
          <p>{site.tagline}</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#story">Our story</a>
          <a href="#visit">Find us</a>
        </div>

        <div className="footer-col">
          <h4>Visit</h4>
          {site.hours.map(({ day, time }) => (
            <p key={day}>{day}: {time}</p>
          ))}
          <a className="footer-inline-link" href={directionsUrl} target="_blank" rel="noreferrer">
            Directions <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="footer-col">
          <h4>Say hi</h4>
          <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a className="footer-inline-link" href={site.instagramUrl} target="_blank" rel="noreferrer">
            <Camera size={14} /> {site.instagram}
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {year} {site.name}. Made with love.</span>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  )
}
