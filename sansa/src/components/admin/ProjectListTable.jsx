const getStatusClass = (status) => {
  switch (status) {
    case "ongoing":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ProjectListTable({ projectList, onPageChange }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
      <h3 className="text-lg font-bold text-gray-800">List Project Overview</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-3 font-medium">Nama Project</th>
              <th className="py-3 font-medium">Tugas</th>
              <th className="py-3 font-medium">Deadline</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {projectList.projects.map((project) => (
              <tr key={project.id} className="border-b">
                <td className="py-4 font-medium text-gray-800">
                  {project.namaProject}
                </td>
                <td className="py-4 text-gray-600">{project.tugas}</td>
                <td className="py-4 text-gray-600">
                  {formatDate(project.deadline)}
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full capitalize px-2.5 py-1 text-xs font-medium ${getStatusClass(
                      project.status,
                    )}`}
                  >
                    {project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex text-black items-center justify-end gap-2 text-sm">
        <button
          className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => onPageChange(projectList.pagination.currentPage - 1)}
          disabled={projectList.pagination.currentPage === 1}
        >
          &lt;
        </button>
        <button className="rounded h-8 w-8 bg-sky-100 text-sky-600 font-semibold">
          {projectList.pagination.currentPage}
        </button>
        <button
          className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => onPageChange(projectList.pagination.currentPage + 1)}
          disabled={
            projectList.pagination.currentPage ===
            projectList.pagination.totalPages
          }
        >
          &gt;
        </button>
        <span className="ml-2 text-gray-500">
          Page {projectList.pagination.currentPage} of{" "}
          {projectList.pagination.totalPages}
        </span>
      </div>
    </div>
  );
}
