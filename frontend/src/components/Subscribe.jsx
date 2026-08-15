
const Subscribe = () => {
  return (
    
     <section className="px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="max-w-310 mx-auto bg-[#172a40] rounded-3xl px-6 sm:px-8 lg:px-14  py-10 sm:py-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Content */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-extrabold leading-tight text-white">
              Get{" "}
              <span className="text-blue-500">
                Exclusive
              </span>{" "}
              Deals
              <br />
              Straight to Your Inbox
            </h2>

            <p className="mt-4 text-base sm:text-lg text-gray-400">
              Join 500,000+ shoppers. Unsubscribe anytime.
            </p>
          </div>

          {/* Right Form */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">

            <input
              type="email"
              placeholder="Your email address"
              className="w-full h-14 px-5 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              
              className="h-14 px-6 sm:px-8 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold whitespace-nowrap transition-colors"
            >
              Subscribe Now
            </button>

          </div>

        </div>

      </div>
    </section>  
  )
}

export default Subscribe
