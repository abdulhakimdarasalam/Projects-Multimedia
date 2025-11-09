import axios from "axios";

// Ganti 4000 jika port backend Anda berbeda
const API_BASE_URL = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor (Penting!):
// Ini adalah "penjaga" yang akan menambahkan token ke setiap request
// sebelum request itu dikirim ke backend.
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil accessToken dari localStorage
    // Pastikan Anda menyimpan token dengan nama 'accessToken' saat login
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
