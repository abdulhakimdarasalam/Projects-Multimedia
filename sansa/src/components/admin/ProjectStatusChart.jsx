"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const statusConfig = {
  completed: { label: "Completed", color: "#60A5FA" },
  ongoing: { label: "In Progress", color: "#FBBF24" },
  pending: { label: "Pending", color: "#F87171" },
};

export default function ProjectStatusChart({ data: apiData = [] }) {
  // 1. Olah data dari API
  const labels = apiData.map(
    (item) => statusConfig[item.status]?.label || item.status
  );
  const counts = apiData.map((item) => item.count);
  const backgroundColors = apiData.map(
    (item) => statusConfig[item.status]?.color || "#CCCCCC"
  );

  // 2. Hitung total project untuk ditampilkan di tengah
  const totalProjects = counts.reduce((sum, count) => sum + count, 0);

  // 3. Siapkan data untuk Chart.js
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Projects",
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: "#FFFFFF",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%", // Membuatnya menjadi donut chart
    plugins: {
      legend: {
        display: false, // Kita buat legend sendiri
      },
    },
  };

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.restore();
      const fontSize = (height / 114).toFixed(2);
      ctx.font = `bold ${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";

      const text = totalProjects.toString();

      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillStyle = "#1F2937";
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800">
        Project Status Overview
      </h3>
      <div className="relative flex-grow my-4">
        {/* Gunakan data dinamis */}
        <Doughnut
          data={chartData}
          options={options}
          plugins={[centerTextPlugin]}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {chartData.labels.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: chartData.datasets[0].backgroundColor[index],
              }}
            ></span>
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
