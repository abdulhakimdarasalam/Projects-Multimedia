"use client";

import { useState, useEffect } from "react";
import { HiOutlineCalendar } from "react-icons/hi";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  // expected param name is `projectId` from the folder name
  const projectId = params?.projectId || null;

  // State untuk form
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  // State untuk UI/UX
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch project data saat mount / saat projectId berubah
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized");

        // Some backends don't provide GET /projects/:id — fetch all and find
        const res = await axios.get(`http://localhost:4000/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend mungkin mengembalikan { status, data: [...] } atau array langsung
        const allPayload = res.data?.data ?? res.data;
        const all = Array.isArray(allPayload) ? allPayload : [];
        const p = all.find((x) => String(x.id) === String(projectId));
        if (!p) {
          setError("Project tidak ditemukan.");
          setIsLoading(false);
          return;
        }
        setProjectName(p.title || "");
        setDescription(p.description || "");
        setStartDate(p.start_date ? p.start_date.split("T")[0] : "");
        setDeadline(p.end_date ? p.end_date.split("T")[0] : "");
      } catch (err) {
        console.error("Gagal memuat project:", err);
        if (err.response && err.response.status === 401) {
          setError("Sesi Anda habis. Silakan login kembali.");
        } else {
          setError("Gagal memuat data project.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // don't show empty form while initial data is loading
  if (isLoading && !projectName) {
    return <div className="p-10 text-center">Memuat project...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!projectName || !startDate || !deadline || !description) {
      setError("Harap isi semua field yang wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Otentikasi gagal. Silakan login kembali.");
        setIsLoading(false);
        return;
      }

      const projectData = {
        title: projectName,
        description: description,
        start_date: startDate,
        end_date: deadline,
        // keep status as-is or change to pending when editing
      };

      await axios.put(
        `http://localhost:4000/projects/${projectId}`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/admin/base-project");
    } catch (err) {
      console.error("Gagal mengubah project:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
        setError("Sesi Anda habis. Silakan login kembali.");
      } else {
        setError("Terjadi kesalahan saat menyimpan perubahan project.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Project</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Input Nama Project */}
          <div>
            <label
              htmlFor="projectName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nama Project <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Deskripsi Project <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Input Tanggal Mulai */}
          <div className="relative">
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Tanggal mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Input Deadline */}
          <div className="relative">
            <label
              htmlFor="deadline"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="mt-8 flex justify-end gap-4">
          <Link href="/admin/base-project">
            <button
              type="button"
              disabled={isLoading}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
