import {
  HiOutlineCollection,
  HiOutlineBadgeCheck,
  HiOutlineUsers,
} from "react-icons/hi";

export default function StatsCards({ summary }) {
  const stats = [
    {
      icon: HiOutlineCollection,
      value: summary.totalProjects ?? "0",
      title: "Total Project",
    },
    {
      icon: HiOutlineBadgeCheck,
      value: summary.activeProjects ?? "0",
      title: "Project Aktif",
    },
    {
      icon: HiOutlineUsers,
      value: summary.totalUsers ?? "0",
      title: "Total User",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-center rounded-full bg-sky-100 h-12 w-12">
            <stat.icon className="h-6 w-6 text-sky-600" />
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.title}</p>
        </div>
      ))}
    </div>
  );
}
