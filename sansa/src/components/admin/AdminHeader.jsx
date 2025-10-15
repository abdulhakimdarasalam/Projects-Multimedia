// src/components/admin/AdminHeader.jsx
import Image from 'next/image';
import { HiOutlineBell, HiOutlineChevronDown } from 'react-icons/hi';

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard admin</h1>
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <HiOutlineBell className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-gray-100 cursor-pointer">
          <Image
            src="/avatar-icon.svg"
            alt="Admin Avatar"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </header>
  );
}