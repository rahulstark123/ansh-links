import type { Metadata } from "next";
import LoginForm from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Login | Ansh Links",
  description: "Login to your Ansh Links account.",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none absolute left-[-80px] top-24 h-80 w-80 rounded-full bg-[#8f57ff]/16 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-90px] top-1/3 h-80 w-80 rounded-full bg-[#22deff]/16 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#27d9ff]/10 blur-[120px]" />

      <section className="mx-auto flex min-h-screen w-full max-w-[1280px] items-center justify-center px-6 py-14 sm:px-10 lg:px-14">
        <LoginForm />
      </section>
    </main>
  );
}
