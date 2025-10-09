// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://visto-ecommerce-be-nest.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // ❌ جربي بدون Bearer
    config.headers.Authorization = token;
  }
  console.log("🔐 Final Header:", config.headers.Authorization);
  return config;
});




export default axiosInstance;
