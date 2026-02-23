import axios from "axios";

const API = "http://localhost:4000/api/delivery";

/* ================= AUTH ================= */
export const loginDelivery = (data) =>
  axios.post(`${API}/login`, data);

/* ================= REGISTER (WITH FILE UPLOAD) ================= */
export const registerDelivery = (data) =>
  axios.post(`${API}/register`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* ================= ORDERS ================= */
export const getAssignedOrders = (token) =>
  axios.get(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateOrderStatus = (orderId, status, token) =>
  axios.put(
    `${API}/order/${orderId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
