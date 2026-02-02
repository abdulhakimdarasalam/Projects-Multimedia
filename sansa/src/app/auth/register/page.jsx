import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F4F8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-[#334155]">Register</h1>
          <p className="mt-2 text-base text-gray-600">
            Enter your email and password to access your account
          </p>
        </div>

        <RegisterForm />
        <RegisterForm />

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have account?{" "}
          <a
            href="/auth/login"
            className="font-semibold leading-6 text-[#6080A4] hover:text-[#526d8c]"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
