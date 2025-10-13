// src/app/user/profile/page.jsx
import Image from 'next/image';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineUser, 
  HiOutlineOfficeBuilding,
  HiOutlineTrash,
  HiCheckCircle,
  HiBadgeCheck,
  HiOutlineChevronDown
} from 'react-icons/hi';

// Data tiruan untuk profil pengguna
const userProfile = {
  avatarUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
  shortName: "Beneben",
  fullName: "Benedicto geraldo",
  email: "geral20@gmail.com",
  isEmailVerified: true,
  phone: "62816270192823",
  major: "Sistem Informasi",
};

export default function ProfilePage() {
  return (
    <div>
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="mt-1 text-gray-500">Semua info profilmu tersedia di sini</p>
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
            <HiBadgeCheck className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-white bg-blue-500 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{userProfile.shortName}</h2>
            <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
              <span>{userProfile.email}</span>
              {userProfile.isEmailVerified && <HiCheckCircle className="h-5 w-5 text-blue-500" />}
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700">
            <HiOutlineTrash className="h-4 w-4" />
            <span>Hapus akun</span>
          </button>
        </div>
      </div>

      {/* Form Detail Profil */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800">Detail Profil</h3>
        <form className="mt-6 space-y-6">
          {/* Nama Lengkap */}
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Nama lengkap</label>
            <div className="relative mt-1">
              <HiOutlineUser className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input type="text" id="full-name" defaultValue={userProfile.fullName} className="w-full rounded-md border-gray-300 p-3 pl-10 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <HiOutlineMail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input type="email" id="email" defaultValue={userProfile.email} readOnly className="w-full rounded-md border-gray-300 bg-gray-100 p-3 pl-10 pr-10 shadow-sm focus:outline-none" />
              {userProfile.isEmailVerified && <HiCheckCircle className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />}
            </div>
          </div>

          {/* Nomor Telepon */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
            <div className="relative mt-1">
              <HiOutlinePhone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input type="tel" id="phone" defaultValue={userProfile.phone} className="w-full rounded-md border-gray-300 p-3 pl-10 shadow-sm focus:border-sky-500 focus:ring-sky-500" />
            </div>
          </div>

          {/* Jurusan */}
           <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700">Jurusan</label>
            <div className="relative mt-1">
              <HiOutlineOfficeBuilding className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select id="major" name="major" defaultValue={userProfile.major} className="w-full appearance-none rounded-md border border-gray-300 p-3 pl-10 pr-10 focus:border-sky-500 focus:ring-sky-500">
                <option>Sistem Informasi</option>
                <option>Teknik Informatika</option>
                <option>Desain Komunikasi Visual</option>
              </select>
              <HiOutlineChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"/>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-4 border-t pt-6">
            <button type="button" className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
              Batal
            </button>
            <button type="submit" className="rounded-lg bg-[#6080A4] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#526d8c]">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}