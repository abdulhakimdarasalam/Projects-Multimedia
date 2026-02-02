"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import TaskForm from "@/components/admin/TaskForm";

export default function EditTaskClient() {
  const { projectId, taskId } = useParams();

  const [taskData, setTaskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!projectId || !taskId) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Unauthorized");

        const res = await axios.get(
          `http://localhost:4000/tasks/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const all = res.data || [];
        const t = all.find((x) => String(x.id) === String(taskId));
        if (!t) {
          setError("Task tidak ditemukan.");
          return;
        }

        const formattedData = {
          name: t.name || "",
          description: t.description || "",
          start_date: t.start_date ? t.start_date.split("T")[0] : "",
          deadline: t.deadline ? t.deadline.split("T")[0] : "",
          value_weight: t.value_weight ?? 0,
        };

        setTaskData(formattedData);
      } catch (err) {
        console.error("Gagal memuat task:", err);
        setError("Gagal memuat data task.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [projectId, taskId]);

  if (isLoading) {
    return <div className="p-10 text-center">Memuat task...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <TaskForm initialData={taskData} taskId={taskId} projectId={projectId} />
  );
}
