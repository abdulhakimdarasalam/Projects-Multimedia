// src/app/admin/base-project/page.jsx

import Link from 'next/link';
import { MOCK_ADMIN_BASE_PROJECTS } from '@/data/mockAdminBaseProjects';
import { HiOutlinePencil, HiOutlineUserAdd, HiOutlineTrash, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

// Fungsi untuk menentukan warna status (tidak berubah)
const getStatusClass = (status) => {
  switch (status) {
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Not Started': return 'bg-gray-100 text-gray-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminBaseProjectPage() {
  const projects = MOCK_ADMIN_BASE_PROJECTS;

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Welcome admin!</h1>
        <p className="mt-1 text-3xl font-bold text-gray-800">Kelola Project</p>
      </header>

      {/* Tombol Tambah Project */}
      <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-gray-600">Tambah Project baru</p>
        <Link 
          href="/admin/base-project/add"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Tambah Project Baru
        </Link>
      </div>

      {/* ====================================================== */}
      {/* BAGIAN TABEL YANG HILANG - KEMBALIKAN KODE INI */}
      {/* ====================================================== */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 font-semibold text-gray-600">Nama Project</th>
                <th className="p-4 font-semibold text-gray-600">Tanggal mulai</th>
                <th className="p-4 font-semibold text-gray-600">Deadline</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="p-4 font-medium text-gray-800">{project.name}</td>
                  <td className="p-4 text-gray-600">{project.startDate}</td>
                  <td className="p-4 text-gray-600">{project.deadline}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-2 text-green-600 hover:bg-green-100"><HiOutlinePencil className="h-4 w-4" /></button>
                      <button className="rounded p-2 text-blue-600 hover:bg-blue-100"><HiOutlineUserAdd className="h-4 w-4" /></button>
                      <button className="rounded p-2 text-red-600 hover:bg-red-100"><HiOutlineTrash className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Disini bisa ditambahkan kode pagination jika perlu */}
      </div>
    </div>
  );
}