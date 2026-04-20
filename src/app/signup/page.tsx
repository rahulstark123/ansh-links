import type { Metadata } from "next";
import Link from "next/link";
import GoogleAuthButton from "@/components/auth/google-auth-button";

export const metadata: Metadata = {
  title: "Sign Up | Ansh Links",
  description: "Create your Ansh Links account.",
};

export default function SignupPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070811] text-white">
      <div className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-[#9158ff]/18 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#1bdcff]/16 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#2fd9ff]/10 blur-[120px]" />

      <section className="mx-auto grid min-h-screen w-full max-w-[1280px] items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[1.06fr_0.94fr] lg:px-14">
        <article className="relative rounded-[1.1rem] border border-white/8 bg-gradient-to-br from-[#1d1732] via-[#141123] to-[#080b15] px-6 py-10 shadow-[0_24px_70px_rgba(4,8,18,0.62)] sm:px-10 sm:py-12 lg:min-h-[640px] lg:px-12">
          <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full bg-[#8348ff]/14 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-14 -left-20 h-64 w-64 rounded-full bg-[#0ce2ff]/16 blur-[115px]" />

          <div className="relative flex h-full flex-col justify-between lg:min-h-[540px]">
            <h1 className="pr-2 font-display text-[clamp(2.8rem,6.4vw,5.8rem)] font-bold uppercase leading-[0.88] tracking-tight text-white">
              READY
              <br />
              <span className="bg-gradient-to-r from-[#f058ff] via-[#b276ff] to-[#4fd2ff] bg-clip-text text-transparent">FOR</span>
              <br />
              DIGITAL
              <br />
              <span className="bg-gradient-to-r from-[#e8fdff] via-[#d8ffff] to-[#4ee0ff] bg-clip-text text-transparent italic">
                PRESENCE
              </span>
            </h1>

            <a
              href="https://anshapps.in/roadmap"
              className="mt-8 inline-flex w-fit rounded-full border border-cyan-300/35 bg-[#111a2a]/75 px-6 py-2.5 text-sm font-semibold text-[#dcfaff] shadow-[0_0_18px_rgba(34,222,255,0.2)] transition hover:border-cyan-300/60 hover:bg-[#13223a]"
            >
              ANSH Roadmap
            </a>
          </div>
        </article>

        <article className="w-full rounded-[2rem] border border-white/12 bg-gradient-to-b from-[#1f2029] to-[#14161d] p-7 shadow-[0_26px_70px_rgba(8,12,24,0.74)] sm:p-9">
          <h2 className="font-display text-[2.3rem] font-bold leading-none">Create Account</h2>
          <p className="mt-2 text-white/58">Welcome to the future of digital asset curation.</p>

          <GoogleAuthButton
            nextPath="/onboarding"
            label="Login with Google"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-md border border-cyan-300/30 bg-[#14222a]/60 py-3.5 font-semibold text-white/88 transition hover:border-cyan-300/50 hover:bg-[#172a35]"
          />

          <div className="my-6 flex items-center gap-3 text-[0.62rem] font-bold uppercase tracking-[0.13em] text-white/38">
            <div className="h-px flex-1 bg-white/12" />
            Continue With Email
            <div className="h-px flex-1 bg-white/12" />
          </div>

          <form className="space-y-5">
            <label className="block">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Email Address</span>
              <input
                className="mt-2 w-full rounded-md border border-white/10 bg-[#10121a] px-4 py-3 text-white outline-none transition focus:border-[#22deff]/50"
                placeholder="you@liquid.io"
              />
            </label>

            <label className="block">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Password</span>
              <input
                type="password"
                className="mt-2 w-full rounded-md border border-white/10 bg-[#10121a] px-4 py-3 text-white outline-none transition focus:border-[#22deff]/50"
                placeholder="••••••••"
              />
            </label>

            <Link
              href="/onboarding"
              className="mt-2 block w-full rounded-md bg-gradient-to-r from-[#b985ff] to-[#22deff] py-3.5 text-center text-[0.95rem] font-black uppercase tracking-[0.1em] text-[#101322] transition hover:brightness-110"
            >
              Create Account
            </Link>
          </form>

          <p className="mt-7 text-center text-sm text-white/56">
            Already authenticated?{" "}
            <Link href="/login" className="font-bold text-[#22deff]">
              Sign In
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
