"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiX } from "react-icons/hi";
import axios from "axios";
import { useJoinRequestStore } from "@/app/store/joinRequestStore";

export default function RejectRequestPage() {
  const router = useRouter();
  const params = useParams();
  const { requestId } = params;

  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👇 2. AMBIL DATA DARI ZUSTAND, BUKAN MOCK
  const { requests } = useJoinRequestStore((state) => state); // Ambil list 'requests' dari store
  const requestData = requests.find((req) => req.id === Number(requestId));
  console.log("DATA DARI ZUSTAND:", requestData); // <-- TAMBAHKAN INI

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert("Alasan penolakan tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken"); // Ganti 'adminToken' jika perlu
      if (!token) {
        alert("Sesi Anda habis. Silakan login kembali.");
        router.push("/auth/login");
        return;
      }

      const API_URL = `http://localhost:4000/project-registrations/${requestId}/reject`;
      const payload = {
        rejection_reason: rejectionReason,
      };

      await axios.put(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Permintaan berhasil ditolak.");
      // TODO: Idealnya, panggil fungsi fetch ulang dari store kamu di sini sebelum push
      // contoh: fetchRequests();
      router.push("/admin/join-request");
    } catch (error) {
      console.error("Gagal menolak permintaan:", error);
      alert("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 👇 3. PENGECEKAN INI SEKARANG AKAN BERHASIL
  if (!requestData) {
    // Jika masih "Request not found.", pastikan store kamu sudah terisi data
    // saat halaman ini dimuat.
    return <div className="p-8 text-center">Request not found.</div>;
  }

  // Render form jika data ditemukan
  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reject Anggota</h2>
          <p className="mt-1 text-sm text-gray-500">
            Anda akan menolak permintaan dari:
          </p>
        </div>
        <Link
          href="/admin/join-request"
          className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
        >
          <HiX className="h-6 w-6" />
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Field yang tidak bisa diubah */}
          <div>
            <label className="text-xs text-gray-500">Nama</label>
            {/* Pastikan 'requestData.name' dll sesuai dengan struktur data di store kamu */}
            <input
              type="text"
              disabled
              value={requestData.User.name}
              className="mt-1 text-black w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">
              Untuk bergabung ke Proyek
            </label>
            <input
              type="text"
              disabled
              value={requestData.Project.title}
              className="mt-1 text-black w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Tanggal Permintaan</label>
            <input
              type="text"
              disabled
              value={new Date(requestData.createdAt).toLocaleDateString(
                "id-ID"
              )}
              className="mt-1 text-black w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5"
            />
          </div>

          {/* Field Alasan Penolakan */}
          <div>
            <label
              htmlFor="rejectionReason"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectionReason"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Isi keterangan..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex justify-end gap-4">
          <Link href="/admin/join-request">
            <button
              type="button"
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Penolakan"}
          </button>
        </div>
      </form>
    </div>
  );
}
