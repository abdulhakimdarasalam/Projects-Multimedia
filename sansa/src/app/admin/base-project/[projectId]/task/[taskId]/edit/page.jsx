"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditTaskPage() {
  const router = useRouter();
  const { projectId, taskId } = useParams();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [valueWeight, setValueWeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!projectId || !taskId) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized");

        // backend may not provide GET /tasks/:id — fetch tasks by project
        const res = await axios.get(
          `http://localhost:4000/tasks/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const all = res.data || [];
        const t = all.find((x) => String(x.id) === String(taskId));
        if (!t) {
          setError("Task tidak ditemukan.");
          return;
        }

        setName(t.name || "");
        setStartDate(t.start_date ? t.start_date.split("T")[0] : "");
        setDeadline(t.deadline ? t.deadline.split("T")[0] : "");
        setValueWeight(t.value_weight ?? 0);
      } catch (err) {
        console.error("Gagal memuat task:", err);
        setError("Gagal memuat data task.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [projectId, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !startDate || !deadline) {
      setError("Harap isi semua field yang wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Unauthorized");

      const payload = {
        name,
        start_date: startDate,
        deadline,
        value_weight: Number(valueWeight),
      };

      await axios.put(`http://localhost:4000/tasks/${taskId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push(`/admin/base-project/${projectId}/task`);
    } catch (err) {
      console.error("Gagal menyimpan perubahan task:", err);
      setError(err?.response?.data?.message || "Gagal menyimpan task.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !name)
    return <div className="p-10 text-center">Memuat task...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Task</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nama Task
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Bobot
            </label>
            <input
              type="number"
              value={valueWeight}
              onChange={(e) => setValueWeight(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-300 px-4 py-2.5"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Link href={`/admin/base-project/${projectId}/task`}>
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700"
            >
              Batal
            </button>
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
