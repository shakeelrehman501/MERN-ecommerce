import api from "./axios";
import { getAuthConfig } from "@/utils/authHeader.js";

// ====================
// Authentication
// ====================

export const register = async (payload) => {
  const { data } = await api.post("/register", payload);
  return data;
};

export const verifyEmail = async (payload) => {
  const { data } = await api.post("/verify", payload);
  return data;
};

export const reVerifyEmail = async (payload) => {
  const { data } = await api.post("/reverify", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post("/login", payload);
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/logout", {}, getAuthConfig());
  return data;
};

export const refreshToken = async () => {
  const { data } = await api.post("/refresh-token");
  return data;
};

// ====================
// Password Recovery
// ====================

export const forgotPassword = async (payload) => {
  const { data } = await api.post("/forgot-password", payload);
  return data;
};

export const verifyOTP = async (payload) => {
  const { data } = await api.post("/verify-otp", payload);
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post("/reset-password", payload);
  return data;
};

// ====================
// Authenticated User
// ====================

export const changePassword = async (payload) => {
  const { data } = await api.patch("/change-password", payload);
  return data;
};
