import { create } from "zustand";
import axios from "axios";

// Tentukan Base URL API kamu di satu tempat
const API_BASE_URL = "http://localhost:4000";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const useJoinRequestStore = create((set, get) => ({
  /**
   * STATE
   */
  requests: [], // Ini akan menampung daftar request anggota
  isLoading: false, // Untuk tahu kapan data sedang diambil
  error: null, // Untuk menyimpan pesan error jika gagal

  fetchRequests: async () => {
    set({ isLoading: true, error: null });

    const token = getAuthToken();
    if (!token) {
      set({
        error: "Otentikasi tidak ditemukan. Silakan login kembali.",
        isLoading: false,
      });
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/project-registrations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({ requests: response.data.data.pending, isLoading: false });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Gagal memuat data.";
      set({ error: errorMessage, isLoading: false });
      console.error("Gagal mengambil join requests:", errorMessage);
    }
  },

  removeRequestById: (id) => {
    const numericId = Number(id);
    set((state) => ({
      requests: state.requests.filter((req) => req.id !== numericId),
    }));
  },
}));
