import { useEffect, useSyncExternalStore } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Highlights from './components/Highlights'
import MenuSection from './components/MenuSection'
import Story from './components/Story'
import FindUs from './components/FindUs'
import Footer from './components/Footer'
import './App.css'

const subscribeToHash = (onChange) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const getHash = () => window.location.hash
const getServerHash = () => ''

// The QR code always points at the menu page, wherever this site ends up hosted.
const menuUrl = (() => {
  if (typeof window === 'undefined') return '#menu'
  const url = new URL(window.location.href)
  url.hash = 'menu'
  return url.toString()
})()

export default function App() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash)
  const isMenuPage = hash === '#menu'

  // When arriving at the homepage from another page, scroll to the linked section.
  useEffect(() => {
    if (isMenuPage || !/^#[a-zA-Z][\w-]*$/.test(hash)) return
    const target = document.querySelector(hash)
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [hash, isMenuPage])

  return (
    <>
      <Header />
      <main>
        {isMenuPage ? (
          <MenuSection menuUrl={menuUrl} />
        ) : (
          <>
            <Hero />
            <Highlights />
            <Story />
            <FindUs menuUrl={menuUrl} />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
