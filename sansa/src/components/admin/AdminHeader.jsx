// src/components/admin/AdminHeader.jsx
import Image from "next/image";
import { HiOutlineBell, HiOutlineChevronDown } from "react-icons/hi";

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard admin</h1>
      <div className="flex items-center gap-4"></div>
    </header>
  );
}
