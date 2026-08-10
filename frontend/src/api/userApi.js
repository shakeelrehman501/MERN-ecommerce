import store from "@/redux/store";
import api from "./axios";
import { getAuthConfig } from "@/utils/authHeader.js";

// ====================
// Get All Users
// ====================

export const getAllUsers = async () => {
  const { data } = await api.get(
    "/user/all-user",
    getAuthConfig(),
  );

  return data;
};

// ====================
// Get User By ID
// ====================

export const getUserById = async (userId) => {
  const { data } = await api.get(
    `/user/get-user/${userId}`,
  );

  return data;
};

// ====================
// Update User
// ====================

export const updateUserApi = async (userId, payload) => {
  const { data } = await api.put(`/user/update/${userId}`, payload, {
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};