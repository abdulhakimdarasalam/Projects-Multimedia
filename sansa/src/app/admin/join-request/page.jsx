"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HiCheck, HiX } from "react-icons/hi";
import axios from "axios";
import { useJoinRequestStore } from "@/app/store/joinRequestStore";

const API_BASE_URL = "http://localhost:4000";

export default function JoinRequestPage() {
  // 👇 2. Ambil semua state dan fungsi dari store
  const { requests, isLoading, error, fetchRequests, removeRequestById } =
    useJoinRequestStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  const handleAccept = async (requestId) => {
    const token = getAuthToken();
    if (!token) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/project-registrations/${requestId}/accept`,
        {}, // Body kosong
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      removeRequestById(requestId);
      console.log(`Accepted request with ID: ${requestId}`);
    } catch (err) {
      console.error(`Gagal menerima request ${requestId}:`, err);
      alert("Gagal memproses permintaan. Coba lagi.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-red-300 bg-red-50 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Request Anggota</h1>
      </header>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Nama</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">
                  Nama Project
                </th>
                <th className="p-4 font-semibold text-gray-600">
                  Tanggal Daftar
                </th>
                <th className="p-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    Tidak ada *join request* saat ini.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">
                      {request.User ? request.User.name : "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {request.User ? request.User.email : "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {request.Project ? request.Project.title : "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-200"
                        >
                          <HiCheck className="h-4 w-4" />
                          accept
                        </button>
                        <Link
                          href={`/admin/join-request/reject/${request.id}`}
                          className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                        >
                          <HiX className="h-4 w-4" />
                          reject
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
