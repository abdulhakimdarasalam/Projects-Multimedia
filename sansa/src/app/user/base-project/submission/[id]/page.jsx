// src/app/user/base-project/submission/[id]/page.jsx

import AddSubmissionForm from "@/components/submission/AddSubmissionForm";
// Path import di atas sudah diperbarui dari '@/components/project/AddSubmissionForm'

// Dummy data untuk mengisi detail proyek
const dummyProject = {
  category: "UI/UX Design",
  title: "Desain Landing Page",
  description:
    "Buat desain awal landing page untuk project e-commerce. Fokus ke homepage & hero section.",
};

export default function SubmissionPage({ params }) {
  const { category, title, description } = dummyProject;

  return (
    <main className="min-h-screen p-8">
      {/* Header Detail Proyek */}
      <div className="mb-8">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
          {category}
        </p>
        <h1 className="text-3xl font-bold text-gray-800 mt-1">{title}</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">{description}</p>
      </div>

      {/* Form Submission */}
      <div className="max-w-4xl">
        <AddSubmissionForm />
      </div>
    </main>
  );
}
