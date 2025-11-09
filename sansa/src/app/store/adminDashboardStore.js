import { create } from "zustand";

import axiosInstance from "../../lib/axiosInstance";

export const useAdminDashboardStore = create((set) => ({
  // 1. Definisikan state awal
  data: {
    summary: {},
    projectStatusChart: [],
    projectList: {
      projects: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
      },
    },
  },
  isLoading: true,
  error: null,

  // 2. Buat action untuk fetch data
  fetchDashboardData: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      // Panggil endpoint API (sekarang menggunakan instance yang ada token-nya)
      const response = await axiosInstance.get(
        `/api/v1/admin/dashboard?page=${page}`
      );

      set({ data: response.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengambil data";
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
