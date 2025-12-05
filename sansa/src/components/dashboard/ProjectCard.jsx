// src/components/dashboard/ProjectCard.jsx
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale/id"; // Untuk Bahasa Indonesia

export default function ProjectCard({ project }) {
  // 'image' tidak kita ambil lagi, karena kita hardcode gambarnya
  const { deadline, category, title, description, lastUpdate } = project;

  // 1. Cek 'deadline'
  const deadlineDate = new Date(deadline); // Coba parse
  // Cek apakah hasilnya valid
  const isDeadlineValid = !isNaN(deadlineDate.getTime());

  const formattedDeadline = isDeadlineValid
    ? format(deadlineDate, "d MMM yyyy", { locale: id })
    : "N/A"; // Fallback jika 'deadline' null atau invalid

  // 2. lastUpdate tidak lagi ditampilkan pada kartu dashboard

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative p-5">
        <div className="absolute top-3 right-3 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
          {/* Gunakan tanggal yang sudah diformat */}
          Deadline {formattedDeadline}
        </div>
        <Image
          // 1. GAMBAR DIUBAH KE /pana.png
          src="/pana.png"
          alt={title}
          width={300}
          height={180}
          className="mx-auto h-40 w-auto object-contain"
        />
      </div>
      <div className="border-t p-5">
        {/* 2. DATA API LAINNYA (Category, Title, Desc) */}
        <p className="text-sm text-gray-500">{category}</p>
        <h3 className="mt-1 text-lg font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>

        <div className="mt-4" />

        <Link
          href={`/user/base-project`}
          className="mt-4 block w-full rounded-lg bg-[#6080A4] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#526d8c]"
        >
          Lanjutkan
        </Link>
      </div>
    </div>
  );
}
