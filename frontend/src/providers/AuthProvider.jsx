import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { refreshAccessToken } from "@/api/authService";

import {
  logoutUser,
  setAuthInitialized,
  setUser,
} from "@/redux/userSlice";

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const { authInitialized, accessToken } = useSelector(
    (store) => store.user,
  );

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

  return children;
}

export default AuthProvider;