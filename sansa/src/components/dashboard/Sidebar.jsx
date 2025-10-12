// src/components/dashboard/Sidebar.jsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineFolder, HiOutlineUser, HiOutlineLogout, HiOutlineMenu } from 'react-icons/hi';

const navItems = [
  { name: 'Dashboard', href: '/user/dashboard', icon: HiOutlineHome },
  { name: 'Base Project', href: '/user/base-project', icon: HiOutlineFolder },
  { name: 'Profile', href: '/user/profile', icon: HiOutlineUser },
];

// 1. Terima props isOpen dan toggleSidebar
export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();

  return (
    // 2. Atur lebar dan padding secara dinamis + tambahkan transisi
    <aside 
      className={`fixed top-0 left-0 z-40 flex h-screen flex-col overflow-y-auto border-r bg-white py-8 transition-all duration-300 ${isOpen ? 'w-64 px-5' : 'w-20 px-3'}`}
    >
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {/* 3. Tampilkan logo hanya jika sidebar terbuka */}
        {isOpen && (
          <Link href="/user/dashboard" className="text-2xl font-bold text-gray-800">
            Stark
          </Link>
        )}
        {/* 4. Jadikan tombol hamburger fungsional */}
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 focus:outline-none">
          <HiOutlineMenu className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-between">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              // 5. Atur alignment dan padding link secara dinamis
              className={`flex transform items-center rounded-lg py-2 transition-colors duration-300 ${
                isOpen ? 'px-3' : 'justify-center'
              } ${
                pathname === item.href
                  ? 'bg-sky-100 text-sky-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
              {/* 6. Tampilkan teks hanya jika sidebar terbuka */}
              {isOpen && <span className="mx-2 text-sm font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-6">
          <div className={`flex items-center rounded-lg p-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 ${isOpen ? 'justify-between' : 'justify-center'}`}>
            <div className={`flex items-center gap-x-2 ${isOpen ? 'p-1' : ''}`}>
              {/* 7. Sembunyikan 'Log Out' dan tampilkan foto profil secara berbeda */}
              {isOpen && <HiOutlineLogout className="h-5 w-5" />}
              {isOpen && <span className="text-sm font-medium">Log Out</span>}
            </div>
            <Image
              className="h-8 w-8 rounded-full object-cover"
              src="/avatar-icon.svg"
              alt="avatar"
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}