import { site } from '../data/site'

export default function Logo({ className = '' }) {
  return <img src="/logo.webp" alt={site.name} className={className} />
}
