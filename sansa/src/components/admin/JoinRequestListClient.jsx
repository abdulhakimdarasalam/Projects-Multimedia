"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useJoinRequestStore } from "@/app/store/joinRequestStore";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export default function JoinRequestListClient() {
  const { requests, isLoading, error, fetchRequests } = useJoinRequestStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = async (requestId) => {
    if (!window.confirm("Apakah Anda yakin ingin menerima permintaan ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${API_BASE_URL}/project-registrations/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Permintaan berhasil diterima!");
      fetchRequests(); // Refresh data
    } catch (err) {
      console.error("Error accepting request:", err);
      alert(
        err?.response?.data?.message ||
          "Gagal menerima permintaan. Silakan coba lagi.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Memuat permintaan bergabung...</p>
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
        <h1 className="text-3xl font-bold text-gray-800">
          Permintaan Bergabung
        </h1>
        <p className="text-gray-600 mt-2">
          Kelola permintaan user untuk bergabung ke project
        </p>
      </header>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada permintaan bergabung
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
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Request
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.User?.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.User?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.Project?.title || "Unknown Project"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.Project?.category || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {request.status === "pending"
                          ? "Menunggu"
                          : request.status === "accepted"
                            ? "Diterima"
                            : request.status === "rejected"
                              ? "Ditolak"
                              : request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString(
                            "id-ID",
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(request.id)}
                            className="text-green-600 hover:text-green-900 px-3 py-1 rounded border border-green-600 hover:bg-green-50"
                          >
                            Terima
                          </button>
                          <Link
                            href={`/admin/join-request/reject/${request.id}`}
                          >
                            <button className="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-600 hover:bg-red-50">
                              Tolak
                            </button>
                          </Link>
                        </>
                      )}
                      {request.status !== "pending" && (
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
