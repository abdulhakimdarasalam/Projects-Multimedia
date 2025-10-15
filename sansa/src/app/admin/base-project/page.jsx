// src/app/admin/base-project/page.jsx
import { MOCK_ADMIN_BASE_PROJECTS } from '@/data/mockAdminBaseProjects';
import { HiOutlinePencil, HiOutlineUserAdd, HiOutlineTrash, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

// Helper function untuk styling status
const getStatusClass = (status) => {
  switch (status) {
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'Not Started':
      return 'bg-gray-100 text-gray-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function AdminBaseProjectPage() {
  const projects = MOCK_ADMIN_BASE_PROJECTS;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Welcome admin!</h1>
        <p className="mt-1 text-3xl font-bold text-gray-800">Kelola Project</p>
      </header>

      {/* Tombol Tambah Project */}
      <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-gray-600">Tambah Project baru</p>
        <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          + Tambah Project Baru
        </button>
      </div>

      {/* Tabel Project */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-4 font-medium"></th>
                <th className="p-4 font-medium">Nama Project</th>
                <th className="p-4 font-medium">Tanggal mulai</th>
                <th className="p-4 font-medium">Deadline</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Aksi</th>
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
        
        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 border-t p-4 text-sm">
            <button className="rounded p-2 hover:bg-gray-100"><HiChevronLeft className="h-5 w-5"/></button>
            <button className="rounded h-8 w-8 bg-sky-100 text-sky-600 font-semibold">1</button>
            <button className="rounded h-8 w-8 hover:bg-gray-100">2</button>
            <button className="rounded h-8 w-8 hover:bg-gray-100">3</button>
            <span>...</span>
            <button className="rounded h-8 w-8 hover:bg-gray-100">25</button>
            <button className="rounded p-2 hover:bg-gray-100"><HiChevronRight className="h-5 w-5"/></button>
        </div>
      </div>
    </div>
  );
}