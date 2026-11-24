import Header from '../Components/Header'
import Hero from '../Components/Hero'
import Highlights from '../Components/Highlights'
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
        <Story />
        <FindUs menuUrl={qrUrl} />
      </main>
      <Footer />
    </>
  )
}
