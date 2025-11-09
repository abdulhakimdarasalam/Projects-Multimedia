// src/app/user/dashboard/page.jsx

// 1. WAJIB: Tambahkan "use client" di baris paling atas
"use client";

// 2. Impor hooks dan komponen
import { useEffect } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
// import { DUMMY_PROJECTS } from "@/data/MockProjects"; // <-- Hapus ini

// 3. Impor store Zustand dan instance Axios kita
import { useDashboardUserStore } from "@/app/store/userDashboardStore"; // <-- Pastikan path ini benar
import api from "@/lib/api"; // <-- Pastikan path ini benar

export default function DashboardPage() {
  // 4. Hapus data dummy
  // const projects = DUMMY_PROJECTS; // <-- Hapus ini

  // 5. Ambil semua state dan action dari store Zustand
  const { profile, stats, projects, isLoading, error, fetchDashboardData } =
    useDashboardUserStore((state) => state);

  // 6. Panggil API saat komponen pertama kali dimuat
  useEffect(() => {
    // Panggil fungsi 'fetch' dari store,
    // dan berikan instance 'api' kita sebagai parameter
    fetchDashboardData(api);
  }, [fetchDashboardData]); // fetchDashboardData dijamin stabil oleh Zustand

  // 7. Handle UI state (Loading)
  // Ini penting agar UI tidak "loncat"
  if (isLoading) {
    return <DashboardLoadingSkeleton />; // Tampilkan skeleton selagi loading
  }

  // 8. Handle UI state (Error)
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-red-500">Oops! Terjadi kesalahan.</p>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => fetchDashboardData(api)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  // 9. Tampilkan UI jika data berhasil dimuat
  // Ini adalah JSX asli kamu, tapi dengan data dinamis
  return (
    <div>
      {/* Header (DINAMIS) */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Good Morning, {profile.name}! {/* <-- DATA DINAMIS */}
        </h1>
        <p className="mt-1 text-gray-500">Ayo lanjutkan progres tugasmu</p>
      </header>

      {
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            type="active"
            count={stats.activeProjects}
            title="Tugas Aktif Saya"
          />
          <StatCard
            type="completed"
            count={stats.allProjects}
            title="Semua Projek"
          />
        </div>
      }

      {/* My Project Section (DINAMIS) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800">My Project</h2>

        {/* Tambahkan pengecekan jika tidak ada project */}
        {projects.length === 0 ? (
          <p className="mt-6 text-gray-500">
            Kamu belum memiliki project aktif.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {/* Loop data project dari store Zustand */}
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// (Opsional) Komponen Skeleton Loader
// Kamu bisa tempel ini di bawah atau buat file terpisah
const DashboardLoadingSkeleton = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    <header>
      <div className="h-10 w-3/4 rounded-lg bg-gray-300"></div>
      <div className="mt-2 h-6 w-1/2 rounded-lg bg-gray-200"></div>
    </header>

    {/* Stat Cards Skeleton */}
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="h-28 rounded-lg bg-gray-200"></div>
      <div className="h-28 rounded-lg bg-gray-200"></div>
    </div>

    {/* My Project Section Skeleton */}
    <div className="mt-12">
      <div className="h-8 w-1/4 rounded-lg bg-gray-300"></div>
      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <div className="h-48 rounded-lg bg-gray-200"></div>
        <div className="h-48 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  </div>
);
