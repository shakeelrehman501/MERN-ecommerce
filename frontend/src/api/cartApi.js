import api from "./axios";
import { getAuthConfig } from "@/utils/authHeader.js";

// ====================
// Cart
// ====================

// Get Cart
export const getCart = async () => {
  const { data } = await api.get("/cart", getAuthConfig());
  return data;
};

// Add To Cart
export const addToCart = async (payload) => {
  const { data } = await api.post(
    "/cart/add",
    payload,
    getAuthConfig(),
  );

  return data;
};

// Update Quantity
export const updateCartQuantity = async (payload) => {
  const { data } = await api.put(
    "/cart/update",
    payload,
    getAuthConfig(),
  );

  return data;
};

// Remove From Cart
export const removeFromCart = async (payload) => {
  const { data } = await api.delete(
    "/cart/remove",
    {
      ...getAuthConfig(),
      data: payload,
    },
  );

  return data;
};