
import { Button } from './ui/button'

function Hero() {
  return (
<section className='bg-linear-to-r from-blue-600 to-purple-600 text-white py-16'>
  <div className='max-w-7xl mx-auto px-4 lg:px-1 pt-30 pb-20'>
    <div className='grid md:grid-cols-2 gap-8 items-center'>
      <div className='flex flex-col items-center md:items-start text-center md:text-left gap-2 px-6'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4'>Latest Electronics at Best Prices</h1>
        <p className='text-xl mb-6 text-blue-100'>Discover cutting-edge technology with unbeatable deals on smartphones, laptops and more.</p>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Button className='bg-white text-blue-600 hover:bg-gray-100'>Shop Now</Button>
          <Button variant='outline' className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'>View Deals</Button>
        </div>
      </div>
      <div className=' flex items-center justify-center md:justify-end px-2'>
            <img src="/hero_img.png" alt="Hero-image" width={500} height={400} className='rounded-lg shadow-2xl'/>
      </div>
    </div>
  </div>
</section>
  )
}

export default Hero
