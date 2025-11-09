import axios from "axios";

// Ambil token dari local storage (jika ada)
// Pastikan key-nya ('accessToken') sama dengan yang kamu simpan saat login
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Buat instance Axios
const api = axios.create({
  // Ganti port 3001 jika port backend kamu berbeda
  baseURL: "http://localhost:4000",

  // INI PENTING: Agar cookie (refreshToken) bisa dikirim
  withCredentials: true,
});

// --- Interceptor 1: Request ---
// Fungsi ini berjalan SEBELUM setiap request dikirim
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      // Set header Authorization
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor 2: Response ---
// Fungsi ini berjalan SETELAH response diterima
api.interceptors.response.use(
  (response) => {
    // Cek apakah backend mengirim header 'x-access-token'
    // (Ini adalah tanda token baru saja di-refresh oleh backend)
    const newAccessToken = response.headers["x-access-token"];

    if (newAccessToken) {
      console.log("✅ Token di-refresh. Menyimpan token baru...");
      // Simpan token baru ke local storage untuk request berikutnya
      localStorage.setItem("accessToken", newAccessToken);

      // Update header di instance 'api' agar request berikutnya
      // (jika ada) langsung pakai token baru
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
    }

    return response;
  },
  (error) => {
    // Di sini kamu bisa handle error global,
    // misalnya jika refresh token-nya juga gagal (401/403)
    // dan redirect ke halaman login.
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Authentication Error. Mungkin harus login ulang.");
      // window.location.href = '/login'; // Opsi: paksa redirect
    }

    return Promise.reject(error);
  }
);

export default api;
