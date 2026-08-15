import Features from '@/components/Features'
import Hero from '@/components/Hero'
import NewArrival from '@/components/NewArrival'
import Reviews from '@/components/Reviews'
import ShopByCategory from '@/components/ShopByCategory'
import Subscribe from '@/components/Subscribe'

function Home() {
  return (
    <div>
      <Hero/>
      <Features/>
      <ShopByCategory/>
      <NewArrival/>
      <Reviews/>
      <Subscribe/>
    </div>
  )
}

export default Home
