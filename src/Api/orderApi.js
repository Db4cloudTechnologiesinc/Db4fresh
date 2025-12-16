import API from "./apiClient";

export const placeOrder = (data) =>
  API.post("/orders", data);

export const getMyOrders = () =>
  API.get("/orders/my");

export const getOrderDetails = (id) =>
  API.get(`/orders/${id}`);
