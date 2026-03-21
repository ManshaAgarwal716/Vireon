import axios from "axios";



export const http = axios.create({
  baseURL: "http://localhost:3000", // ✅ FORCE THIS
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("vireon_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

