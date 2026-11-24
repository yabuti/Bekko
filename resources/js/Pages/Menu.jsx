import Header from '../Components/Header'
import MenuSection from '../Components/MenuSection'
import Footer from '../Components/Footer'

export default function Menu({ categories, items }) {
  const qrUrl = typeof window === 'undefined'
    ? '/t/T1'
    : `${window.location.origin}/t/T1`

  return (
    <>
      <Header />
      <main>
        <MenuSection menuUrl={qrUrl} categories={categories} items={items} />
      </main>
      <Footer />
    </>
  )
}
