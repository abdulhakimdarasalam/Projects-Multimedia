// lib/api.js

import axios from "axios";

// Ambil token dari local storage (hanya berjalan di sisi browser/client)
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Buat instance Axios
const api = axios.create({
  baseURL: "http://localhost:4000",
  // PENTING: Agar cookie (refreshToken) bisa dikirim dari browser
  withCredentials: true,
});

// --- Interceptor 1: Request (Menyematkan Access Token) ---
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

// --- Interceptor 2: Response (Menangani Token Refresh) ---
// Fungsi ini berjalan SETELAH response diterima
api.interceptors.response.use(
  (response) => {
    // Cek apakah backend mengirim header 'x-access-token'
    const newAccessToken = response.headers["x-access-token"];

    if (newAccessToken) {
      console.log("✅ Token di-refresh. Menyimpan token baru...");
      // Simpan token baru ke local storage
      localStorage.setItem("accessToken", newAccessToken);

      // Update header di instance 'api'
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
    }

    return response;
  },
  (error) => {
    // Handle error global, misalnya 401/403 (autentikasi gagal total)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Authentication Error. Mungkin harus login ulang.");
      // Di sini bisa ditambahkan logika redirect ke halaman login
      // if (typeof window !== "undefined") {
      //   window.location.href = '/login';
      // }
    }

    return Promise.reject(error);
  }
);

/**
 * Mengambil semua Task yang terhubung dengan Project ID.
 * Endpoint: GET /tasks/:projectId
 *
 * @param {string} projectId ID dari Project
 * @returns {Promise<Array<Task>>} Daftar Task
 */
export async function getTasksByProjectId(projectId) {
  // <--- PASTIKAN ADA 'export' DI SINI!
  try {
    const response = await api.get(`/tasks/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for Project ID ${projectId}:`, error);
    throw error;
  }
}

/**
 * Mengambil detail SATU Task berdasarkan ID Task. (Jika Anda menggunakannya)
 * Endpoint: GET /tasks/detail/:taskId
 */
export async function getTaskDetail(taskId) {
  // <--- DAN JUGA DI SINI!
  try {
    const response = await api.get(`/tasks/detail/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detail for Task ID ${taskId}:`, error);
    throw error;
  }
}

export default api;
