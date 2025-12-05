// src/app/admin/base-project/[projectId]/task/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// PERBAIKAN: Impor 'useParams'
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  HiOutlinePencil,
  HiOutlineUserAdd,
  HiOutlineTrash,
  HiOutlineCheckCircle,
} from "react-icons/hi";

// Helper untuk format tanggal (tetap sama)
const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    // Tambahkan timeZone UTC agar tidak bergeser harinya
    return date
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      })
      .replace(/\//g, "-");
  } catch (error) {
    console.error("Invalid date string:", dateString);
    return "Invalid Date";
  }
};

// PERBAIKAN: Hapus '{ params }' dari props
export default function ProjectTaskPage() {
  const router = useRouter();

  // PERBAIKAN: Gunakan hook 'useParams' untuk mendapatkan projectId
  const { projectId } = useParams(); // Ini akan berisi ID dari URL

  const [projectName, setProjectName] = useState("");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect untuk fetch data tasks
  useEffect(() => {
    // Pastikan projectId ada sebelum fetch
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found, please login.");
        }

        // PERBAIKAN: Ini adalah endpoint yang dikonfirmasi oleh screenshot Anda
        const response = await axios.get(
          `http://localhost:4000/tasks/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter data yang 'deleted_at'-nya null (jika API tidak melakukannya)
        const activeTasks = Array.isArray(response.data)
          ? response.data.filter((task) => task.deleted_at === null)
          : []; // Pastikan response.data adalah array

        setTasks(activeTasks); // Simpan data task
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err.message || "Gagal memuat data task.");
        if (err.response && err.response.status === 401) {
          setError("Sesi habis, silakan login kembali.");
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, router]); // Dependency array sekarang 'projectId'

  // Fetch project name separately so header can show project title
  useEffect(() => {
    const fetchProjectName = async () => {
      if (!projectId) return;
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get("http://localhost:4000/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = res.data || [];
        const proj = all.find((p) => String(p.id) === String(projectId));
        setProjectName(proj?.title || "");
      } catch (err) {
        console.error("Gagal memuat nama project:", err);
      }
    };

    fetchProjectName();
  }, [projectId]);

  if (loading) {
    return <div className="p-10 text-center">Memuat tasks...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">Error: {error}</div>;
  }

  const handleEdit = (taskId) => {
    router.push(`/admin/base-project/${projectId}/task/${taskId}/edit`);
  };

  const handleDelete = async (taskId) => {
    const ok = window.confirm(
      "Yakin ingin menghapus task ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!ok) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Unauthorized");

      await axios.delete(`http://localhost:4000/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Gagal menghapus task:", err);
      alert(err?.response?.data?.message || "Gagal menghapus task.");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">
          {projectName ? ` ${projectName}` : `Project ID: ${projectId}`}
        </h1>
        <p className="mt-1 text-3xl font-bold text-gray-800">Kelola Tasks</p>
      </header>

      <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-gray-600">Tambah Task baru untuk project ini</p>
        <Link
          href={`/admin/base-project/${projectId}/task/add-task`}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Tambah Task Baru
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="p-4 font-semibold text-gray-600">Nama Task</th>
                <th className="p-4 font-semibold text-gray-600">
                  Tanggal Mulai
                </th>
                <th className="p-4 font-semibold text-gray-600">Deadline</th>
                <th className="p-4 font-semibold text-gray-600">Bobot</th>
                <th className="p-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{task.name}</td>
                  <td className="p-4 text-gray-600">
                    {formatDate(task.start_date)}
                  </td>
                  <td className="p-4 text-gray-600">
                    {formatDate(task.deadline)}
                  </td>
                  <td className="p-4 text-gray-600">{task.value_weight}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/base-project/${projectId}/task/review?taskId=${task.id}`}
                        className="rounded p-2 text-blue-600 hover:bg-blue-100 transition"
                        title="Review Submissions"
                      >
                        <HiOutlineCheckCircle className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(task.id)}
                        className="rounded p-2 text-green-600 hover:bg-green-100"
                        title="Edit task"
                      >
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="rounded p-2 text-red-600 hover:bg-red-100"
                        title="Hapus task"
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
