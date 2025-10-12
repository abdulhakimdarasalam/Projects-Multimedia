// src/app/user/layout.jsx
"use client"; // Kita butuh client component untuk menggunakan state

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function UserLayout({ children }) {
  // 1. Buat state untuk mengontrol sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // 2. Buat fungsi untuk mengubah state
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8]">
      {/* 3. Kirim state dan fungsi sebagai props ke Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* 4. Atur margin konten utama secara dinamis */}
      {/* Jika sidebar terbuka, beri margin kiri w-64. Jika tertutup, w-20 */}
      <main className={`flex-1 overflow-y-auto px-8 py-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {children}
      </main>
    </div>
  );
}