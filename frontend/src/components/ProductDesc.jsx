import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { setCart } from "@/redux/productSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "@/api/cartApi";

const ProductDesc = ({ product }) => {

  const dispatch = useDispatch();
  
    const handleAddToCart = async (productId) => {
    try {
      const data = await addToCart({ productId });
  
      toast.success(data.message);
  
      dispatch(setCart(data.cart));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };
  return (
    <div className="flex md:flex-1 flex-col gap-4  md:mt-0 sm:px-2   ">
      <h1 className="font-bold text-xl lg:text-3xl text-gray-800">
        {product.productName}
      </h1>

      <p className="text-gray-800 text-[16px]">
        {product.category} | {product.brand}
      </p>

      <h2 className="text-blue-600 font-bold text-2xl">
        ₹{product.productPrice}
      </h2>

      <p className="line-clamp-12 text-[16px] lg:text-[18px] text-muted-foreground">
        {product.productDesc}
      </p>

      <div className="flex gap-2 items-center flex-wrap">
        <p className="text-gray-800 font-semibold">Quantity :</p>

        <Input type="number" className="w-14" defaultValue={1} />
      </div>

      <Button
      onClick={()=>handleAddToCart(product._id)}
      className="bg-blue-600 hover:bg-blue-700 w-max px-5 py-5 cursor-pointer">Add to Cart</Button>
    </div>
  );
};

export default ProductDesc;
