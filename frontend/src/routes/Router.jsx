import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Navbar from "@/components/Navbar";
import Verify from "@/pages/Verify";
import VerifyEmail from "@/pages/VerifyEmail";
import Footer from "@/components/Footer";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <><Navbar /><Home /><Footer/></>
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/verify',
        element: <Verify />
    },
    {
        path: '/verify/:token',
        element: <VerifyEmail />
    },
])
