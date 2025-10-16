"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddTaskPage() {
  const router = useRouter();
  const params = useParams();
  const { projectId } = params;

  // State untuk setiap input di form
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskName || !deadline || !weight) {
      alert('Harap isi semua field.');
      return;
    }

    const newTask = {
      projectId,
      name: taskName,
      deadline,
      weight: parseInt(weight, 10), // Ubah bobot menjadi angka
    };

    console.log('Tugas baru untuk disimpan:', newTask);
    
    // Setelah berhasil, kembali ke halaman daftar tugas
    router.push(`/admin/base-project/${projectId}/task`);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Tugas Baru</h1>
      <p className="mb-6 text-sm text-gray-500">
        Menambahkan tugas untuk Project ID: <span className="font-mono">{projectId}</span>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Input Nama Tugas */}
          <div>
            <label htmlFor="taskName" className="mb-2 block text-sm font-medium text-gray-700">
              Nama Tugas
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Input Deadline */}
          <div>
            <label htmlFor="deadline" className="mb-2 block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Input Bobot */}
          <div>
            <label htmlFor="weight" className="mb-2 block text-sm font-medium text-gray-700">
              Bobot (%)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Contoh: 20"
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-8 flex justify-end gap-4">
          <Link href={`/admin/base-project/${projectId}/task`}>
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
            Simpan Tugas
          </button>
        </div>
      </form>
    </div>
  );
}

