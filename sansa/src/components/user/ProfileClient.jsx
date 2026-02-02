"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiCheckCircle,
  HiBadgeCheck,
  HiOutlineChevronDown,
} from "react-icons/hi";

const API_BASE_URL = "http://localhost:4000";

const initialFormState = {
  name: "",
  email: "",
  isEmailVerified: false,
  phone: "",
  major: "Sistem Informasi",
};

export default function ProfileClient() {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Otentikasi gagal. Silakan login kembali.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const profileData = response.data.data || response.data;

        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          isEmailVerified: profileData.isEmailVerified || false,
          phone: profileData.phone || "",
          major: profileData.major || "Sistem Informasi",
        });
        setError(null);
      } catch (err) {
        console.error("Gagal fetch profil:", err);
        setError("Gagal memuat data profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      alert("Sesi berakhir. Silakan login lagi.");
      return;
    }

    try {
      setIsSaving(true);
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        major: formData.major,
      };

      await axios.put(`${API_BASE_URL}/api/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal update profil:", err);
      alert("Gagal menyimpan perubahan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-600">Loading profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-red-300 bg-red-50 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="mt-1 text-gray-500">
          Semua info profilmu tersedia di sini
        </p>
      </header>

      {/* Kartu Ringkasan Profil */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative">
            <Image
              src="/avatar-icon.svg"
              alt="User Avatar"
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
            {formData.isEmailVerified && (
              <HiBadgeCheck className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-blue-500 text-white" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {formData.name ? formData.name.split(" ")[0] : "..."}
            </h2>
            <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
              <span>{formData.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Detail Profil */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800">Detail Profil</h3>
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="full-name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama lengkap
            </label>
            <div className="relative mt-1">
              <HiOutlineUser className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="full-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full text-black rounded-md border-gray-300 p-3 pl-10 shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative mt-1">
              <HiOutlineMail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full text-black rounded-md border-gray-300 bg-gray-100 p-3 pl-10 pr-10 shadow-sm focus:outline-none"
              />
              {formData.isEmailVerified && (
                <HiCheckCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Telepon
            </label>
            <div className="relative mt-1">
              <HiOutlinePhone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-black rounded-md border-gray-300 p-3 pl-10 shadow-sm focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="major"
              className="block text-sm font-medium text-gray-700"
            >
              Jurusan
            </label>
            <div className="relative mt-1">
              <HiOutlineOfficeBuilding className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full text-black appearance-none rounded-md border border-gray-300 p-3 pl-10 pr-10 focus:border-sky-500 focus:ring-sky-500"
              >
                <option>Sistem Informasi</option>
                <option>Teknik Informatika</option>
                <option>Desain Komunikasi Visual</option>
              </select>
              <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 border-t pt-6">
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-[#6080A4] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#526d8c] disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
