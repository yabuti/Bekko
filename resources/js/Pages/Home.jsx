import Header from '../Components/Header'
import Hero from '../Components/Hero'
import Highlights from '../Components/Highlights'
import Story from '../Components/Story'
import TableEntryForm from '../Components/TableEntryForm'
import Gallery from '../Components/Gallery'
import GuestQuotes from '../Components/GuestQuotes'
import Faq from '../Components/Faq'
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
        <section className="table-entry-section screen-only">
          <div className="container">
            <TableEntryForm />
          </div>
        </section>
        <Highlights />
        <Story />
        <Gallery />
        <GuestQuotes />
        <Faq />
        <FindUs menuUrl={qrUrl} />
      </main>
      <Footer />
    </>
  )
}
