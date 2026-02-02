"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function SubmissionClient() {
  const { projectId } = useParams() || {};
  const search = useSearchParams();
  const taskId = search?.get("taskId");

  const [task, setTask] = useState(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [taskError, setTaskError] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loadingSubmission, setLoadingSubmission] = useState(true);
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitMode, setSubmitMode] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!taskId) {
      setLoadingTask(false);
      return;
    }

    const fetchTask = async () => {
      try {
        setLoadingTask(true);

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
            "Gagal memuat data task.",
        );
        setTask(null);
      } finally {
        setLoadingTask(false);
      }
    };

    fetchTask();
  }, [taskId, projectId]);

  useEffect(() => {
    if (!taskId) {
      setLoadingSubmission(false);
      return;
    }

    const fetchSubmission = async () => {
      try {
        setLoadingSubmission(true);

        const meRes = await api.get("/api/auth/me");
        const user =
          meRes.data?.data || meRes.data || meRes.data?.user || meRes.data;
        const userId = user?.id;

        if (!userId) {
          setSubmission(null);
          return;
        }

        const res = await api.get(
          `/task-submissions/user/${userId}?status=all`,
        );
        const list = res.data?.data || res.data || [];

        const found = Array.isArray(list)
          ? list.find((s) => String(s.task_id) === String(taskId))
          : null;

        if (found) {
          setSubmission(found);
        } else {
          setSubmission(null);
        }
      } catch (err) {
        console.error("Gagal mengambil task submission:", err);
        setSubmission(null);
      } finally {
        setLoadingSubmission(false);
      }
    };

    fetchSubmission();
  }, [taskId]);

  const ensureSubmissionExists = async () => {
    try {
      if (submission?.id) return submission;

      if (!taskId) {
        throw new Error("Task ID tidak tersedia untuk membuat submission.");
      }

      let userId = null;
      try {
        const meRes = await api.get("/api/auth/me");
        const user =
          meRes.data?.data || meRes.data || meRes.data?.user || meRes.data;
        userId = user?.id;
      } catch (e) {
        console.error("Gagal mendapatkan info user:", e);
        throw new Error("Gagal memverifikasi pengguna. Silakan login ulang.");
      }

      if (!userId) {
        throw new Error("User ID tidak ditemukan. Silakan login ulang.");
      }

      if (userId) {
        try {
          const listRes = await api.get(
            `/task-submissions/user/${userId}?status=all`,
          );
          const list = listRes.data?.data || listRes.data || [];
          const found = Array.isArray(list)
            ? list.find((s) => String(s.task_id) === String(taskId))
            : null;
          if (found) {
            setSubmission(found);
            return found;
          }
        } catch (e) {
          console.error("Gagal mencari existing submission:", e);
        }
      }

      try {
        const createRes = await api.post("/task-submissions/auto-create", {
          task_id: taskId,
        });
        const created = createRes.data?.data || createRes.data;
        setSubmission(created);
        return created;
      } catch (err) {
        console.error("Gagal auto-create submission:", err);
        throw new Error(
          err?.response?.data?.message ||
            "Gagal membuat submission. Silakan coba lagi atau hubungi administrator.",
        );
      }
    } catch (err) {
      console.error("ensureSubmissionExists error:", err);
      throw err;
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setSubmitMode("file");
    setUrl("");
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage(null);

    try {
      let targetSubmission = submission;
      if (!targetSubmission?.id) {
        targetSubmission = await ensureSubmissionExists();
      }

      if (submitMode === "file" && selectedFile) {
        const fd = new FormData();
        fd.append("content", selectedFile);

        const res = await api.put(
          `/task-submissions/${targetSubmission.id}/submit`,
          fd,
        );

        const updated = res.data?.data || res.data || targetSubmission;
        setSubmission(updated);
        setSelectedFile(null);
        setSubmitMode(null);

        setMessage("File submission berhasil dikirim.");
        setMessageType("success");

        setTimeout(() => {
          window.location.href = `/user/base-project/${projectId}`;
        }, 2000);
      } else if (submitMode === "url" && url.trim()) {
        const payload = { content: url.trim() };
        const res = await api.put(
          `/task-submissions/${targetSubmission.id}/submit`,
          payload,
        );

        const updated = res.data?.data || res.data || targetSubmission;
        setSubmission(updated);
        setUrl("");
        setSubmitMode(null);

        setMessage("URL submission berhasil dikirim.");
        setMessageType("success");

        setTimeout(() => {
          window.location.href = `/user/base-project/${projectId}`;
        }, 2000);
      } else {
        setMessage("Pilih file atau masukkan URL terlebih dahulu.");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Gagal mengirim submission.");
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
        </header>

        <section className="grid grid-cols-1 gap-6">
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

          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md text-black font-semibold">
                Tambah Submission
              </h4>
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
                disabled={isUploading}
              >
                Pilih File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />

              {selectedFile && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-700 font-medium">
                    File dipilih: {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Klik tombol Upload di bawah untuk mengirim
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">atau</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedFile && (
                <input
                  type="text"
                  placeholder="Atau masukkan URL file"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setSubmitMode("url");
                      setSelectedFile(null);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-black"
                  disabled={isUploading}
                />
              )}

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
                    setSelectedFile(null);
                    setSubmitMode(null);
                    setMessage(null);
                  }}
                  className="rounded-lg border text-black px-4 py-2 bg-white"
                  disabled={isUploading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading || (!selectedFile && !url.trim())}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
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
