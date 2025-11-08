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

// Tentukan Base URL API di sini juga
const API_BASE_URL = "http://localhost:4000";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  // 2. Inisialisasi router
  const router = useRouter();

  // 3. Tambahkan fungsi untuk mengambil token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  // 4. Perbaiki fungsi handleLogout
  const handleLogout = async () => {
    const token = getAuthToken();

    try {
      // Panggil API backend untuk logout
      // Hanya panggil API jika ada token
      if (token) {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          credentials: "include", // Tetap pakai ini jika backend butuh cookie (refreshToken)

          // ==========================================================
          // INI PERBAIKAN UTAMANYA
          // ==========================================================
          headers: {
            "Content-Type": "application/json",
            // Kirim 'accessToken' sebagai Bearer Token
            // Ini yang diminta oleh error "Token tidak ditemukan di header Authorization"
            Authorization: `Bearer ${token}`,
          },
          // ==========================================================
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Catat error dari server, tapi jangan hentikan proses logout
          console.warn(
            "Server logout error:",
            errorData.message || "Logout failed"
          );
        } else {
          console.log("Berhasil logout dari server.");
        }
      }
    } catch (error) {
      // Catat error network, tapi jangan hentikan proses logout
      console.error("Logout API error:", error);
    } finally {
      // ==========================================================
      // PINDAHKAN LOGIKA PENTING KE 'FINALLY'
      // ==========================================================
      // Ini akan SELALU dijalankan, baik API-nya berhasil, gagal, atau tidak ada token.

      // 1. Hapus accessToken dari localStorage
      localStorage.removeItem("accessToken");

      // 2. Redirect ke halaman login setelah berhasil
      // Pastikan URL login Anda benar
      router.push("/auth/login");
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

        {/* 5. Implementasi Tombol Logout (Kode Anda sudah benar) */}
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
