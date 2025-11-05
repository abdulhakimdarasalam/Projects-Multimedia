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

// Fungsi helper untuk status (tetap sama)
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

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    // Format ke 'dd-MM-yyyy'
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

  // --- PERUBAHAN 1: State untuk data, loading, dan error ---
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- PERUBAHAN 2: useEffect untuk Fetch Data ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Ambil token dari localStorage (sesuaikan jika beda)
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found, please login.");
        }

        // Ganti '/api/projects' dengan URL endpoint Anda yang sebenarnya
        const response = await axios.get("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProjects(response.data); // Simpan data dari API ke state
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message || "Gagal memuat data project.");
        // Jika error karena token (unauthorized), redirect ke login
        if (err.response && err.response.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false); // Hentikan loading
      }
    };

    fetchProjects();
  }, [router]); // Tambahkan router sebagai dependency

  const handleRowClick = (projectId) => {
    router.push(`/admin/base-project/${projectId}/task`);
  };

  // --- PERUBAHAN 3: Tampilkan Loading & Error ---
  if (loading) {
    return <div className="text-center p-10">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">Error: {error}</div>;
  }

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
                <th className="p-4 w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
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
              {/* --- PERUBAHAN 4: Mapping dari state 'projects' --- */}
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(project.id)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  {/* --- PERUBAHAN 5: Sesuaikan nama field ---
                    Berdasarkan controller Anda:
                    'name' -> 'title'
                    'startDate' -> 'start_date'
                    'deadline' -> 'end_date'
                  */}
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
                      {project.status || "Not Started"}{" "}
                      {/* Default status jika null */}
                    </span>
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {/* TODO: Tambahkan fungsi untuk tombol-tombol ini */}
                      <button className="rounded p-2 text-green-600 hover:bg-green-100">
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button className="rounded p-2 text-blue-600 hover:bg-blue-100">
                        <HiOutlineUserAdd className="h-4 w-4" />
                      </button>
                      <button className="rounded p-2 text-red-600 hover:bg-red-100">
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
