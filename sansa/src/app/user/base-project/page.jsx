// src/app/user/base-project/page.jsx
"use client";

import { useState } from 'react';
import BaseProjectCard from '@/components/baseproject/BaseProjectCard';
import { MOCK_BASE_PROJECTS } from '@/data/mockBaseProjects';
import { HiChevronRight } from 'react-icons/hi';

export default function BaseProjectPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'mine'

  // Nanti, data ini bisa difilter berdasarkan tab yang aktif
  const projects = MOCK_BASE_PROJECTS;

  return (
    <div>
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">List Project</h1>
      </header>

      {/* Tabs */}
      <div className="mt-8 flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'border-b-2 border-sky-600 text-sky-600'
              : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Semua Project
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'mine'
              ? 'border-b-2 border-sky-600 text-sky-600'
              : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Project saya
        </button>
      </div>

      {/* Project Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <BaseProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-12 flex justify-end">
        <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-sky-600">
          <span>Next</span>
          <span>2</span>
          <HiChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}