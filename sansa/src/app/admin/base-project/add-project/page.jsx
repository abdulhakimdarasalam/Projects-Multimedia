"use client";

import { useState } from "react";
import { HiOutlineCalendar } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TambahProjectPage() {
  const router = useRouter();

  // State untuk form
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  // State untuk UI/UX
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
        status: "pending",
      };

      await axios.post("http://localhost:4000/projects", projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Project Baru Disimpan:", projectData);
      router.push("/admin/base-project");
    } catch (err) {
      console.error("Gagal menambah project:", err);
      // 11. Tampilkan error
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
        setError("Sesi Anda habis. Silakan login kembali.");
      } else {
        setError("Terjadi kesalahan saat menyimpan project.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Buat Project Baru
      </h1>

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
            {isLoading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
