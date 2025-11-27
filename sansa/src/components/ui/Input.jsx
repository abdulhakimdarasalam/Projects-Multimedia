// src/components/ui/Input.jsx

import React from "react";

/**
 * Komponen Input dasar
 */
export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 ${className}`}
      {...props}
    />
  );
}
