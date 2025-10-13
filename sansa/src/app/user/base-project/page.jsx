// src/app/user/base-project/page.jsx
"use client";

import { useState } from 'react';
import { HiChevronRight } from 'react-icons/hi';

// Impor komponen dan data yang relevan
import BaseProjectCard from '@/components/baseproject/BaseProjectCard';
import ActiveProjectCard from '@/components/myproject/MyProjectCard'; // Komponen baru
import { MOCK_BASE_PROJECTS } from '@/data/mockBaseProjects';
import { MOCK_ACTIVE_PROJECTS } from '@/data/mockMyProjects'; // Data baru

export default function BaseProjectPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'mine'

  // Siapkan data untuk masing-masing tab
  const allProjects = MOCK_BASE_PROJECTS;
  const myProjects = MOCK_ACTIVE_PROJECTS; // Menggunakan data baru

  return (
    <div>
      {/* Tabs - Tidak berubah */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-gray-200 text-gray-800'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Semua Project
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
            activeTab === 'mine'
              ? 'bg-gray-200 text-gray-800'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Project Saya
        </button>
      </div>

      {/* Konten Dinamis Berdasarkan Tab */}
      <div className="mt-8">
        {activeTab === 'all' ? (
          // === TAMPILAN SEMUA PROJECT (GRID) ===
          <>
            <header>
              <h1 className="text-3xl font-bold text-gray-800">List Project</h1>
            </header>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {allProjects.map((project) => (
                <BaseProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="mt-12 flex justify-end">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-sky-600">
                <span>Next</span>
                <span>2</span>
                <HiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          // === TAMPILAN PROJECT SAYA (LIST BARU) ===
          <>
            <header>
              <h1 className="text-3xl font-bold text-gray-800">Project Aktif Saya</h1>
              <p className="mt-1 text-gray-500">Keep track biar progress-mu makin lancar!</p>
            </header>
            <div className="mt-8 space-y-4">
              {myProjects.map((project) => (
                <ActiveProjectCard key={project.id} project={project} /> // Menggunakan komponen baru
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}