// src/components/dashboard/ProjectCard.jsx
import Image from 'next/image';
import { HiOutlineClock } from 'react-icons/hi';

export default function ProjectCard({ project }) {
  const { deadline, image, category, title, description, lastUpdate } = project;

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative p-5">
        <div className="absolute top-3 right-3 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
          Deadline {deadline}
        </div>
        <Image
          src={image}
          alt={title}
          width={300}
          height={180}
          className="mx-auto h-40 w-auto object-contain"
        />
      </div>
      <div className="border-t p-5">
        <p className="text-sm text-gray-500">{category}</p>
        <h3 className="mt-1 text-lg font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-yellow-600">
          <HiOutlineClock />
          <span>Update {lastUpdate} ago</span>
        </div>
        <button className="mt-4 w-full rounded-lg bg-[#6080A4] py-2.5 text-sm font-semibold text-white transition hover:bg-[#526d8c]">
          Lanjutkan
        </button>
      </div>
    </div>
  );
}