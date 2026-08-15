import { reviews } from "@/lib/constants";
import { UserRound } from "lucide-react";

const Reviews = () => {
  return (
    <section className="pt-16 pb-8 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Customer Reviews
          </h2>

          <p className="text-gray-500 mt-2">
            What our customers say about their shopping experience
          </p>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >

              {/* Customer Info */}
              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserRound className="w-6 h-6 text-gray-500" />
                </div>

                {/* Name & City */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {r.name}
                  </h3>

                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.city}
                  </p>
                </div>

                {/* Rating */}
                <div className="ml-auto flex gap-0.5 text-yellow-400 text-sm">
                  {"★".repeat(r.rating)}
                </div>
              </div>

              {/* Review */}
              <p className="mt-5 text-sm text-gray-600 leading-6">
                "{r.text}"
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;