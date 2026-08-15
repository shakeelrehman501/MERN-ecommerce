import { ShopImg } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ShopByCategory = () => {
  return (
    <div className="max-w-7xl mx-auto flex items-center">
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 px-3 sm:px-5 ">
          {ShopImg.map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const CategoryCard = ({ category }) => {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <Link
      to="/products"
      className="group"
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4 border shadow-sm relative">
        
        {imgLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        <img
          src={category.img}
          alt={category.name}
          onLoad={() => setImgLoading(false)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <h3 className="text-center font-medium">
        {category.name}
      </h3>
    </Link>
  );
};

export default ShopByCategory;