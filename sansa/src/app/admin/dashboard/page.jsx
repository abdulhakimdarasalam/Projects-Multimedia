// src/app/admin/dashboard/page.jsx
import { HiOutlineCollection, HiOutlineBadgeCheck, HiOutlineUsers, HiOutlineArrowSmRight } from 'react-icons/hi';
import AdminHeader from '@/components/admin/AdminHeader';
import ProjectStatusChart from '@/components/admin/ProjectStatusChart';

// Data tiruan
const stats = [
  { icon: HiOutlineCollection, value: "25", title: "Total Project" },
  { icon: HiOutlineBadgeCheck, value: "22", title: "Project Aktif" },
  { icon: HiOutlineUsers, value: "50", title: "Total User" },
];

const projectList = [
  { name: 'UI/UX Desain', category: 'Design', tasks: 7, deadline: '12 Sept 2025', status: 'Active' },
  { name: 'Web Development', category: 'Development', tasks: 10, deadline: '22 Sept 2025', status: 'Active' },
  { name: 'UI/UX Desain Mobile', category: 'Design', tasks: 10, deadline: '15 Oct 2025', status: 'In Progress' },
  { name: 'Pengabdian Masyarakat', category: 'Riset & Sosial', tasks: 6, deadline: '12 Sept 2025', status: 'Active' },
  { name: 'Data Analyst', category: 'Science', tasks: 8, deadline: '31 Sept 2025', status: 'Active' },
];

// Fungsi untuk styling status badge
const getStatusClass = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700';
    case 'In Progress': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminHeader />

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-center rounded-full bg-sky-100 h-12 w-12">
              <stat.icon className="h-6 w-6 text-sky-600" />
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Bagian Bawah: Tabel dan Chart */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* List Project Overview */}
        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800">List Project Overview</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-3 font-medium">Nama Project</th>
                  <th className="py-3 font-medium">Kategori</th>
                  <th className="py-3 font-medium">Tugas</th>
                  <th className="py-3 font-medium">Deadline</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {projectList.map((project) => (
                  <tr key={project.name} className="border-b">
                    <td className="py-4 font-medium text-gray-800">{project.name}</td>
                    <td className="py-4 text-gray-600">{project.category}</td>
                    <td className="py-4 text-gray-600">{project.tasks}</td>
                    <td className="py-4 text-gray-600">{project.deadline}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="mt-4 flex items-center justify-end gap-2 text-sm">
            <button className="rounded p-2 hover:bg-gray-100">&lt;</button>
            <button className="rounded h-8 w-8 bg-sky-100 text-sky-600 font-semibold">1</button>
            <button className="rounded h-8 w-8 hover:bg-gray-100">2</button>
            <button className="rounded h-8 w-8 hover:bg-gray-100">3</button>
            <span>...</span>
            <button className="rounded h-8 w-8 hover:bg-gray-100">25</button>
            <button className="rounded p-2 hover:bg-gray-100">&gt;</button>
          </div>
        </div>

        {/* Project Status Overview */}
        <div className="lg:col-span-1">
          <ProjectStatusChart />
        </div>
      </div>
    </div>
  );
}