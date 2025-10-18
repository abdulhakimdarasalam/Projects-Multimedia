"use client";

import { useState } from 'react';
import { 
  HiOutlineMail, 
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineEye, 
  HiOutlineEyeOff,
  HiOutlineChevronDown
} from 'react-icons/hi';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Satu state untuk menampung semua data form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  // 2. Satu fungsi untuk menangani perubahan di semua input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // 3. Fungsi untuk menangani saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah halaman refresh
    // Di sini Anda akan mengirim data ke backend
    console.log("Form Data Submitted:", formData); 
    alert("Check the console to see the form data!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F4F8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl space-y-8 rounded-xl bg-white p-10 shadow-lg">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#334155]">Register</h1>
          <p className="mt-2 text-base text-gray-600">Enter your details to create your account</p>
        </div>

        {/* Form */}
        {/* Menambahkan onSubmit pada form */}
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                id="fullName" 
                placeholder="Enter your full name here" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="Enter your email here" 
                  className="w-full rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.email}
                  onChange={handleChange}
                />
                <HiOutlineMail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative mt-1">
                <input 
                  type="tel" 
                  name="phone" 
                  id="phone" 
                  placeholder="Enter your phone number here" 
                  className="w-full rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <HiOutlinePhone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of birth</label>
              <div className="relative mt-1">
                <input 
                  type="date" 
                  name="dob" 
                  id="dob" 
                  className="w-full rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="relative mt-1">
                <select 
                  id="gender" 
                  name="gender" 
                  className="w-full appearance-none rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option disabled value="">---Select your gender---</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"/>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  id="password" 
                  placeholder="Enter your password" 
                  className="w-full rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <HiOutlineEyeOff/> : <HiOutlineEye/>}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative mt-1">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword" 
                  id="confirmPassword" 
                  placeholder="Confirm your password" 
                  className="w-full rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showConfirmPassword ? <HiOutlineEyeOff/> : <HiOutlineEye/>}
                </button>
              </div>
            </div>
            
            {/* Register As */}
            <div className="sm:col-span-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Register as</label>
              <div className="relative mt-1">
                <select 
                  id="role" 
                  name="role" 
                  className="w-full appearance-none rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option disabled value="">---Select your role---</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Client">Client</option>
                </select>
                <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"/>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sm:col-span-2 mt-4 flex items-center gap-4">
              <button type="button" className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="flex-1 rounded-lg bg-[#6080A4] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#526d8c]">
                Confirm
              </button>
            </div>
          </div>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have account?{' '}
          <a href="/auth/login" className="font-semibold leading-6 text-[#6080A4] hover:text-[#526d8c]">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}