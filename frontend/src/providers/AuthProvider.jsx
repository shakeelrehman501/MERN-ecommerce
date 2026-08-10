import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { refreshAccessToken } from "@/api/authService";
import { getCart } from "@/api/cartApi";

import {
  logoutUser,
  setAuthInitialized,
  setUser,
} from "@/redux/userSlice";

import { setCart } from "@/redux/productSlice";

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const { authInitialized, accessToken } = useSelector(
    (store) => store.user,
  );

  // Authentication
  useEffect(() => {
    if (authInitialized) return;

    const initializeAuth = async () => {
      try {
        const data = await refreshAccessToken();

        dispatch(
          setUser({
            user: data.user,
            accessToken: data.accessToken,
          }),
        );
      } catch {
        dispatch(logoutUser());
      } finally {
        dispatch(setAuthInitialized(true));
      }
    };

    if (accessToken) {
      dispatch(setAuthInitialized(true));
      return;
    }

    initializeAuth();
  }, [accessToken, authInitialized, dispatch]);

  // Fetch cart after login
  useEffect(() => {
    if (!accessToken) return;

    const loadCart = async () => {
      try {
        const data = await getCart();

        if (data.success) {
          dispatch(setCart(data.cart));
        }
      } catch (error) {
        console.log("Cart fetch error:", error);
      }
    };

    loadCart();
  }, [accessToken, dispatch]);

  return children;
}

export default AuthProvider;