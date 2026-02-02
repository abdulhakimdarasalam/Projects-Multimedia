"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineChevronDown,
} from "react-icons/hi";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Password dan Konfirmasi Password tidak cocok.";
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (!formData.role || formData.role === "") {
      const errorMsg = "Silakan pilih Role Anda.";
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    const API_BASE_URL = "http://localhost:4000";

    try {
      const bodyToSubmit = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        password: formData.password,
        role: formData.role,
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyToSubmit),
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          errorData = await response.json();
          throw new Error(errorData.message || "Terjadi kesalahan.");
        } else {
          const errorText = await response.text();
          console.error("Backend Error (HTML/Text):", errorText);
          throw new Error(
            `Server error (${response.status}). Cek console atau log backend.`,
          );
        }
      }

      const data = await response.json();
      alert("Registrasi berhasil! Anda akan diarahkan ke halaman login.");
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-md border border-gray-300 p-3 pl-4 focus:border-indigo-500 focus:ring-indigo-500";
  const inputWithTextStyle = `${inputStyle} text-gray-900`;
  const inputWithIconStyle = `${inputWithTextStyle} pr-10`;

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Enter your full name here"
            className={`mt-1 ${inputWithTextStyle}`}
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email here"
              className={inputWithIconStyle}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <HiOutlineMail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="sm:col-span-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <div className="relative mt-1">
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Enter your phone number here"
              className={inputWithIconStyle}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <HiOutlinePhone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Date of birth */}
        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-gray-700"
          >
            Date of birth
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              name="dob"
              id="dob"
              placeholder="MM/YY/DD"
              className={inputWithIconStyle}
              value={formData.dob}
              onChange={handleChange}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = "text";
                }
              }}
              required
            />
            <HiOutlineCalendar className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <div className="relative mt-1">
            <select
              id="gender"
              name="gender"
              className={`appearance-none ${inputWithIconStyle} ${
                formData.gender === "" ? "text-gray-400" : "text-gray-900"
              }`}
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option disabled value="">
                ---Select your gender---
              </option>
              <option value="Male" className="text-gray-900">
                Male
              </option>
              <option value="Female" className="text-gray-900">
                Female
              </option>
            </select>
            <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter your password"
              className={inputWithIconStyle}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              className={inputWithIconStyle}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="sm:col-span-2">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Register as
          </label>
          <div className="relative mt-1">
            <select
              id="role"
              name="role"
              className={`appearance-none ${inputWithIconStyle} ${
                formData.role === "" ? "text-gray-400" : "text-gray-900"
              }`}
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option disabled value="">
                ---Select your role---
              </option>
              <option value="admin" className="text-gray-900">
                Admin
              </option>
              <option value="member" className="text-gray-900">
                Member
              </option>
            </select>
            <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="sm:col-span-2 rounded-md border border-red-300 bg-red-50 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="sm:col-span-2 mt-4 flex items-center gap-4">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={() => router.push("/auth/login")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[#6080A4] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#526d8c] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Confirm"}
          </button>
        </div>
      </div>
    </form>
  );
}
