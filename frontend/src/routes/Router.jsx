import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Navbar from "@/components/Navbar";
import Verify from "@/pages/Verify";
import VerifyEmail from "@/pages/VerifyEmail";
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
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <Verify />,
  },
  {
    path: "/verify/:token",
    element: <VerifyEmail />,
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
