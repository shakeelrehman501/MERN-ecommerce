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
import axios from "axios";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Products() {
  const { products } = useSelector((store) => store.product);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterbar, setShowFilterbar] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 9999999]);
  const [sortOrder, setSortOrder] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/api/v1/product/getallproducts`,
        );
        if (res.data.success) {
          setAllProducts(res.data.products);
          dispatch(setProducts(res.data.products));
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getAllProducts();
  }, [dispatch]);

  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (brand !== "All") {
      filtered = filtered.filter((p) => p.brand === brand);
    }

    filtered = filtered.filter(
      (p) => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1],
    );
    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice);
    }
    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch]);

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
          allProducts={allProducts}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          loading={loading}
        />
      </div>
      {/* Mobile filterbar */}
      {showFilterbar && (
        <>
          <div className="mt-2 md:hidden  absolute top-8 left-0 px-2 pt-8 bg-gray-100 z-10  rounded-br-sm  ">
            <div 
            onClick={()=>setShowFilterbar(false)}
            className="w-7 h-7 bg-gray-600 text-gray-100 absolute right-4 top-12 z-10 rounded-full flex items-center justify-center ">
              <X className="w-5 h-5" />
            </div>
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              allProducts={allProducts}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              loading={loading}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => {
            return (
              <ProductCard
                key={product._id}
                product={product}
                loading={loading}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Products;
