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
    case "in progress": // Tambahkan status "In Progress"
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
  // Mengambil category dihilangkan untuk mencocokkan desain
  const { id, status, title, date } = project;

  // Tentukan URL detail project ke submission page
  // Saya berasumsi Anda ingin mengirim ID project ke halaman submission.
  const detailUrl = `/user/base-project/submission/${id}`;

  return (
    // Styling card yang lebih mendekati desain
    <div className="flex items-center justify-between gap-4 rounded-xl border-b bg-white p-6 transition-colors shadow-sm hover:shadow-md">
      {/* Kolom Kiri: Informasi Proyek */}
      <div className="flex-1 min-w-0">
        {/* Badge status dinamis */}
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {status || "N/A"}
        </span>

        <h3 className="mt-1 text-lg font-semibold text-gray-800 truncate">
          {title || "Tanpa Judul"}
        </h3>

        {/* Tanggal */}
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <HiOutlineCalendar className="h-4 w-4" />
          <span>
            {date
              ? new Date(date)
                  .toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/\./g, "") // Format tanggal sesuai contoh desain (e.g., 15 Sep 2025)
              : "Tanggal tidak tersedia"}
          </span>
        </div>
      </div>

      {/* Kolom Kanan: Link Detail */}
      <div className="flex-shrink-0">
        <Link
          href={detailUrl}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
