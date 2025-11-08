// src/components/baseproject/BaseProjectCard.jsx
import { HiOutlineCalendar, HiOutlineUsers } from "react-icons/hi";

// 1. Terima prop 'onJoin' di sini
export default function BaseProjectCard({ project, onJoin }) {
  const {
    id,
    status,
    title,
    description,
    date,
    participants,
    maxParticipants,
  } = project;
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-transform hover:-translate-y-1">
      {/* Konten Kartu */}
      <div className="flex-grow p-6">
        <div className="mb-4">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {status}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <HiOutlineCalendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineUsers className="h-4 w-4" />
            <span>{`${participants}/${maxParticipants} orang`}</span>
          </div>
        </div>
      </div>

      {/* Tombol Join */}
      <div className="border-t bg-gray-50 p-4">
        {/* 2. Tambahkan onClick di sini, memanggil onJoin dengan ID project */}
        <button
          onClick={() => onJoin(project.id)}
          className="w-full rounded-lg bg-[#6080A4] py-2.5 text-sm font-semibold text-white transition hover:bg-[#526d8c]"
        >
          Join Now
        </button>
      </div>
    </div>
  );
}
