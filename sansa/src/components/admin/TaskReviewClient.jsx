"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function TaskReviewClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params?.projectId;
  const taskId = searchParams?.get("taskId");

  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!taskId) {
      setError("Task ID tidak ditemukan");
      setLoading(false);
      return;
    }
    fetchData();
  }, [taskId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch task details
      const taskRes = await api.get(`/tasks/${projectId}`);
      const tasksList = taskRes.data?.data || taskRes.data || [];
      const foundTask = Array.isArray(tasksList)
        ? tasksList.find((t) => String(t.id) === String(taskId))
        : null;

      if (!foundTask) {
        throw new Error("Task tidak ditemukan");
      }

      setTask(foundTask);

      // Fetch submissions for this task
      const submissionsRes = await api.get(
        `/task-submissions/by-task/${taskId}`,
      );
      const submissionsData =
        submissionsRes.data?.data || submissionsRes.data || [];
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat data task dan submissions",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    if (!window.confirm("Apakah Anda yakin ingin menyetujui submission ini?")) {
      return;
    }

    try {
      await api.put(`/task-submissions/${submissionId}/approve`);
      setMessage({ type: "success", text: "Submission berhasil disetujui" });
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error approving submission:", err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Gagal menyetujui submission. Silakan coba lagi.",
      });
    }
  };

  const handleReject = async (submissionId) => {
    const reason = window.prompt("Masukkan alasan penolakan (opsional):");
    if (reason === null) return; // User cancelled

    try {
      await api.put(`/task-submissions/${submissionId}/reject`, {
        rejection_reason: reason || undefined,
      });
      setMessage({ type: "success", text: "Submission berhasil ditolak" });
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error rejecting submission:", err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Gagal menolak submission. Silakan coba lagi.",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Menunggu",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Disetujui",
      },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Ditolak" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-semibold">Error</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Review Submission</h1>
        {task && (
          <p className="text-gray-600 mt-2">
            Task: <span className="font-medium">{task.name}</span>
          </p>
        )}
      </header>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Task Info Card */}
      {task && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Informasi Task
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nama Task</p>
              <p className="font-medium text-gray-800">{task.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Deadline</p>
              <p className="font-medium text-gray-800">
                {formatDate(task.deadline)}
              </p>
            </div>
            {task.description && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Deskripsi</p>
                <p className="font-medium text-gray-800">{task.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Daftar Submission ({submissions.length})
          </h2>
        </div>

        {submissions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada submission untuk task ini
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Submit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.User?.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.User?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {submission.content ? (
                          submission.content.startsWith("http") ? (
                            <a
                              href={submission.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Link Submission
                            </a>
                          ) : (
                            submission.content
                          )
                        ) : (
                          <span className="text-gray-400">
                            Belum ada content
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.submitted_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {submission.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(submission.id)}
                            className="text-green-600 hover:text-green-900 px-3 py-1 rounded border border-green-600 hover:bg-green-50"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleReject(submission.id)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      {submission.status !== "pending" && (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
