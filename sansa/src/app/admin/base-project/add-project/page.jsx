// src/app/admin/base-project/tambah/page.jsx
"use client";

import { useState } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TambahProjectPage() {
  const router = useRouter(); // Hook untuk navigasi
  
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectName || !startDate || !deadline) {
      alert('Harap isi semua field yang ditandai *');
      return;
    }
    const newProject = { name: projectName, startDate, deadline };
    console.log('Project Baru Disimpan:', newProject);
    
    // Setelah submit, kembali ke halaman tabel
    router.push('/admin/base-project'); 
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Project Baru</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Input Nama Project */}
          <div>
            <label htmlFor="projectName" className="mb-2 block text-sm font-medium text-gray-700">
              Nama Project <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Input Tanggal Mulai */}
          <div className="relative">
            <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-gray-700">
              Tanggal mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <HiOutlineCalendar className="pointer-events-none absolute right-4 top-10 h-5 w-5 text-gray-400" />
          </div>

          {/* Input Deadline */}
          <div className="relative">
            <label htmlFor="deadline" className="mb-2 block text-sm font-medium text-gray-700">
              Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <HiOutlineCalendar className="pointer-events-none absolute right-4 top-10 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex justify-end gap-4">
          <Link href="/admin/base-project">
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Batal
            </button>
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}