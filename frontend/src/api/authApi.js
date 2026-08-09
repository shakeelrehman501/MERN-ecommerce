import store from "@/redux/store";
import api from "./axios";
import { getAuthConfig } from "@/utils/authHeader.js";

// ====================
// Authentication
// ====================

export const register = async (payload) => {
  const { data } = await api.post("/user/register", payload);
  return data;
};

export const verifyEmail = async (payload) => {
  const { data } = await api.post("/user/verify", payload);
  return data;
};

export const reVerifyEmail = async (payload) => {
  const { data } = await api.post("/user/reverify", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post("/user/login", payload);
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/user/logout", {}, getAuthConfig());
  return data;
};

export const refreshToken = async () => {
  const { data } = await api.post("/user/refresh-token");
  return data;
};

// ====================
// Password Recovery
// ====================

export const forgotPassword = async (payload) => {
  const { data } = await api.post("/user/forgot-password", payload);
  return data;
};

export const verifyOTP = async (payload) => {
  const { data } = await api.post("/user/verify-otp", payload);
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post("/user/reset-password", payload);
  return data;
};

// ====================
// Authenticated User
// ====================

export const changePassword = async (payload) => {
  const { data } = await api.patch(
    "/user/change-password",
    payload,
    getAuthConfig(),
  );
  return data;
};

export const updateUser = async (userId, payload) => {
  const { data } = await api.put(`/user/update/${userId}`, payload, {
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
