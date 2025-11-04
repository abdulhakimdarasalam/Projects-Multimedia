"use client";

import { useState } from "react";
import Link from "next/link";
import { MOCK_JOIN_REQUESTS } from "../../../data/mockJoinRequests.js";
import { HiCheck, HiX, HiOutlineMenu } from "react-icons/hi";

export default function JoinRequestPage() {
  const [requests, setRequests] = useState(MOCK_JOIN_REQUESTS);

  // Fungsi untuk menangani saat admin menerima permintaan
  const handleAccept = (requestId) => {
    console.log(`Accepted request with ID: ${requestId}`);
    // Hapus request dari daftar di UI
    setRequests((currentRequests) =>
      currentRequests.filter((req) => req.id !== requestId)
    );
  };

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
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">
                    {request.name}
                  </td>
                  <td className="p-4 text-gray-600">{request.email}</td>
                  <td className="p-4 text-gray-600">{request.projectName}</td>
                  <td className="p-4 text-gray-600">{request.requestDate}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
