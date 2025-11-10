import { create } from "zustand";
import api from "../lib/api"; // <-- Mengimpor file api.js Anda yang canggih

export const useRegistrationStore = create((set, get) => ({
  // --- STATE ---
  registrations: [],
  loading: false,
  error: null,

  // --- ACTIONS ---

  // 1. Aksi untuk mengambil data
  fetchRegistrations: async (status = "pending") => {
    set({ loading: true, error: null });
    try {
      // Panggil GET /project-registrations?status=pending
      // 'api' ini sudah otomatis menangani token
      const response = await api.get(`/project-registrations?status=${status}`);

      // Sesuaikan dengan struktur data controller Anda
      const data =
        status === "all"
          ? response.data.data.pending // Jika 'all', ambil grup 'pending'
          : response.data.data; // Jika 'pending', ambil datanya langsung

      set({ registrations: data || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Gagal mengambil data",
        loading: false,
      });
    }
  },

  // 2. Aksi untuk MENERIMA
  acceptRegistration: async (registrationId) => {
    set({ loading: true }); // Bisa tambahkan loading per-item jika mau
    try {
      // Panggil API PATCH /project-registrations/:id/accept
      await api.patch(`/project-registrations/${registrationId}/accept`);

      // Setelah berhasil, panggil ulang fetchRegistrations untuk refresh daftar
      get().fetchRegistrations("pending"); // 'get()' untuk memanggil aksi lain

      alert("Member berhasil diterima!");
    } catch (err) {
      set({ loading: false }); // Matikan loading jika gagal
      alert(
        "Gagal menerima member: " + (err.response?.data?.message || err.message)
      );
    }
  },

  // 3. Aksi untuk MENOLAK
  rejectRegistration: async (registrationId, reason) => {
    if (!reason || reason.trim() === "") {
      alert("Alasan penolakan wajib diisi.");
      return;
    }

    set({ loading: true });
    try {
      // Panggil API PATCH /project-registrations/:id/reject
      await api.patch(`/project-registrations/${registrationId}/reject`, {
        rejection_reason: reason, // Kirim 'reason' di body
      });

      // Refresh daftar
      get().fetchRegistrations("pending");
      alert("Member berhasil ditolak.");
    } catch (err) {
      set({ loading: false });
      alert(
        "Gagal menolak member: " + (err.response?.data?.message || err.message)
      );
    }
  },
}));
