"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  HiOutlinePencil,
  HiOutlineUserAdd,
  HiOutlineTrash,
} from "react-icons/hi";

// Helper untuk status
const getStatusClass = (status) => {
  switch (status) {
    case "In Progress":
      return "bg-yellow-100 text-yellow-800";
    case "Not Started":
      return "bg-gray-100 text-gray-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  } catch (error) {
    console.error("Invalid date string:", dateString);
    return "Invalid Date";
  }
};

export default function AdminBaseProjectPage() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // useEffect untuk fetch data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("Akses ditolak. Anda belum login.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:4000/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // API mungkin mengembalikan array langsung atau objek { status, data }
        const payload = response.data?.data ?? response.data;
        setProjects(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Error fetching projects:", err);

        if (err.response && err.response.status === 401) {
          setError("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          setError("Gagal memuat data project.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleRowClick = (projectId) => {
    router.push(`/admin/base-project/${projectId}/task`);
  };

  const handleEdit = (e, projectId) => {
    e.stopPropagation();
    router.push(`/admin/base-project/${projectId}/edit`);
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();

    const ok = window.confirm(
      "Yakin ingin menghapus project ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!ok) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Unauthorized");

      await axios.delete(`http://localhost:4000/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setActionMessage("Project berhasil dihapus.");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error("Gagal menghapus project:", err);
      setActionMessage(
        err?.response?.data?.message || "Gagal menghapus project."
      );
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // Tampilkan status Loading
  if (loading) {
    return <div className="p-10 text-center">Memuat project...</div>;
  }

  // Tampilkan status Error
  if (error) {
    return <div className="p-10 text-center text-red-600">Error: {error}</div>;
  }

  // Tampilan utama
  return (
    <div className="space-y-8">
      {actionMessage && (
        <div className="p-3 rounded bg-green-50 text-green-700 border border-green-100">
          {actionMessage}
        </div>
      )}
      {/* Header Halaman */}
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Welcome admin!</h1>
        <p className="mt-1 text-3xl font-bold text-gray-800">Kelola Project</p>
      </header>

      {/* Tombol Tambah Project */}
      <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-gray-600">Tambah Project baru</p>
        <Link
          href="/admin/base-project/add-project"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Tambah Project Baru
        </Link>
      </div>

      {/* Tabel Project */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-gray-600">
                  Nama Project
                </th>
                <th className="p-4 font-semibold text-gray-600">
                  Tanggal mulai
                </th>
                <th className="p-4 font-semibold text-gray-600">Deadline</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(project.id)}
                >
                  <td className="p-4 font-medium text-gray-800">
                    {project.title}
                  </td>
                  <td className="p-4 text-gray-600">
                    {formatDate(project.start_date)}
                  </td>
                  <td className="p-4 text-gray-600">
                    {formatDate(project.end_date)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        project.status
                      )}`}
                    >
                      {project.status || "Not Started"}
                    </span>
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleEdit(e, project.id)}
                        className="rounded p-2 text-green-600 hover:bg-green-100"
                        title="Edit project"
                      >
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, project.id)}
                        className="rounded p-2 text-red-600 hover:bg-red-100"
                        title="Hapus project"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
