import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  timeout: 8000
});

// for demo: if backend not available, the frontend uses mock data in slices
export default api;
