"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ProjectForm from "@/components/admin/ProjectForm";

export default function EditProjectClient() {
  const params = useParams();
  const projectId = params?.projectId || null;

  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized");

        const res = await axios.get(`http://localhost:4000/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allPayload = res.data?.data ?? res.data;
        const all = Array.isArray(allPayload) ? allPayload : [];
        const p = all.find((x) => String(x.id) === String(projectId));
        if (!p) {
          setError("Project tidak ditemukan.");
          setIsLoading(false);
          return;
        }

        const formattedData = {
          title: p.title || "",
          description: p.description || "",
          start_date: p.start_date ? p.start_date.split("T")[0] : "",
          end_date: p.end_date ? p.end_date.split("T")[0] : "",
          status: p.status,
        };

        setProjectData(formattedData);
      } catch (err) {
        console.error("Gagal memuat project:", err);
        if (err.response && err.response.status === 401) {
          setError("Sesi Anda habis. Silakan login kembali.");
        } else {
          setError("Gagal memuat data project.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return <div className="p-10 text-center">Memuat project...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">Error: {error}</div>;
  }

  return <ProjectForm initialData={projectData} projectId={projectId} />;
}
