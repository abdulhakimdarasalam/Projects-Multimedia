"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Impor komponen
import BaseProjectCard from "@/components/baseproject/BaseProjectCard";
import ActiveProjectCard from "@/components/myproject/MyProjectCard"; // Pastikan path ini benar

// Tentukan Base URL API kamu
const API_BASE_URL = "http://localhost:4000";

export default function BaseProjectPage() {
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'mine'

  // State untuk data dinamis
  const [allProjects, setAllProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);

  // State untuk loading dan error
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [isLoadingMine, setIsLoadingMine] = useState(true);
  const [errorAll, setErrorAll] = useState(null);
  const [errorMine, setErrorMine] = useState(null);

  // Fungsi untuk mengambil token (asumsi disimpan di localStorage)
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
    const headers = { Authorization: `Bearer ${token}` };

    try {
      setIsLoadingAll(true);
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        headers,
      });

      console.log("Data 'Semua Project' mentah:", response.data);
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

  // --- Fetch "Project Saya" (DENGAN PERBAIKAN) ---
  const fetchMyProjects = async () => {
    const token = getAuthToken();
    if (!token) {
      setErrorMine("Otentikasi gagal. Silakan login kembali.");
      setIsLoadingMine(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      setIsLoadingMine(true);

      const response = await axios.get(
        `${API_BASE_URL}/project-registrations/my`,
        { headers }
      );

      // Menangani jika backend mengembalikan body kosong (bukan JSON array)
      if (!response.data) {
        console.warn(
          "API 'Project Saya' mengembalikan body kosong, dianggap array kosong."
        );
        setMyProjects([]); // Langsung set array kosong
        setErrorMine(null);
        setIsLoadingMine(false);
        return; // Hentikan eksekusi fungsi
      }

      console.log("Data 'Project Saya' mentah:", response.data);
      const rawData = response.data.data || response.data;

      if (!Array.isArray(rawData)) {
        console.warn("'Project Saya' - data bukan array:", rawData);
        setMyProjects([]);
        setErrorMine(null);
        return;
      }

      // --- PERBAIKAN 1: FILTER DATA (Menggunakan .Project) ---
      const validRegistrations = rawData.filter(
        (registration) => registration && registration.Project // <-- UBAHAN DI SINI
      );

      if (validRegistrations.length === 0 && rawData.length > 0) {
        console.warn(
          "Data 'Project Saya' ada, tapi tidak ada 'Project' (P besar) yang ter-join." // <-- UBAHAN DI SINI
        );
      }

      // --- PENYESUAIAN DATA (Menggunakan .Project) ---
      const formattedProjects = validRegistrations.map((registration) => ({
        id: registration.Project.id, // <-- UBAHAN DI SINI
        // PERBAIKAN 2: Sesuaikan nama field
        title: registration.Project.title, // <-- UBAHAN DI SINI
        category: registration.Project.category || "N/A", // <-- UBAHAN DI SINI
        status: registration.status,
        // PERBAIKAN 2: Ambil 'start_date'
        date: registration.Project.start_date || registration.Project.createdAt, // <-- UBAHAN DI SINI
      }));

      console.log("Data 'Project Saya' terformat:", formattedProjects);
      setMyProjects(formattedProjects);
      setErrorMine(null);
    } catch (err) {
      // Jika backend mengembalikan 404 (mis. user belum punya project),
      // anggap sebagai "tidak ada project" — jangan tampilkan error.
      if (err.response && err.response.status === 404) {
        console.warn(
          "API 'Project Saya' mengembalikan 404 — anggap user belum punya project."
        );
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

  // 1. useEffect (Tidak Berubah)
  useEffect(() => {
    fetchAllProjects();
    fetchMyProjects();
  }, []); // [] = Dijalankan sekali saat mount

  // 2. Fungsi untuk 'Join Project' (Tidak Berubah)
  const handleJoinProject = async (projectId) => {
    const token = getAuthToken();
    if (!token) {
      alert("Sesi berakhir. Silakan login lagi.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/project-registrations/`,
        { project_id: projectId }, // Body payload
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Permintaan bergabung telah dikirim! Menunggu persetujuan admin.");

      // Panggil fetchMyProjects lagi untuk refresh data
      fetchMyProjects();

      // Opsional: Pindahkan user ke tab "Project Saya"
      setActiveTab("mine");
    } catch (err) {
      console.error(`Gagal join project ${projectId}:`, err);
      const message =
        err.response?.data?.message || "Gagal mengirim permintaan bergabung.";
      alert(`Gagal: ${message}`);
    }
  };

  // --- Helper untuk render konten tab (Tidak Berubah) ---
  const renderAllProjects = () => {
    if (isLoadingAll) return <p className="text-gray-500">Memuat project...</p>;
    if (errorAll) return <p className="text-red-600">{errorAll}</p>;
    if (allProjects.length === 0)
      return (
        <p className="text-gray-500">
          Tidak ada project yang tersedia saat ini.
        </p>
      );

    // Filter out projects that already appear in 'myProjects'
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

  // --- Helper untuk render konten tab (Tidak Berubah) ---
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

  // --- JSX (Tidak Berubah) ---
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
