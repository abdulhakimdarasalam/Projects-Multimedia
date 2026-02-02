"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function TaskForm({
  initialData = null,
  taskId = null,
  projectId,
}) {
  const router = useRouter();
  const isEditMode = !!taskId;

  const [taskName, setTaskName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [startDate, setStartDate] = useState(initialData?.start_date || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [weight, setWeight] = useState(initialData?.value_weight || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName || !description || !startDate || !deadline || !weight) {
      setError("Harap isi semua field.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: taskName,
      description: description,
      start_date: startDate,
      deadline: deadline,
      value_weight: parseInt(weight, 10),
      project_id: parseInt(projectId, 10),
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }

      if (isEditMode) {
        await axios.put(`http://localhost:4000/tasks/${taskId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:4000/tasks/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setLoading(false);
      router.push(`/admin/base-project/${projectId}/task`);
    } catch (err) {
      console.error("Error:", err);
      let errorMessage = "Gagal menyimpan tugas.";
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
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit Tugas" : "Buat Tugas Baru"}
      </h1>

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
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Menyimpan..."
              : isEditMode
                ? "Simpan Perubahan"
                : "Simpan Tugas"}
          </button>
        </div>
      </form>
    </div>
  );
}
