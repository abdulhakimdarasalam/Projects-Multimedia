// src/components/myproject/MyProjectCard.jsx

import { HiOutlineCalendar } from "react-icons/hi";
import Link from "next/link";

// Helper untuk menentukan warna badge status
const getStatusColor = (status) => {
  if (!status) status = "default";
  switch (status.toLowerCase()) {
    case "approved":
    case "disetujui":
      return "bg-green-100 text-green-800";
    case "pending":
    case "menunggu":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
    case "ditolak":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ActiveProjectCard({ project }) {
  // 'project' di sini adalah objek yg sudah di-flatten di page.jsx
  const { id, status, category, title, date } = project;

  // Tentukan URL detail project (Sesuaikan path jika perlu)
  const detailUrl = `/user/base-project/detail/${id}`;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border bg-white p-6 shadow-sm hover:bg-gray-50 transition-colors">
      {/* Kolom Kiri: Informasi Proyek */}
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div>
            {/* Badge status dinamis */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {status || "N/A"}
            </span>
            <h3 className="mt-2 text-lg font-bold text-gray-800">
              {title || "Tanpa Judul"}
            </h3>
            <p className="text-sm text-gray-600">
              {category || "Tanpa Kategori"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <HiOutlineCalendar className="h-4 w-4" />
          {/* Format tanggal jika perlu */}
          <span>
            {date
              ? new Date(date).toLocaleDateString("id-ID")
              : "Tanggal tidak tersedia"}
          </span>
        </div>
      </div>
    </div>
  );
}
