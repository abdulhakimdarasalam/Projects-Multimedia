"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_ADMIN_BASE_PROJECTS } from '@/data/mockAdminBaseProjects';
import { MOCK_PROJECT_TASKS } from '@/data/mockProjectTasks';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

const getStatusClass = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'Not Started': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function KelolaTugasPage() {
  const params = useParams();
  const { projectId } = params;

  const project = MOCK_ADMIN_BASE_PROJECTS.find(p => p.id === projectId);
  const tasks = MOCK_PROJECT_TASKS.filter(t => t.projectId === projectId);

  if (!project) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <Link href="/admin/base-project" className="text-blue-600 hover:underline mt-4 inline-block">
          Kembali ke daftar project
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Halaman Kelola Tugas</h1>
      <div className="flex items-center justify-between rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <span className="font-semibold text-gray-500">Nama Project</span>
          <span className="font-bold text-gray-800">: {project.name}</span>
          <span className="font-semibold text-gray-500">Deadline</span>
          <span className="font-bold text-gray-800">: {project.deadline}</span>
        </div>
        <Link 
          href={`/admin/base-project/${projectId}/task/add-task`}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 whitespace-nowrap"
        >
          + Tambah Tugas Baru
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 font-semibold text-gray-600">Nama Tugas</th>
                <th className="p-4 font-semibold text-gray-600">Deadline</th>
                <th className="p-4 font-semibold text-gray-600">Bobot (%)</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="p-4 font-medium text-gray-800">{task.name}</td>
                  <td className="p-4 text-gray-600">{task.deadline}</td>
                  <td className="p-4 text-gray-600">{task.weight}%</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded p-2 text-gray-500 hover:bg-gray-200"><HiOutlinePencil className="h-4 w-4" /></button>
                      <button className="rounded p-2 text-gray-500 hover:bg-gray-200"><HiOutlineTrash className="h-4 w-4" /></button>
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
