import axios from "axios";

const API = "http://localhost:4000/cart";

export const fetchCartApi = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
