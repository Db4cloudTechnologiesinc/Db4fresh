import axios from "axios";

export const fetchAddressesApi = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:4000/api/addresses", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data; // must be ARRAY
};
