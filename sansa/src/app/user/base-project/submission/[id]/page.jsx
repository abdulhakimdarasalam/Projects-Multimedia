// src/components/submission/AddSubmissionForm.jsx

"use client";

import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Base URL Express Anda
const API_BASE_URL = "http://localhost:4000";

export default function AddSubmissionForm({ projectId }) {
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // Fungsi untuk menangani pengiriman URL
  const handleSubmitUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsUploading(true);
    setUploadMessage("");

    try {
      const payload = {
        projectId: projectId, // ID Proyek dari props
        submissionType: "url",
        url: urlInput,
        // Tambahkan field lain yang dibutuhkan backend Anda (misalnya: userId)
      };

      const res = await fetch(`${API_BASE_URL}/submissions`, {
        // POST ke /submissions
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setUploadMessage("Submission URL berhasil dikirim!");
        setUrlInput(""); // Kosongkan input setelah berhasil
      } else {
        const errorData = await res.json();
        setUploadMessage(
          `Gagal mengirim submission: ${errorData.message || res.statusText}`
        );
      }
    } catch (error) {
      setUploadMessage("Terjadi kesalahan koneksi saat mengirim submission.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Note: Logika untuk Drag & Drop File Upload akan jauh lebih kompleks
  // (memerlukan penggunaan FormData dan Express Middleware seperti Multer).
  // Untuk saat ini, kita fokus pada fungsionalitas URL.

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        Add new submission for Project ID: {projectId}
      </h3>

      {/* ... Area Drag and Drop (TIDAK ADA FUNGSI ASLI SEMENTARA) ... */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center mb-6">
        <FiUploadCloud className="mx-auto h-12 w-12 text-blue-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop or{" "}
          <span className="font-semibold text-blue-600">Choose files</span> to
          upload
        </p>
        <button
          className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          disabled={isUploading}
        >
          Select files
        </button>
      </div>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Input URL dengan Event Handler */}
      <form
        onSubmit={handleSubmitUrl}
        className="flex items-center text-black gap-3"
      >
        <Input
          type="text"
          placeholder="add text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          disabled={isUploading}
        />
        <Button variant="subtle" type="submit" disabled={isUploading}>
          {isUploading ? "Mengunggah..." : "Upload"}
        </Button>
      </form>

      {/* Pesan Status */}
      {uploadMessage && (
        <p
          className={`mt-4 text-sm ${
            uploadMessage.includes("Gagal") ||
            uploadMessage.includes("kesalahan")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {uploadMessage}
        </p>
      )}

      {/* Tombol Aksi Bawah */}
      <div className="flex justify-end mt-8 gap-3">
        <Button
          variant="secondary"
          onClick={() => setUrlInput("")}
          disabled={isUploading}
        >
          Discard
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="urlForm"
          disabled={isUploading}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
