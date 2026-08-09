import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { setCart } from "@/redux/productSlice";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCart, updateCartQuantity, removeFromCart } from "@/api/cartApi";

function Cart() {
  const { cart } = useSelector((store) => store.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const data = await updateCartQuantity({
        productId,
        type,
      });

      if (data.success) {
        dispatch(setCart(data.cart));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      const data = await removeFromCart({
        productId,
      });

      if (data.success) {
        dispatch(setCart(data.cart));
        toast.success("Product removed from cart");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getCart();

        if (data.success) {
          dispatch(setCart(data.cart));
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    };

    loadCart();
  }, [dispatch]);
  return (
    <div className="pt-25 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto px-3">
          <h1 className="text-2xl font-bold text-gray-800 mb-7">
            Shopping Cart
          </h1>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row  md:gap-3 gap-5  ">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.items?.map((product, index) => {
                return (
                  <Card key={index}>
                    <div className="flex flex-col  md:flex-row md:justify-between md:items-center pr-7 relative">
                      <div className="flex items-center gap-2 max-w-130">
                        <img
                          src={
                            product?.productId?.productImg?.[0]?.url ||
                            "/user.png"
                          }
                          alt=""
                          className="w-25 h-25"
                        />

                        <div className="max-w-80 pr-2 ">
                          <h1 className="font-semibold line-clamp-2 wrap-break-words  ">
                            {product?.productId?.productName}
                          </h1>

                          <p>{product?.productId?.productPrice}</p>
                        </div>
                      </div>
                      <div className="flex justify-around md:justify-around md:flex-1 gap-5 items-center pt-2 ">
                        <div className="flex gap-3 sm:gap-5 items-center">
                          <Button
                            onClick={() =>
                              handleUpdateQuantity(
                                product?.productId?._id,
                                "decrease",
                              )
                            }
                            variant="outline"
                          >
                            -
                          </Button>
                          <span>{product.quantity}</span>
                          <Button
                            onClick={() =>
                              handleUpdateQuantity(
                                product?.productId?._id,
                                "increase",
                              )
                            }
                            variant="outline"
                          >
                            +
                          </Button>
                        </div>

                        <p>
                          ₹
                          {product?.productId?.productPrice * product?.quantity}
                        </p>

                        <p
                          onClick={() => handleRemove(product?.productId?._id)}
                          className="flex text-red-500 items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div className="w-full lg:w-1/3 ">
              <div className="max-w-100 min-w-75 mx-auto  ">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart?.items?.length} items)</span>

                      <span>₹{cart?.totalPrice?.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹{shipping}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax(5%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Promo Code"
                          className="rounded-md"
                        />
                        <Button variant="outline" className="rounded-md">
                          {" "}
                          Apply
                        </Button>
                      </div>
                      <Button className="w-full bg-blue-600 rounded-md">
                        Place Order
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent rounded-md"
                      >
                        <Link to="/products">Continue Shopping</Link>
                      </Button>
                      <div className="text-sm text-muted-foreground pt-4">
                        <p>* Free shipping on orders over 299</p>
                        <p>* 30-days return policy</p>
                        <p>* Secure checkout with SSL encryption</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          {/* Icon */}

          <div className="bg-pink-100 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-pink-600" />
          </div>

          {/* title */}

          <h2 className="mt-6 text-2xl font-bold text-gray-800">
            Your Cart is Empty
          </h2>

          <p className="mt-2 text-gray-600">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Button
            onClick={() => navigate("/products")}
            className="text-[16px] mt-6 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white py-6 px-6"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
}

export default Cart;
