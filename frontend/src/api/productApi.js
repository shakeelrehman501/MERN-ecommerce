import store from "@/redux/store";
import api from "./axios";
import { getAuthConfig } from "@/utils/authHeader.js";

// ====================
// Product
// ====================

// Add Product
export const addProduct = async (payload) => {
  const { data } = await api.post(
    "/product/addproduct",
    payload,
    {
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  }
  );

  return data;
};


// ====================
// Get All Products
// ====================

export const getAllProducts = async (params = {}) => {
  const { data } = await api.get("/product/getallproducts", {
    params,
  });

  return data;
};

// ====================
// Get Product Filters
// ====================

export const getProductFilters = async () => {
  const { data } = await api.get("/product/filters");
  return data;
};

// ====================
// Delete Product
// ====================

export const deleteProduct = async (productId) => {
  const { data } = await api.delete(
    `/product/delete/${productId}`,
    getAuthConfig(),
  );

  return data;
};

// ====================
// Update Product
// ====================

export const updateProduct = async (productId, payload) => {
  const { data } = await api.put(
    `/product/update/${productId}`,
    payload,
    {
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  }
  );

  return data;
};
