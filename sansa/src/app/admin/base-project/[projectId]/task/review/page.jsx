"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowLeft,
} from "react-icons/hi";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      })
      .replace(/\//g, "-");
  } catch (error) {
    return "Invalid Date";
  }
};

export default function TaskReviewPage() {
  const router = useRouter();
  const { projectId } = useParams();
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");

  const [submissions, setSubmissions] = useState([]);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Track which submission is being processed
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  // Fetch task detail dan submissions
  useEffect(() => {
    if (!taskId || !projectId) {
      setError("Task ID atau Project ID tidak tersedia.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch task detail
        const taskRes = await api.get(`/tasks/${projectId}`);
        const tasksList = Array.isArray(taskRes.data)
          ? taskRes.data
          : taskRes.data?.data || [];
        const foundTask = tasksList.find(
          (t) => String(t.id) === String(taskId)
        );

        if (!foundTask) {
          setError("Task tidak ditemukan.");
          setLoading(false);
          return;
        }
        setTask(foundTask);

        // Fetch all submissions (tidak filter by user — admin lihat semua)
        // Kita perlu endpoint untuk get submissions by task_id
        // Untuk saat ini, kita fetch semua dan filter di client
        // TODO: Ideal ada endpoint GET /task-submissions/task/:taskId
        try {
          // Try to fetch all submissions — depends on backend API
          // For now, we'll use a workaround: fetch all users and their submissions
          // This is temporary until you have a dedicated endpoint

          // Alternative: Create a new backend endpoint GET /task-submissions/by-task/:taskId
          const submissionsRes = await api.get(
            `/task-submissions/by-task/${taskId}`
          );
          const submissionsList = Array.isArray(submissionsRes.data)
            ? submissionsRes.data
            : submissionsRes.data?.data || [];

          setSubmissions(submissionsList);
        } catch (submissionErr) {
          console.error("Error fetching submissions:", submissionErr);
          // If endpoint doesn't exist, show error
          if (submissionErr?.response?.status === 404) {
            setError(
              "Endpoint untuk fetch submissions belum tersedia di backend. Silakan implementasikan GET /task-submissions/by-task/:taskId"
            );
          } else {
            setError("Gagal memuat submissions.");
          }
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err?.response?.data?.message || "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [taskId, projectId]);

  // Handle approve submission
  const handleApprove = async (submissionId) => {
    setActionLoading(submissionId);
    setMessage(null);

    try {
      const res = await api.put(
        `/task-submissions/${submissionId}/approve`,
        {}
      );

      setMessage("Submission berhasil di-approve.");
      setMessageType("success");

      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, status: "approved" } : sub
        )
      );

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Gagal approve submission.");
      setMessageType("error");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reject submission
  const handleReject = async (submissionId) => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (!reason || reason.trim() === "") {
      setMessage("Alasan penolakan tidak boleh kosong.");
      setMessageType("error");
      return;
    }

    setActionLoading(submissionId);
    setMessage(null);

    try {
      const res = await api.put(`/task-submissions/${submissionId}/reject`, {
        rejection_reason: reason,
      });

      setMessage("Submission berhasil di-reject.");
      setMessageType("success");

      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId
            ? { ...sub, status: "rejected", rejection_reason: reason }
            : sub
        )
      );

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Gagal reject submission.");
      setMessageType("error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Memuat submissions...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 hover:bg-gray-100 transition"
          title="Kembali"
        >
          <HiOutlineArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Review Submissions
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Task: <span className="font-semibold">{task?.name || "-"}</span>
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            messageType === "error"
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-green-50 text-green-600 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="p-10 text-center text-gray-500 border rounded-lg">
          Belum ada submission untuk task ini.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">User</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600">
                    Submitted At
                  </th>
                  <th className="p-4 font-semibold text-gray-600">Content</th>
                  <th className="p-4 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {submission.User?.name || `User ${submission.user_id}`}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.status === "submitted"
                            ? "bg-yellow-100 text-yellow-800"
                            : submission.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : submission.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {submission.submitted_at
                        ? formatDate(submission.submitted_at)
                        : "-"}
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {submission.content ? (
                        submission.content.startsWith("/uploads/") ? (
                          <a
                            href={`http://localhost:4000${submission.content}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            View File
                          </a>
                        ) : (
                          <a
                            href={submission.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            {submission.content.substring(0, 50)}...
                          </a>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {submission.status === "submitted" && (
                          <>
                            <button
                              onClick={() => handleApprove(submission.id)}
                              disabled={actionLoading === submission.id}
                              className="rounded p-2 text-green-600 hover:bg-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              <HiOutlineCheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(submission.id)}
                              disabled={actionLoading === submission.id}
                              className="rounded p-2 text-red-600 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <HiOutlineXCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {submission.status !== "submitted" && (
                          <span className="text-xs text-gray-500">
                            {submission.status === "approved"
                              ? "✓ Approved"
                              : submission.status === "rejected"
                              ? "✗ Rejected"
                              : "—"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
