"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_JOIN_REQUESTS } from '../../../../../data/mockJoinRequests.js';
import { HiX } from 'react-icons/hi';

export default function RejectRequestPage() {
  const router = useRouter();
  const params = useParams();
  const { requestId } = params;

  const [rejectionReason, setRejectionReason] = useState('');

  const requestData = MOCK_JOIN_REQUESTS.find(req => req.id === requestId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('Alasan penolakan tidak boleh kosong.');
      return;
    }

    console.log({
      message: 'Submitting rejection...',
      requestId: requestId,
      reason: rejectionReason,
    });

    router.push('/admin/join-request');
  };

  if (!requestData) {
    return <div className="p-8 text-center">Request not found.</div>;
  }

  return (
    // 👇 DIV BACKDROP YANG SEBELUMNYA ADA DI SINI SUDAH DIHAPUS
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reject Anggota</h2>
          <p className="mt-1 text-sm text-gray-500">Anda akan menolak permintaan dari:</p>
        </div>
        <Link href="/admin/join-request" className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100">
          <HiX className="h-6 w-6" />
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Field yang tidak bisa diubah */}
          <div>
            <label className="text-xs text-gray-500">Nama</label>
            <input type="text" disabled value={requestData.name} className="mt-1 w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Untuk bergabung ke Proyek</label>
            <input type="text" disabled value={requestData.projectName} className="mt-1 w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Tanggal Permintaan</label>
            <input type="text" disabled value={requestData.requestDate} className="mt-1 w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-2.5" />
          </div>

          {/* Field Alasan Penolakan */}
          <div>
            <label htmlFor="rejectionReason" className="mb-2 block text-sm font-medium text-gray-700">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="rejectionReason"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Isi keterangan..."
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex justify-end gap-4">
          <Link href="/admin/join-request">
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Batal
            </button>
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Kirim Penolakan
          </button>
        </div>
      </form>
    </div>
  );
}

