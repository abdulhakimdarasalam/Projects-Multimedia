"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getTasksByProjectId } from "@/lib/api";

export default function ProjectTasksPageClient() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiReturnedNoBody, setApiReturnedNoBody] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    let mounted = true;

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      setApiReturnedNoBody(false);

      try {
        const data = await getTasksByProjectId(projectId);

        if (data === undefined || data === null) {
          if (!mounted) return;
          setApiReturnedNoBody(true);
          setTasks([]);
        } else if (Array.isArray(data)) {
          if (!mounted) return;
          setTasks(data);
        } else if (Array.isArray(data?.data)) {
          if (!mounted) return;
          setTasks(data.data);
        } else if (Array.isArray(data?.tasks)) {
          if (!mounted) return;
          setTasks(data.tasks);
        } else {
          if (!mounted) return;
          setTasks([]);
        }
      } catch (err) {
        console.error(`Gagal memuat tasks untuk project ${projectId}:`, err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat daftar tugas.";
        setError(message);

        // jika 401, arahkan ke login
        if (err?.response?.status === 401) {
          // ubah route ke login setelah sedikit delay agar user lihat pesan
          setTimeout(() => {
            router.push("/auth/login");
          }, 500);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTasks();

    return () => {
      mounted = false;
    };
  }, [projectId, router]);

  if (!projectId) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Project ID tidak tersedia</h1>
        <p className="text-gray-600">
          Tidak dapat menampilkan tugas tanpa Project ID.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Tugas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Project ID: <span className="font-mono">{projectId}</span>
        </p>
      </header>

      {loading && <p className="text-gray-600">Memuat tugas...</p>}

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">Terjadi Kesalahan</p>
          <p>{error}</p>
        </div>
      )}

      {!error && apiReturnedNoBody && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-6">
          <p className="font-semibold">Perhatian</p>
          <p>
            Endpoint mengembalikan body kosong — tidak ada data tugas yang
            diterima.
          </p>
        </div>
      )}

      {!error && !loading && tasks.length === 0 && !apiReturnedNoBody && (
        <p className="text-gray-600">
          Belum ada tugas yang ditetapkan untuk proyek ini.
        </p>
      )}

      {!error && tasks.length > 0 && (
        <div className="space-y-4">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="bg-white p-5 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {task.name || task.title || `Task ${task.id}`}
                </h2>
                {task.deadline && (
                  <p className="text-sm text-gray-500">
                    Deadline:{" "}
                    {new Date(task.deadline).toLocaleDateString("id-ID")}
                  </p>
                )}
                {task.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {task.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">Task ID: {task.id}</p>
              </div>

              <div className="flex-shrink-0 ml-4">
                <Link
                  href={`/user/base-project/${projectId}/detail/submission?taskId=${task.id}`}
                  prefetch={false}
                >
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Lihat & Submit ↗️
                  </button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
