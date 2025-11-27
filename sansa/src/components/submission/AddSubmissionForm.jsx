// src/components/submission/AddSubmissionForm.jsx
"use client";

import React from "react";
import { FiUploadCloud } from "react-icons/fi";
// Import komponen UI. Asumsi path-nya sama:
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AddSubmissionForm() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Add new submission</h3>
        {/* Ikon Tutup/Silang */}
        <button
          onClick={() => console.log("Close Form")}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Tutup form"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      {/* Area Drag and Drop */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center mb-6">
        <FiUploadCloud className="mx-auto h-12 w-12 text-blue-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop or{" "}
          <span className="font-semibold text-blue-600">Choose files</span> to
          upload
        </p>
        <button className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Select files
        </button>
      </div>

      {/* Divider OR */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Input URL */}
      <div className="flex items-center gap-3">
        <Input type="url" placeholder="add file URL" />
        {/* Tombol Upload (untuk URL) menggunakan variant 'subtle' */}
        <Button variant="subtle">Upload</Button>
      </div>

      {/* Tombol Aksi di Bawah */}
      <div className="flex justify-end mt-8 gap-3">
        <Button variant="secondary">Discard</Button>
        <Button variant="primary">Upload</Button>
      </div>
    </div>
  );
}
