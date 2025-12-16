import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:4000/api" });

// optional: attach token
api.interceptors.request.use(config => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = "Bearer " + t;
  return config;
});

export default api;
