import API from "./apiClient";

export const getCategories = () =>
  API.get("/categories");

export const getProductsByCategory = (categoryName) =>
  API.get(`/products/category/${categoryName}`);