import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch();

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product added to Cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="shadow-lg rounded-lg border overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden">
        {loading ? <Skeleton className="w-full h-full rounded-lg" /> :
          <img
            src={productImg[0]?.url}
            alt=""
            className="w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        }
      </div>
      {loading ? <div className="px-2 space-y-1">
        <Skeleton className="w-50 h-4" />
        <Skeleton className="w-50 h-4" />
        <Skeleton className="w-50 h-8" />
      </div> :
        <div className="px-2 space-y-1">
          <div className="px-2">

            <h1 className="font-semibold h-12 line-clamp-2">

              {productName}
            </h1>

            <h2 className="font-bold">
              {productPrice}
            </h2>
          </div>

          <Button 
          onClick={()=>addToCart(product._id)}
          className="bg-blue-600 hover:bg-blue-500  mb-3 w-full">
            <ShoppingCart />
            Add to Cart
          </Button>
        </div>
      }
    </div>
  );
};

export default ProductCard;