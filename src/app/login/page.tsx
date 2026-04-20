import type { Metadata } from "next";
import Link from "next/link";
import GoogleAuthButton from "@/components/auth/google-auth-button";

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
        <article className="w-full max-w-[560px] rounded-[2rem] border border-white/12 bg-gradient-to-b from-[#1f2029] to-[#14161d] p-8 shadow-[0_30px_75px_rgba(7,11,23,0.8)] sm:p-10">
          <h1 className="font-display text-center text-[3.2rem] font-bold leading-none">Welcome Back</h1>
          <p className="mt-3 text-center text-[1.15rem] text-white/62">
            Access your <span className="font-bold text-[#22deff]">ANSH Links</span> ecosystem.
          </p>

          <GoogleAuthButton
            nextPath="/home"
            label="Login with Google"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-md border border-cyan-300/30 bg-[#14222a]/60 py-3.5 font-semibold text-white/88 transition hover:border-cyan-300/50 hover:bg-[#172a35]"
          />

          <div className="my-6 flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/40">
            <div className="h-px flex-1 bg-white/12" />
            Continue With Email
            <div className="h-px flex-1 bg-white/12" />
          </div>

          <form className="space-y-6">
            <label className="block">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Username or Email</span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-[#10121a] px-4 py-3.5 text-white outline-none transition focus:border-[#22deff]/50"
                placeholder="Enter your credentials"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Password</span>
                <button type="button" className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#10121a] px-4 py-3.5 text-white outline-none transition focus:border-[#22deff]/50"
                placeholder="••••••••"
              />
            </label>

            <button
              type="button"
              className="w-full rounded-md bg-gradient-to-r from-[#b985ff] to-[#22deff] py-3.5 text-[1.35rem] font-bold text-[#101322] transition hover:brightness-110"
            >
              Sign In
            </button>
          </form>

          <a
            href="https://anshapps.in/roadmap"
            className="mt-6 block w-full rounded-md border border-cyan-300/35 bg-[#14222a]/60 py-3.5 text-center font-semibold text-[#dbf8ff] transition hover:border-cyan-300/55 hover:bg-[#163044]"
          >
            Visit Ansh Roadmap
          </a>

          <p className="mt-9 text-center text-[1.02rem] text-white/55">
            New to ANSH Links?{" "}
            <Link href="/signup" className="font-bold text-[#b985ff]">
              Create Account
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
