"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useJoinRequestStore } from "@/app/store/joinRequestStore";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export default function RejectRequestClient() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.requestId;

  const { requests, fetchRequests } = useJoinRequestStore();
  const [request, setRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch requests if not loaded yet
    if (requests.length === 0) {
      fetchRequests();
    }
  }, [requests.length, fetchRequests]);

  useEffect(() => {
    // Find the request from store
    if (requestId && requests.length > 0) {
      const found = requests.find((r) => String(r.id) === String(requestId));
      if (found) {
        setRequest(found);
        setError(null);
      } else {
        setError("Permintaan tidak ditemukan");
      }
    }
  }, [requestId, requests]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rejectionReason.trim()) {
      alert("Alasan penolakan harus diisi");
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin menolak permintaan ini?")) {
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `${API_BASE_URL}/project-registrations/${requestId}/reject`,
        { rejection_reason: rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Permintaan berhasil ditolak");
      router.push("/admin/join-request");
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert(
        err?.response?.data?.message ||
          "Gagal menolak permintaan. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-semibold">Error</p>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/admin/join-request")}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Memuat data permintaan...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Tolak Permintaan Bergabung
        </h1>
        <p className="text-gray-600 mt-2">
          Berikan alasan penolakan untuk permintaan ini
        </p>
      </header>

      {/* Request Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Informasi Permintaan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nama User</p>
            <p className="font-medium text-gray-800">
              {request.User?.name || "Unknown User"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email User</p>
            <p className="font-medium text-gray-800">
              {request.User?.email || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Project</p>
            <p className="font-medium text-gray-800">
              {request.Project?.title || "Unknown Project"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tanggal Request</p>
            <p className="font-medium text-gray-800">
              {request.createdAt
                ? new Date(request.createdAt).toLocaleDateString("id-ID")
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Alasan Penolakan
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="rejectionReason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Alasan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={5}
              required
              placeholder="Masukkan alasan penolakan..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
            />
            <p className="text-sm text-gray-500 mt-1">
              Berikan penjelasan yang jelas agar user memahami alasan penolakan
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/join-request")}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Tolak Permintaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
