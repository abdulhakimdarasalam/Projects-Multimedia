// src/components/ui/Button.jsx

import React from "react";

const baseStyles =
  "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

const variantStyles = {
  primary:
    "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-md",
  secondary:
    "text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 focus:ring-gray-300",
  // Khusus untuk tombol Upload di URL, yang agak transparan biru
  subtle: "text-blue-600 bg-blue-50 hover:bg-blue-100 focus:ring-blue-500",
};

/**
 * Komponen Button dasar
 * @param {string} variant - 'primary' (biru), 'secondary' (putih/border), 'subtle' (biru muda)
 */
export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const styles = variantStyles[variant] || variantStyles.primary;

  return (
    <button className={`${baseStyles} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
