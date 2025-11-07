// src/app/admin/base-project/[projectId]/task/add-task/page.jsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios"; // <-- 1. Impor axios

export default function AddTaskPage() {
  const router = useRouter();
  const params = useParams();
  const { projectId } = params;

  // 2. State untuk setiap input (sesuai API)
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState(""); // <-- Ditambahkan
  const [startDate, setStartDate] = useState(""); // <-- Ditambahkan
  const [deadline, setDeadline] = useState("");
  const [weight, setWeight] = useState("");

  // 3. State untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 5. Ubah handleSubmit menjadi async
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update validasi
    if (!taskName || !description || !startDate || !deadline || !weight) {
      alert("Harap isi semua field.");
      return;
    }

    setLoading(true);
    setError(null);

    // 6. Siapkan payload sesuai API
    const newTaskPayload = {
      name: taskName,
      description: description,
      start_date: startDate,
      deadline: deadline,
      value_weight: parseInt(weight, 10), // <-- Sesuaikan nama field
      project_id: parseInt(projectId, 10), // <-- Sesuaikan nama field
    };

    console.log("Mengirim data:", newTaskPayload);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      // Kirim data ke API
      await axios.post(
        "http://localhost:4000/tasks/", // <-- Endpoint dari screenshot
        newTaskPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      alert("Tugas baru berhasil ditambahkan!");

      // Setelah berhasil, kembali ke halaman daftar tugas
      router.push(`/admin/base-project/${projectId}/task`);
    } catch (err) {
      console.error("Error saat menambahkan tugas:", err);
      let errorMessage = "Gagal menambahkan tugas.";
      if (err.message === "Token tidak ditemukan. Silakan login kembali.") {
        errorMessage = err.message;
        router.push("/auth/login");
      } else if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
          router.push("/auth/login");
        } else {
          errorMessage =
            err.response.data?.message || "Terjadi kesalahan pada server.";
        }
      }
      setError(errorMessage);
      alert(errorMessage); // Tampilkan error
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Tugas Baru</h1>
      <p className="mb-6 text-sm text-gray-500">
        Menambahkan tugas untuk Project ID:{" "}
        <span className="font-mono">{projectId}</span>
      </p>

      {/* Tampilkan pesan error jika ada */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Input Nama Tugas */}
          <div>
            <label
              htmlFor="taskName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nama Tugas
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* 4. Input Deskripsi (BARU) */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* 4. Input Tanggal Mulai (BARU) */}
          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Tanggal Mulai
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Input Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Input Bobot */}
          <div>
            <label
              htmlFor="weight"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Bobot (value_weight)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Contoh: 10"
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex justify-end gap-4">
          <Link href={`/admin/base-project/${projectId}/task`}>
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Batal
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading} // <-- Nonaktifkan saat loading
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Tugas"} {/* <-- Teks loading */}
          </button>
        </div>
      </form>
    </div>
  );
}
