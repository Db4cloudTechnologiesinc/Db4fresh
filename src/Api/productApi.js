import API from "./apiClient";

export const getAllProducts = () =>
  API.get("/products");

export const getProductById = (id) =>
  API.get(`/products/${id}`);

export const searchProducts = (query) =>
  API.get(`/products/search?q=${query}`);
