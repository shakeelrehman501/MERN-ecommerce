import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ShoppingCart } from "lucide-react";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "@/lib/constants.js";
import { logout } from "@/api/authApi";
import { logoutUser } from "@/redux/userSlice";
import { clearCart } from "@/redux/productSlice";
import { getCart } from "@/api/cartApi";
import { setCart } from "@/redux/productSlice";

function Navbar() {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);
  const admin = user?.role === "admin" ? true : false;
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // Cart fetch
  useEffect(() => {
  if (!user) return;

  const loadCart = async () => {
    try {
      const data = await getCart();

      if (data.success) {
        dispatch(setCart(data.cart));
      }
    } catch (error) {
      console.log("Cart Error:", error);
    }
  };

  loadCart();
}, [user, dispatch]);
  const logoutHandler = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const data = await logout();

      dispatch(logoutUser());
      dispatch(clearCart());

      toast.success(data.message);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <header className="top-0 bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className="relative max-w-7xl mx-auto flex justify-between items-center py-5 px-2">
        {/* logo section */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          )}
          <img
            src={Images.logo}
            alt="logo"
            onLoad={() => setLoading(false)}
            className={`max-w-40 ${loading ? "opacity-0" : "opacity-100"}`}
          />
        </div>

        {/* nav section */}
        <nav className="flex gap-10 justify-between items-center ">
          {/* Desktop */}
          <ul className="hidden lg:flex  md:gap-10 gap-5  items-center text-lg font-semibold">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/products"}>
              <li>Products</li>
            </Link>
            {user && (
              <Link to={`/profile/${user._id}`}>
                <li>Hello, {user.firstName}</li>
              </Link>
            )}
            {admin && (
              <Link to={`/dashboard/add-product`}>
                <li>Dashboard</li>
              </Link>
            )}
            <div className="flex items-center justify-center md:gap-12 gap-10 ">
              <Link to={"/cart"} className="relative">
                <ShoppingCart />
                <span className="bg-blue-600 rounded-full absolute text-white -top-3 -right-5 px-2.5">
                  {cart?.items?.length || 0}
                </span>
              </Link>
              {user ? (
                <Button
                  onClick={logoutHandler}
                  className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-[18px] px-6 py-5.5"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-[18px] px-6 py-5.5"
                >
                  Login
                </Button>
              )}
            </div>
          </ul>

          {/* Mobile Menu  */}

          <div className="flex items-center lg:hidden gap-10 px-2 sm:px-5">
            {showMenu && (
              <ul
                onClick={() => setShowMenu(false)}
                className="absolute bg-pink-50 border z-50 border-gray-500/20 top-21 left-1/2 -translate-x-1/2 right-5 w-4/6  mr-6 items-center py-5 rounded-md  flex flex-col gap-4    text-md font-semibold"
              >
                <Link to={"/"}>
                  <li>Home</li>
                </Link>
                <Link to={"/products"}>
                  <li>Products</li>
                </Link>
                <div className="flex  flex-col gap-3 text-center">
                  {user && (
                    <Link to={`/profile/${user._id}`}>
                      Hello, {user.firstName}
                    </Link>
                  )}
                  {admin && (
                    <Link to={`/dashboard/add-product`}>
                      <li>Dashboard</li>
                    </Link>
                  )}
                  {user ? (
                    <Button
                      onClick={logoutHandler}
                      className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-lg px-4 py-4.5"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer text-lg px-4 py-4.5">
                      Login
                    </Button>
                  )}
                </div>
              </ul>
            )}
            <Link to={"/cart"} className="relative">
              <ShoppingCart />
              <span className="bg-blue-600 rounded-full absolute text-white -top-3 -right-5 px-2">
                {cart?.items?.length || 0}
              </span>
            </Link>
            {showMenu ? (
              <IoClose onClick={() => setShowMenu(false)} className="w-7 h-7" />
            ) : (
              <FiMenu onClick={() => setShowMenu(true)} className="w-7 h-7" />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
