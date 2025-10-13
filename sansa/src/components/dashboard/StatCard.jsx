// src/components/dashboard/StatCard.jsx
import { HiOutlineBadgeCheck, HiOutlineCollection } from 'react-icons/hi';

// Objek untuk mapping ikon agar lebih rapi
const icons = {
  active: HiOutlineCollection,
  completed: HiOutlineBadgeCheck,
};

export default function StatCard({ type, count, title }) {
  const Icon = icons[type];
  const colors = type === 'active' 
    ? 'bg-blue-100 text-blue-600' 
    : 'bg-green-100 text-green-600';

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`rounded-lg p-3 ${colors}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{count}</p>
        </div>
      </div>
    </div>
  );
}