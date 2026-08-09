import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Images } from "@/lib/constants.js";

function Hero() {
  const [loading, setLoading] = useState(true);

  return (
    <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-17">
      <div className="max-w-7xl mx-auto px-4 lg:px-1 pt-30 pb-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Latest Electronics at Best Prices
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              Discover cutting-edge technology with unbeatable deals on
              smartphones, laptops and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={"/products"}>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-4 py-6 cursor-pointer">
                  Shop Now
                </Button>
              </Link>
              <Link to={"/products"}>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent text-lg px-4 py-6 cursor-pointer"
                >
                  View Deals
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex  items-center justify-center md:justify-end px-2">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
            <img
              src={Images.hero}
              alt="Hero-image"
              width={500}
              height={400}
              onLoad={() => setLoading(false)}
              className={`rounded-lg shadow-2xl transition-opacity duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
