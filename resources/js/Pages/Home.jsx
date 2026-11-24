import Header from '../Components/Header'
import Hero from '../Components/Hero'
import Highlights from '../Components/Highlights'
import MenuSection from '../Components/MenuSection'
import Story from '../Components/Story'
import FindUs from '../Components/FindUs'
import Footer from '../Components/Footer'

export default function Home() {
  const qrUrl = typeof window === 'undefined'
    ? '/t/T1'
    : `${window.location.origin}/t/T1`

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Highlights />
        <MenuSection menuUrl={qrUrl} />
        <Story />
        <FindUs menuUrl={qrUrl} />
      </main>
      <Footer />
    </>
  )
}
