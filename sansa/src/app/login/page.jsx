// src/app/login/page.jsx
"use client"; // Kita butuh interaktivitas untuk show/hide password nanti

import { useState } from 'react';
import Image from 'next/image';
// Impor ikon yang akan kita gunakan
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F4F8]">
      <div className="relative flex w-full max-w-4xl flex-row overflow-hidden rounded-xl bg-white shadow-lg">
        
        <div className="w-full p-8 sm:w-1/2 md:p-12">
          <h1 className="text-3xl font-bold text-[#5E7FAA]">Welcome Back #Stark</h1>
          <p className="mt-2 text-base text-gray-600">Log In To Your Account</p>

          <form className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              </label>
              <div className="relative mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email here"
                  className="w-full rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <HiOutlineMail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password here"
                  className="w-full rounded-md border border-gray-300 p-3 pl-4 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {passwordVisible ? <HiOutlineEyeOff className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#6080A4] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#526d8c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="font-semibold leading-6 text-[#6080A4] hover:text-[#526d8c]">
              Register Now
            </a>
          </p>
        </div>

        <div className="relative hidden w-1/2 items-center justify-center bg-[#F0F4F8] sm:flex">
          <Image 
            src="/hello-icon.svg" 
            alt="Woman waving from a window"
            width={400}
            height={400}
            className="object-contain"
            priority
          />
        </div>

      </div>
    </div>
  );
}