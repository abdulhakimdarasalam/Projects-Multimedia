"use client";

import { useEffect } from "react";
import {
  HiOutlineCollection,
  HiOutlineBadgeCheck,
  HiOutlineUsers,
} from "react-icons/hi";

import AdminHeader from "../../../components/admin/AdminHeader";
import ProjectStatusChart from "../../../components/admin/ProjectStatusChart";
import { useAdminDashboardStore } from "../../store/adminDashboardStore";

const getStatusClass = (status) => {
  switch (status) {
    case "ongoing":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboardPage() {
  // 1. Ambil state dan action dari store Zustand
  const { data, isLoading, error, fetchDashboardData } =
    useAdminDashboardStore();
  const { summary, projectStatusChart, projectList } = data;

  // 2. Panggil API saat komponen pertama kali dimuat
  useEffect(() => {
    fetchDashboardData(1); // Ambil data halaman 1
  }, [fetchDashboardData]);

  // 3. Buat data stats dinamis dari 'summary'
  const stats = [
    {
      icon: HiOutlineCollection,
      value: summary.totalProjects ?? "0", // '?? 0' untuk fallback jika data belum ada
      title: "Total Project",
    },
    {
      icon: HiOutlineBadgeCheck,
      value: summary.activeProjects ?? "0",
      title: "Project Aktif",
    },
    {
      icon: HiOutlineUsers,
      value: summary.totalUsers ?? "0",
      title: "Total User",
    },
  ];

  // 4. Fungsi untuk ganti halaman
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > projectList.pagination.totalPages) {
      return; // Jangan lakukan apa-apa jika halaman tidak valid
    }
    fetchDashboardData(newPage);
  };

  // 5. Tampilkan loading spinner
  if (isLoading && !projectList.projects.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading data...</p> {/* Ganti dengan komponen spinner Anda */}
      </div>
    );
  }

  // 6. Tampilkan pesan error
  if (error) {
    return (
      <div className="space-y-8">
        <AdminHeader />
        <div className="rounded-xl border bg-white p-6 shadow-sm text-red-500">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  // 7. Tampilkan halaman jika data sudah siap
  return (
    <div className="space-y-8">
      <AdminHeader />

      {/* Kartu Statistik (sudah dinamis) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-center rounded-full bg-sky-100 h-12 w-12">
              <stat.icon className="h-6 w-6 text-sky-600" />
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-800">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Bagian Bawah: Tabel dan Chart */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* List Project Overview (sudah dinamis) */}
        <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800">
            List Project Overview
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-3 font-medium">Nama Project</th>
                  <th className="py-3 font-medium">Tugas</th>
                  <th className="py-3 font-medium">Deadline</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Ganti projectList jadi projectList.projects */}
                {projectList.projects.map((project) => (
                  <tr key={project.id} className="border-b">
                    {/* Sesuaikan nama field (project.namaProject, project.kategori, dll) */}
                    <td className="py-4 font-medium text-gray-800">
                      {project.namaProject}
                    </td>
                    <td className="py-4 text-gray-600">{project.tugas}</td>
                    <td className="py-4 text-gray-600">
                      {formatDate(project.deadline)}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full capitalize px-2.5 py-1 text-xs font-medium ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (sudah dinamis) */}
          <div className="mt-4 flex items-center justify-end gap-2 text-sm">
            <button
              className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
              onClick={() =>
                handlePageChange(projectList.pagination.currentPage - 1)
              }
              disabled={projectList.pagination.currentPage === 1}
            >
              &lt;
            </button>
            <button className="rounded h-8 w-8 bg-sky-100 text-sky-600 font-semibold">
              {projectList.pagination.currentPage}
            </button>
            <button
              className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
              onClick={() =>
                handlePageChange(projectList.pagination.currentPage + 1)
              }
              disabled={
                projectList.pagination.currentPage ===
                projectList.pagination.totalPages
              }
            >
              &gt;
            </button>
            <span className="ml-2 text-gray-500">
              Page {projectList.pagination.currentPage} of{" "}
              {projectList.pagination.totalPages}
            </span>
          </div>
        </div>

        {/* Project Status Overview (kirim data ke chart) */}
        <div className="lg:col-span-1">
          {/* Kirim data API ke komponen chart Anda */}
          <ProjectStatusChart data={projectStatusChart} />
        </div>
      </div>
    </div>
  );
}
