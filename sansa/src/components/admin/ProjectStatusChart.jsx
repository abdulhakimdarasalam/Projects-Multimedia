// src/components/admin/ProjectStatusChart.jsx
"use client";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Plugin kustom untuk menampilkan teks di tengah Donut Chart
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart) => {
    const { ctx, width, height } = chart;
    ctx.restore();
    const fontSize = (height / 114).toFixed(2);
    ctx.font = `bold ${fontSize}em sans-serif`;
    ctx.textBaseline = 'middle';
    const text = '100'; // Total project
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillStyle = '#1F2937';
    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

export default function ProjectStatusChart() {
  const data = {
    labels: ['Completed', 'In Progress', 'Pending', 'Canceled'],
    datasets: [
      {
        label: 'Projects',
        data: [45, 30, 15, 10], // Data dalam persen
        backgroundColor: ['#60A5FA', '#FBBF24', '#F87171', '#9CA3AF'],
        borderColor: '#FFFFFF',
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // Membuatnya menjadi donut chart
    plugins: {
      legend: {
        display: false, // Kita akan buat legend sendiri
      },
    },
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800">Project Status Overview</h3>
      <div className="relative flex-grow my-4">
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {data.labels.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}></span>
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}