import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import { useDispatch } from "react-redux";
import { addToCart } from "@/api/cartApi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product;
  
  const dispatch = useDispatch();
  const navigate = useNavigate()

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
    <div className="shadow-md rounded-lg border overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden mb-2 ">
        {loading ? <Skeleton className="w-full h-full rounded-lg" /> :
          <img
          onClick={()=>navigate(`/products/${product._id}`)}
            src={productImg[0]?.url}
            alt=""
            className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer p-3"
          /> 
        }
      </div>
      {loading ? <div className="p-2 space-y-2 ">
        <Skeleton className="w-50 h-8" />
        <Skeleton className="w-50 h-4" />
        <Skeleton className="w-50 h-4" />
      </div> :
        <div className="px-2 space-y-3">
          <div className="px-2 space-y-1">

            <h1 className="text-[15px] font-semibold h-12 line-clamp-2">

              {productName}
            </h1>

            <h2 className="font-bold">
              Rs.{productPrice}
            </h2>
          </div>

          <Button 
          onClick={()=>handleAddToCart(product._id)}
          className="bg-blue-600 hover:bg-blue-500  mb-3 w-full px-2">
            <ShoppingCart />
            Add to Cart
          </Button>
        </div>
      }
    </div>
  );
};

export default ProductCard;