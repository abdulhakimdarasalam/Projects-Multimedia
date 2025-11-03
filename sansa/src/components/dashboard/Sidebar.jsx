// src/components/dashboard/Sidebar.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
// 1. Impor useRouter
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineMenu,
} from "react-icons/hi";

const navItems = [
  { name: "Dashboard", href: "/user/dashboard", icon: HiOutlineHome },
  { name: "Base Project", href: "/user/base-project", icon: HiOutlineFolder },
  { name: "Profile", href: "/user/profile", icon: HiOutlineUser },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  // 2. Inisialisasi router
  const router = useRouter();

  // 3. Tambahkan fungsi handleLogout (tanpa 'confirm' atau 'alert')
  const handleLogout = async () => {
    try {
      // Panggil API backend untuk logout
      const response = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include", // PENTING: Agar cookie refreshToken terkirim
      });

      // Hapus accessToken dari localStorage (asumsi Anda menyimpannya di sini)
      localStorage.removeItem("accessToken");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      // Redirect ke halaman login setelah berhasil
      router.push("/auth/login");
    } catch (error) {
      // Catat error di console, tapi jangan gunakan 'alert'
      console.error("Logout error:", error);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 flex h-screen flex-col overflow-y-auto border-r bg-white py-8 transition-all duration-300 ${
        isOpen ? "w-64 px-5" : "w-20 px-3"
      }`}
    >
      <div
        className={`flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        {isOpen && (
          <Link
            href="/user/dashboard"
            className="text-2xl font-bold text-gray-800"
          >
            Stark
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <HiOutlineMenu className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-between">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex transform items-center rounded-lg py-2 transition-colors duration-300 ${
                isOpen ? "px-3" : "justify-center"
              } ${
                pathname === item.href
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
              {isOpen && (
                <span className="mx-2 text-sm font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* 4. Implementasi Tombol Logout */}
        <div className="mt-6">
          {/* Ganti <div> dengan <button> dan tambahkan onClick */}
          <button
            onClick={handleLogout}
            className={`flex w-full items-center rounded-lg p-2 text-left text-gray-600 transition-colors duration-300 hover:bg-gray-100 ${
              isOpen ? "justify-between" : "justify-center"
            }`}
          >
            <div className={`flex items-center gap-x-2 ${isOpen ? "p-1" : ""}`}>
              {/* Teks dan Ikon Logout (hanya tampil saat sidebar terbuka) */}
              {isOpen && <HiOutlineLogout className="h-5 w-5" />}
              {isOpen && <span className="text-sm font-medium">Log Out</span>}
            </div>

            {/* Avatar (selalu tampil, menjadi tombol saat sidebar tertutup) */}
            <Image
              className="h-8 w-8 rounded-full object-cover"
              src="/avatar-icon.svg"
              alt="avatar"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
