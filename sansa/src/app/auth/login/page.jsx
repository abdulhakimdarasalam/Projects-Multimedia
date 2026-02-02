import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F4F8]">
      <div className="relative flex w-full max-w-4xl flex-row overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="w-full p-8 sm:w-1/2 md:p-12">
          <h1 className="text-3xl font-bold text-[#5E7FAA]">
            Welcome Back #Stark
          </h1>
          <p className="mt-2 text-base text-gray-600">Log In To Your Account</p>

          <LoginForm />

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="font-semibold leading-6 text-[#6080A4] hover:text-[#526d8c]"
            >
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
