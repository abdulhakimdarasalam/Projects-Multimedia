// src/app/user/base-project/page.jsx
"use client";

import { useState, useEffect } from "react";
import { HiChevronRight } from "react-icons/hi";
import axios from "axios"; // <-- Impor axios

// Impor komponen
import BaseProjectCard from "@/components/baseproject/BaseProjectCard";
import ActiveProjectCard from "@/components/myproject/MyProjectCard";

// Tentukan Base URL API kamu
const API_BASE_URL = "http://localhost:4000";

export default function BaseProjectPage() {
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'mine'

  // State untuk data dinamis
  const [allProjects, setAllProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);

  // State untuk loading dan error
  // Kita buat terpisah agar tiap tab punya state loading-nya sendiri
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

  // 1. useEffect untuk mengambil data kedua tab saat komponen dimuat
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setErrorAll("Otentikasi gagal. Silakan login kembali.");
      setErrorMine("Otentikasi gagal. Silakan login kembali.");
      setIsLoadingAll(false);
      setIsLoadingMine(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // --- Fetch "Semua Project" ---
    const fetchAllProjects = async () => {
      try {
        setIsLoadingAll(true);
        // ASUMSI: Endpoint adalah '/projects'
        const response = await axios.get(`${API_BASE_URL}/projects`, {
          headers,
        });

        console.log("Data 'Semua Project' mentah:", response.data);
        // Sesuaikan .data.data jika perlu, seperti kemarin
        setAllProjects(response.data.data || response.data);
        setErrorAll(null);
      } catch (err) {
        console.error("Gagal fetch 'Semua Project':", err);
        setErrorAll("Gagal memuat data project.");
      } finally {
        setIsLoadingAll(false);
      }
    };

    // --- Fetch "Project Saya" ---
    const fetchMyProjects = async () => {
      try {
        setIsLoadingMine(true);
        // ASUMSI: Endpoint adalah '/my-projects'
        const response = await axios.get(`${API_BASE_URL}/my-projects`, {
          headers,
        });

        console.log("Data 'Project Saya' mentah:", response.data);
        // Sesuaikan .data.data jika perlu
        setMyProjects(response.data.data || response.data);
        setErrorMine(null);
      } catch (err) {
        console.error("Gagal fetch 'Project Saya':", err);
        setErrorMine("Gagal memuat data project saya.");
      } finally {
        setIsLoadingMine(false);
      }
    };

    // Panggil kedua fungsi
    fetchAllProjects();
    fetchMyProjects();
  }, []); // [] = Dijalankan sekali saat mount

  // 2. Fungsi untuk 'Join Project' (dari screenshot kamu)
  const handleJoinProject = async (projectId) => {
    const token = getAuthToken();
    if (!token) {
      alert("Sesi berakhir. Silakan login lagi.");
      return;
    }

    try {
      // Panggil API POST untuk registrasi project
      await axios.post(
        `${API_BASE_URL}/project-registrations/`,
        { project_id: projectId }, // Body payload
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Beri feedback ke user
      alert("Permintaan bergabung telah dikirim! Menunggu persetujuan admin.");

      // Opsional: Kamu bisa update UI di sini,
      // misal: disable tombol 'join' untuk project yg baru didaftar
    } catch (err) {
      console.error(`Gagal join project ${projectId}:`, err);
      // Tangani error, misal jika user sudah pernah daftar
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Gagal: ${err.response.data.message}`);
      } else {
        alert("Gagal mengirim permintaan bergabung.");
      }
    }
  };

  // --- Helper untuk render konten tab ---
  const renderAllProjects = () => {
    if (isLoadingAll) return <p className="text-gray-500">Memuat project...</p>;
    if (errorAll) return <p className="text-red-600">{errorAll}</p>;
    if (allProjects.length === 0)
      return (
        <p className="text-gray-500">
          Tidak ada project yang tersedia saat ini.
        </p>
      );

    return (
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {allProjects.map((project) => (
          <BaseProjectCard
            key={project.id}
            project={project}
            onJoin={handleJoinProject} // <-- 3. Kirim fungsi 'join' ke Card
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
      {/* Tabs (Tidak berubah) */}
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
          // === TAMPILAN SEMUA PROJECT (GRID) ===
          <>
            <header>
              <h1 className="text-3xl font-bold text-gray-800">List Project</h1>
            </header>
            {renderAllProjects()}
          </>
        ) : (
          // === TAMPILAN PROJECT SAYA (LIST BARU) ===
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
