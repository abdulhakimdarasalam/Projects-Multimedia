"use client";

import { useParams } from "next/navigation";
import TaskForm from "@/components/admin/TaskForm";

export default function AddTaskPage() {
  const { projectId } = useParams();

  return <TaskForm projectId={projectId} />;
}
