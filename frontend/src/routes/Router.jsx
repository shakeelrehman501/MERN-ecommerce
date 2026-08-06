import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import Navbar from "@/components/Navbar";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import Footer from "@/components/Footer";
import Profile from "@/pages/Profile";
import Products from "@/pages/Product";
import Cart from "@/pages/Cart";
import Dashboard from "@/pages/Dashboard";
import AddProduct from "@/pages/admin/AddProduct";
import AdminProduct from "@/pages/admin/AdminProduct";
import AdminUsers from "@/pages/admin/AdminUsers";
import UserInfo from "@/pages/admin/UserInfo";
import ProtectedRoute from "@/components/ProtectedRoute";
import SingleProduct from "@/pages/SingleProduct";
import ForgotPassword from "@/pages/auth/FortgotPossword";
import VerifyOTP from "@/pages/auth/VerifyOTP";
import ResetPassword from "@/pages/auth/ResetPassword";
import CheckEmail from "@/pages/auth/CheckEmail";
import PublicRoute from "@/components/PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/verify-otp",
    element: (
      <PublicRoute>
        <VerifyOTP />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    )
  },
  {
    path: "/check-email",
    element: (
      <PublicRoute>
        <CheckEmail />
      </PublicRoute>
    )
  },
  {
    path: "/verify/:token",
    element: (
      <PublicRoute>
        <VerifyEmail />
      </PublicRoute>
    )
  },
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/products",
    element: (
      <>
        <Navbar /> <Products />
      </>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <>
        <Navbar /> <SingleProduct />
      </>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Navbar /> <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute adminOnly={true}>
        <Navbar />
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "products",
        element: <AdminProduct />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "users/:id",
        element: <UserInfo />,
      },
    ],
  },
]);
