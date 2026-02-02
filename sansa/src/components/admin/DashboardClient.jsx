"use client";

import { useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectStatusChart from "@/components/admin/ProjectStatusChart";
import StatsCards from "@/components/admin/StatsCards";
import ProjectListTable from "@/components/admin/ProjectListTable";
import { useAdminDashboardStore } from "@/app/store/adminDashboardStore";

export default function DashboardClient() {
  const { data, isLoading, error, fetchDashboardData } =
    useAdminDashboardStore();
  const { summary, projectStatusChart, projectList } = data;

  useEffect(() => {
    fetchDashboardData(1);
  }, [fetchDashboardData]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > projectList.pagination.totalPages) {
      return;
    }
    fetchDashboardData(newPage);
  };

  if (isLoading && !projectList.projects.length) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <AdminHeader />
        <div className="rounded-xl border bg-white p-6 shadow-sm text-red-500">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader />

      <StatsCards summary={summary} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ProjectListTable
          projectList={projectList}
          onPageChange={handlePageChange}
        />

        <div className="lg:col-span-1">
          <ProjectStatusChart data={projectStatusChart} />
        </div>
      </div>
    </div>
  );
}
