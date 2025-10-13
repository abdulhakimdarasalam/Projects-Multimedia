// src/app/user/dashboard/page.jsx
import StatCard from '@/components/dashboard/StatCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { DUMMY_PROJECTS } from '@/data/MockProjects';

export default function DashboardPage() {
  const projects = DUMMY_PROJECTS; // Nanti ini akan diganti dengan data dari API

  return (
    <div>
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Good Morning, Geral!</h1>
        <p className="mt-1 text-gray-500">Ayo lanjutkan progres tugasmu</p>
      </header>

      {/* Stat Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard type="active" count={7} title="Tugas Aktif Saya" />
        <StatCard type="completed" count={10} title="Project Selesai" />
      </div>

      {/* My Project Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800">My Project</h2>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}