import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.toString() || "http://localhost:3000";

export const http = axios.create({
  baseURL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("vireon_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

