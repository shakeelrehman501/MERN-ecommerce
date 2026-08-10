import api from "./axios";
import { getAuthConfig } from "@/utils/authHeader.js";

// ====================
// Authentication
// ====================

export const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const verifyEmail = async (payload) => {
  const { data } = await api.post("/auth/verify", payload);
  return data;
};

export const reVerifyEmail = async (payload) => {
  const { data } = await api.post("/auth/reverify", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout", {}, getAuthConfig());
  return data;
};

export const refreshToken = async () => {
  const { data } = await api.post("/auth/refresh-token");
  return data;
};

// ====================
// Password Recovery
// ====================

export const forgotPassword = async (payload) => {
  const { data } = await api.post("/auth/forgot-password", payload);
  return data;
};

export const verifyOTP = async (payload) => {
  const { data } = await api.post("/auth/verify-otp", payload);
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
};

// ====================
// Change Password 
// ====================

export const changePassword = async (payload) => {
  const { data } = await api.patch(
    "/auth/change-password",
    payload,
    getAuthConfig(),
  );
  return data;
};




