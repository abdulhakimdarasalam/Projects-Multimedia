"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function SubmissionPage() {
  const { projectId } = useParams() || {};
  const search = useSearchParams();
  const taskId = search?.get("taskId");

  const [task, setTask] = useState(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [taskError, setTaskError] = useState(null);
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  const fileInputRef = useRef(null);

  // Fetch task detail saat component mount
  useEffect(() => {
    if (!taskId) {
      setLoadingTask(false);
      return;
    }

    const fetchTask = async () => {
      try {
        setLoadingTask(true);

        // Backend saat ini punya endpoint GET /tasks/:projectId -> mengembalikan semua task untuk project
        // Tidak ada endpoint single-task seperti /tasks/detail/:taskId, jadi kita ambil semua task project
        // lalu cari task yang cocok berdasarkan taskId dari query string.
        if (!projectId) {
          throw new Error("Project ID tidak tersedia untuk mengambil task.");
        }

        const res = await api.get(`/tasks/${projectId}`);
        const tasksList = res.data?.data || res.data || [];

        const found = Array.isArray(tasksList)
          ? tasksList.find((t) => String(t.id) === String(taskId))
          : null;

        if (found) {
          setTask(found);
          setTaskError(null);
        } else {
          setTask(null);
          setTaskError("Task tidak ditemukan di dalam project ini.");
        }
      } catch (err) {
        console.error(`Gagal memuat detail task ${taskId}:`, err);
        setTaskError(
          err?.response?.data?.message ||
            err?.message ||
            "Gagal memuat data task."
        );
        setTask(null);
      } finally {
        setLoadingTask(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      // Simple file upload using FormData. Backend must accept `/submissions` POST with multipart/form-data
      const fd = new FormData();
      fd.append("file", file);
      fd.append("project_id", projectId);
      if (taskId) fd.append("task_id", taskId);
      fd.append("submissionType", "file");

      const res = await api.post("/submissions", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("File submission berhasil dikirim.");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(
        err?.response?.data?.message || "Gagal mengirim file submission."
      );
      setMessageType("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitUrl = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const payload = {
        project_id: projectId,
        submissionType: "url",
        url: url.trim(),
      };
      if (taskId) payload.task_id = taskId;

      const res = await api.post("/submissions", payload);

      setMessage("URL submission berhasil dikirim.");
      setMessageType("success");
      setUrl("");
    } catch (err) {
      console.error(err);
      setMessage(
        err?.response?.data?.message || "Gagal mengirim URL submission."
      );
      setMessageType("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <header className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Deskripsi Task & Submit
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Project ID: <span className="font-mono">{projectId}</span>
            {taskId ? (
              <span className="ml-3 text-sm text-gray-400">
                Task ID: <span className="font-mono">{taskId}</span>
              </span>
            ) : null}
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6">
          {/* Task Detail Section */}
          {loadingTask ? (
            <div className="border rounded-lg p-6">
              <p className="text-gray-500">Memuat data task...</p>
            </div>
          ) : taskError ? (
            <div className="border border-red-200 rounded-lg p-6 bg-red-50">
              <p className="text-red-600">{taskError}</p>
            </div>
          ) : task ? (
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {task.name || "Task"}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 mb-4">{task.description}</p>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {task.start_date && (
                  <div>
                    <p className="text-gray-500 font-medium">Tanggal Mulai</p>
                    <p className="text-gray-800">
                      {new Date(task.start_date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                )}
                {task.deadline && (
                  <div>
                    <p className="text-black font-medium">Deadline</p>
                    <p className="text-gray-800">
                      {new Date(task.deadline).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-6">
              <p className="text-gray-500">
                Tidak ada data task yang ditemukan.
              </p>
            </div>
          )}

          {/* Submission Form Section */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold">Tambah Submission</h4>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <p className="text-gray-500 mb-4">
                Drag & drop atau{" "}
                <button
                  type="button"
                  onClick={handleChooseFile}
                  className="text-blue-600 underline"
                >
                  pilih file
                </button>{" "}
                untuk upload
              </p>
              <button
                type="button"
                onClick={handleChooseFile}
                className="px-4 py-2 bg-white border rounded shadow-sm"
              >
                Pilih File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">atau</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmitUrl} className="space-y-4">
              <input
                type="text"
                placeholder="Masukkan URL file"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black"
                disabled={isUploading}
              />

              {message && (
                <p
                  className={`text-sm ${
                    messageType === "error" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUrl("");
                    setMessage(null);
                  }}
                  className="rounded-lg border px-4 py-2 bg-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                  {isUploading ? "Sedang Upload..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
