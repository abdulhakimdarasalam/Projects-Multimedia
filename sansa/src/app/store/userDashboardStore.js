import { create } from "zustand";

/**
 * Store untuk menampung semua state di halaman Dashboard User
 */
export const useDashboardUserStore = create((set) => ({
  // --- 1. STATE (DATA) ---
  // Data profile user (untuk sapaan "Good Morning, Geral!")
  profile: { name: "User" }, // Beri default name agar UI tidak aneh saat loading

  // Data statistik (untuk 2 kartu di atas)
  stats: {
    activeProjects: 0,
    allProjects: 0,
  },

  // Data list project (untuk 4 kartu di bawah)
  projects: [],

  // --- 2. STATE (KONTROL UI) ---
  // State untuk menampilkan skeleton loader
  isLoading: true,
  // State untuk menampilkan pesan error jika fetch gagal
  error: null,

  // --- 3. ACTIONS (FUNGSI) ---

  /**
   * Fungsi utama untuk mengambil SEMUA data yang dibutuhkan dashboard.
   * Fungsi ini akan kita panggil dari komponen React.
   * Kita akan melempar 'api' (instance Axios) yang sudah dikonfigurasi
   * dengan token.
   */
  fetchDashboardData: async (api) => {
    // 1. Set loading jadi true
    set({ isLoading: true, error: null });

    try {
      // 2. Siapkan 3 request API.
      // (Kita gunakan 'Promise.all' agar semua request berjalan bersamaan)

      // Endpoint 1: Profil User (GET /api/auth/me)
      const profilePromise = api.get("/api/auth/me");

      // Endpoint 2: Statistik (GET /api/v1/dashboard-user/stats)
      const statsPromise = api.get("/api/v1/dashboard-user/stats");

      // Endpoint 3: List Project (GET /projects/my-projects?limit=4)
      const projectsPromise = api.get("/projects/my-projects?limit=4");

      // 3. Tunggu semua request selesai
      const [profileRes, statsRes, projectsRes] = await Promise.all([
        profilePromise,
        statsPromise,
        projectsPromise,
      ]);

      // 4. Simpan semua data ke state Zustand
      set({
        // /api/auth/me -> respons-nya flat (langsung object user)
        profile: profileRes.data,

        // /api/v1/dashboard-user/stats -> { status: '...', data: { ... } }
        stats: statsRes.data.data,

        // /projects/my-projects -> { status: '...', data: [...] }
        projects: projectsRes.data.data,

        isLoading: false, // Matikan loading
      });
    } catch (err) {
      // 5. Jika salah satu API gagal, set pesan error
      console.error("Failed to fetch dashboard data:", err);
      set({
        isLoading: false,
        error: err.response?.data?.message || "Gagal memuat data dashboard.",
      });
    }
  },
}));
