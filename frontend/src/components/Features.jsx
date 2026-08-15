import { Headphones, RotateCcw, Shield, Truck } from "lucide-react"

function Features() {
  return (
    <section className="py-12 bg-muted/50 pl-4 sm:pl-0 sm:px-6 px-2">
      <div className="max-w-7xl mx-auto ">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          {/* Free Shipping */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground">On orders over $50</p>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure transactions</p>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Headphones className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">Dedicated support</p> 
            </div>
          </div>

          {/* Easy Returns */}
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <RotateCcw className="h-6 w-6 text-orange-600" />
            </div>

            <div>
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-muted-foreground">
                Hassle-free returns
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Features
