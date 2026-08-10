import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setProducts } from "@/redux/productSlice";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getAllProducts, getProductFilters } from "@/api/productApi";

function Products() {
  const { products } = useSelector((store) => store.product);

  const [loading, setLoading] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(true);

  const [showFilterbar, setShowFilterbar] = useState(false);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [priceRange, setPriceRange] = useState([0, 9999999]);

  const [sortOrder, setSortOrder] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();

  // ====================
  // Get All Products
  // ====================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await getAllProducts({
          page: currentPage,
          limit: 8,
          search,
          category,
          brand,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort: sortOrder,
        });
        dispatch(setProducts(data.data.products));

        setTotalPages(data.data.totalPages);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch products",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [dispatch, currentPage, search, category, brand, sortOrder, priceRange]);

  // ====================
  // Get Product Filters
  // ====================

 useEffect(() => {
  const loadFilters = async () => {
    try {
      setFiltersLoading(true);

      const data = await getProductFilters();

      setCategories(["All", ...data.data.categories]);
      setBrands(["All", ...data.data.brands]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch product filters",
      );
    } finally {
      setFiltersLoading(false);
    }
  };

  loadFilters();
}, []);

  // ====================
  // Reset Filters
  // ====================

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPriceRange([0, 9999999]);
    setSortOrder("");
    setCurrentPage(1);
  };
  return (
    <div className="pt-25 pb-10 px-5 flex w-full max-w-7xl mx-auto gap-7   relative">
      {/* Desktop Side filterbar */}
      <div className="mt-2 hidden md:block">
        <FilterSidebar
          search={search}
          setSearch={setSearch}
          brand={brand}
          setBrand={setBrand}
          category={category}
          setCategory={setCategory}
          categories={categories}
          brands={brands}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          loading={filtersLoading}
          setCurrentPage={setCurrentPage}
          resetFilters={resetFilters}
        />
      </div>
      {/* Mobile filterbar */}
      {showFilterbar && (
        <>
          <div className="mt-2 md:hidden  absolute top-8 left-0 px-2 pt-8 bg-gray-100 z-10  rounded-br-sm  ">
            <div
              onClick={() => setShowFilterbar(false)}
              className="w-7 h-7 bg-gray-600 text-gray-100 absolute right-4 top-12 z-10 rounded-full flex items-center justify-center "
            >
              <X className="w-5 h-5" />
            </div>
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              categories={categories}
              brands={brands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              loading={filtersLoading}
              setCurrentPage={setCurrentPage}
              resetFilters={resetFilters}
            />
          </div>
        </>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between md:justify-end mb-4">
          <div className="block md:hidden">
            <Button
              onClick={() => setShowFilterbar(true)}
              variant="outline"
              className="cursor-pointer"
            >
              <SlidersHorizontal />
              Filter
            </Button>
          </div>
          <Select onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                <SelectItem value="highToLow">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Porduct grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-2 text-center">
              Try adjusting your search or filter criteria.
            </p>

            <Button onClick={resetFilters} className="mt-5 bg-blue-600">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

            {products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                loading={loading}
              />
            ))}
          </div>
        )}
        {/* Pagination */}
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && setCurrentPage((prev) => prev - 1)
                }
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && setCurrentPage((prev) => prev + 1)
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default Products;
