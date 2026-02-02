"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BaseProjectCard from "@/components/baseproject/BaseProjectCard";
import ActiveProjectCard from "@/components/myproject/MyProjectCard";

const API_BASE_URL = "http://localhost:4000";

export default function UserBaseProjectClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [allProjects, setAllProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [isLoadingMine, setIsLoadingMine] = useState(true);
  const [errorAll, setErrorAll] = useState(null);
  const [errorMine, setErrorMine] = useState(null);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  const fetchAllProjects = async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorAll("Otentikasi gagal. Silakan login kembali.");
      setIsLoadingAll(false);
      return;
    }

    try {
      setIsLoadingAll(true);
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const projectsData = response.data.data || response.data;
      setAllProjects(Array.isArray(projectsData) ? projectsData : []);
      setErrorAll(null);
    } catch (err) {
      console.error("Gagal fetch 'Semua Project':", err);
      setErrorAll("Gagal memuat data project.");
    } finally {
      setIsLoadingAll(false);
    }
  };

  const fetchMyProjects = async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorMine("Otentikasi gagal. Silakan login kembali.");
      setIsLoadingMine(false);
      return;
    }

    try {
      setIsLoadingMine(true);

      const response = await axios.get(
        `${API_BASE_URL}/project-registrations/my`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!response.data) {
        setMyProjects([]);
        setErrorMine(null);
        setIsLoadingMine(false);
        return;
      }

      const rawData = response.data.data || response.data;

      if (!Array.isArray(rawData)) {
        setMyProjects([]);
        setErrorMine(null);
        return;
      }

      const validRegistrations = rawData.filter(
        (registration) => registration && registration.Project,
      );

      const formattedProjects = validRegistrations.map((registration) => ({
        id: registration.Project.id,
        title: registration.Project.title,
        category: registration.Project.category || "N/A",
        status: registration.status,
        date: registration.Project.start_date || registration.Project.createdAt,
      }));

      setMyProjects(formattedProjects);
      setErrorMine(null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMyProjects([]);
        setErrorMine(null);
      } else {
        console.error("Gagal fetch 'Project Saya':", err);
        setErrorMine("Gagal memuat data project saya.");
      }
    } finally {
      setIsLoadingMine(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
    fetchMyProjects();
  }, []);

  const handleJoinProject = async (projectId) => {
    const token = getAuthToken();
    if (!token) {
      alert("Sesi berakhir. Silakan login lagi.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/project-registrations/`,
        { project_id: projectId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Permintaan bergabung telah dikirim! Menunggu persetujuan admin.");
      fetchMyProjects();
      setActiveTab("mine");
    } catch (err) {
      console.error(`Gagal join project ${projectId}:`, err);
      const message =
        err.response?.data?.message || "Gagal mengirim permintaan bergabung.";
      alert(`Gagal: ${message}`);
    }
  };

  const renderAllProjects = () => {
    if (isLoadingAll) return <p className="text-gray-500">Memuat project...</p>;
    if (errorAll) return <p className="text-red-600">{errorAll}</p>;
    if (allProjects.length === 0)
      return (
        <p className="text-gray-500">
          Tidak ada project yang tersedia saat ini.
        </p>
      );

    const myIds = myProjects.map((p) => p.id);
    const filtered = allProjects.filter((p) => !myIds.includes(p.id));

    if (filtered.length === 0) {
      return (
        <p className="text-gray-500">
          Tidak ada project yang tersedia saat ini.
        </p>
      );
    }

    return (
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <BaseProjectCard
            key={project.id}
            project={project}
            onJoin={handleJoinProject}
          />
        ))}
      </div>
    );
  };

  const renderMyProjects = () => {
    if (isLoadingMine)
      return <p className="text-gray-500">Memuat project saya...</p>;
    if (errorMine) return <p className="text-red-600">{errorMine}</p>;
    if (myProjects.length === 0)
      return (
        <p className="text-gray-500">
          Kamu belum bergabung di project manapun.
        </p>
      );

    return (
      <div className="mt-8 space-y-4">
        {myProjects.map((project) => (
          <ActiveProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-gray-200 text-gray-800"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Semua Project
        </button>
        <button
          onClick={() => setActiveTab("mine")}
          className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
            activeTab === "mine"
              ? "bg-gray-200 text-gray-800"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Project Saya
        </button>
      </div>

      {/* Konten Dinamis Berdasarkan Tab */}
      <div className="mt-8">
        {activeTab === "all" ? (
          <>
            <header>
              <h1 className="text-3xl font-bold text-gray-800">List Project</h1>
            </header>
            {renderAllProjects()}
          </>
        ) : (
          <>
            <header>
              <h1 className="text-3xl font-bold text-gray-800">
                Project Aktif Saya
              </h1>
              <p className="mt-1 text-gray-500">
                Keep track biar progress-mu makin lancar!
              </p>
            </header>
            {renderMyProjects()}
          </>
        )}
      </div>
    </div>
  );
}
