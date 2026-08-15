import { newArrival } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const NewArrival = () => {
  return (
    <div className="w-full bg-muted/50">
      <section className="container max-w-7xl mx-auto px-4 py-16 ">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <Link
            to="/products"
            className="text-gray-900 hover:text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrival.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

function ProductCard({ product }) {
  return (
    <div
      key={product.id}
      className="rounded-xl border border-gray-100 overflow-hidden bg-white hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <div className="h-44 bg-gray-100">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          New
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-0.5">{product.brand}</p>

        <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </p>

        <p className="text-base font-bold text-gray-900 mb-3">
          ${product.price}
        </p>

        <Link to={"/products"}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm font-medium py-2 rounded-lg transition-colors">
            View Product
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NewArrival;
