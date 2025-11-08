// src/components/admin/AdminSidebar.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // <-- Impor useRouter
import axios from "axios"; // <-- Impor axios
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineUserGroup,
  HiOutlineLogout,
  HiOutlineMenu,
} from "react-icons/hi";

// Tentukan Base URL API kamu
const API_BASE_URL = "http://localhost:4000";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HiOutlineHome },
  { name: "Base Project", href: "/admin/base-project", icon: HiOutlineFolder },
  {
    name: "Join Request",
    href: "/admin/join-request",
    icon: HiOutlineUserGroup,
  },
];

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter(); // <-- Inisialisasi router

  // Fungsi untuk handle logout
  const handleLogout = async () => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("accessToken");

    try {
      // 1. Panggil API logout (jika token ada)
      if (token) {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {}, // Tidak perlu body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      // Jika API gagal (misal server mati atau token sudah expired),
      // kita tetap lanjutkan proses logout di client.
      console.error("Gagal logout dari server:", error);
    } finally {
      // 2. Hapus token dari client
      localStorage.removeItem("accessToken");
      router.push("/auth/login");
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 flex h-screen flex-col justify-between border-r bg-white py-8 transition-all duration-300 ${
        isOpen ? "w-64 px-5" : "w-20 items-center px-3"
      }`}
    >
      <div>
        {/* Header (Tidak berubah) */}
        <div
          className={`flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isOpen && (
            <Link
              href="/admin/dashboard"
              className="text-2xl font-bold text-gray-800"
            >
              Stark
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none"
          >
            <HiOutlineMenu className="h-6 w-6" />
          </button>
        </div>

        {/* Navigasi (Tidak berubah) */}
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={isOpen ? "" : item.name}
              className={`flex items-center rounded-lg py-2.5 transition-colors duration-300 ${
                isOpen ? "px-3" : "justify-start"
              } ${
                pathname.startsWith(item.href)
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-6 w-6" />
              {isOpen && (
                <span className="mx-3 text-sm font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-6 w-full">
        {/* Tambahkan onClick di sini */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-x-2 rounded-lg p-2 transition-colors hover:bg-gray-100"
        >
          <HiOutlineLogout className="h-6 w-6 text-gray-600" />
          {isOpen && (
            <span className="text-sm font-medium text-gray-700">Log Out</span>
          )}
        </button>
      </div>
    </aside>
  );
}
