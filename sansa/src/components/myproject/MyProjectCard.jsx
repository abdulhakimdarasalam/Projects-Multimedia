// src/components/user/ActiveProjectCard.jsx
import { HiOutlineCalendar } from 'react-icons/hi';
import Link from 'next/link';

export default function ActiveProjectCard({ project }) {
  const { status, category, title, date } = project;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border bg-white p-6 shadow-sm hover:bg-gray-50 transition-colors">
      
      {/* Kolom Kiri: Informasi Proyek */}
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
              {status}
            </span>
            <h3 className="mt-2 text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{category}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <HiOutlineCalendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </div>

      {/* Kolom Kanan: Tombol Lihat Detail */}
      <div className="w-full sm:w-auto">
        <Link href="#" className="font-medium text-sky-600 hover:text-sky-800 transition-colors">
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}