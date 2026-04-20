import type { Metadata } from "next";
import Link from "next/link";
import ContinueToHomeButton from "./continue-to-home-button";

export const metadata: Metadata = {
  title: "Onboarding | Ansh Links",
  description: "Phase 01 onboarding for new ANSH Links users.",
};

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#b98cff]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8.2A2.2 2.2 0 0 1 6.2 6h1.6l1.2-1.6h6l1.2 1.6h1.6A2.2 2.2 0 0 1 20 8.2v9.6a2.2 2.2 0 0 1-2.2 2.2H6.2A2.2 2.2 0 0 1 4 17.8V8.2Z" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M17.7 5.1v3.1M16.15 6.65h3.1" />
    </svg>
  );
}

function AvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#22deff]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="9.2" cy="10.1" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="10.1" r="1.1" fill="currentColor" stroke="none" />
      <path d="M8.4 14.6c1 .95 2.2 1.4 3.6 1.4s2.6-.45 3.6-1.4" />
    </svg>
  );
}

export default function OnboardingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04050b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(105%_72%_at_50%_12%,rgba(107,45,255,0.25),transparent_52%),radial-gradient(70%_64%_at_85%_70%,rgba(24,220,255,0.2),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,18,0.92),rgba(5,6,10,0.96))]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[820px] items-start justify-center px-6 pb-8 pt-12 sm:px-8 sm:pt-14">
        <article className="w-full max-w-[680px]">
          <p className="text-center text-[0.68rem] font-bold uppercase tracking-[0.25em] text-[#11dafd]">Phase 01: Identity</p>

          <h1 className="mt-4 text-center font-sans text-[clamp(2.9rem,6vw,4rem)] font-semibold leading-[0.94] tracking-[-0.03em]">
            Let&apos;s build your
            <br />
            <span className="bg-gradient-to-r from-[#aa8cff] via-[#81a5ff] to-[#20ddff] bg-clip-text text-transparent">identity</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[440px] text-center text-[1rem] leading-[1.6] text-white/50">
            Define how the world sees you in the ANSH ecosystem. Start with your visual core.
          </p>

          <div className="mx-auto mt-9 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-[1.6rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(44,47,67,0.38),rgba(27,30,44,0.34))] px-6 pb-6 pt-5 text-center transition hover:border-[#b88eff]/40"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#2c2f3f]/90">
                <CameraIcon />
              </span>
              <h2 className="mt-4 text-[2rem] font-semibold leading-none tracking-[-0.02em] sm:text-[2.25rem]">Upload Photo</h2>
              <p className="mt-2 text-[0.95rem] leading-snug text-white/54">
                Real recognize real.
                <br />
                Use a high-quality JPG or PNG.
              </p>
            </button>

            <button
              type="button"
              className="rounded-[1.6rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(44,47,67,0.38),rgba(27,30,44,0.34))] px-6 pb-6 pt-5 text-center transition hover:border-[#22deff]/40"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-[#2c2f3f]/90">
                <AvatarIcon />
              </span>
              <h2 className="mt-4 text-[2rem] font-semibold leading-none tracking-[-0.02em] sm:text-[2.25rem]">Create Avatar</h2>
              <p className="mt-2 text-[0.95rem] leading-snug text-white/54">
                Digital native mode.
                <br />
                Generate a 3D fluid persona.
              </p>
            </button>
          </div>

          <div className="mt-9">
            <label className="block">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#11dafd]">Claim your handle</span>
              <input
                className="mt-3 w-full rounded-md border border-white/[0.08] bg-[#090c14]/96 px-5 py-3.5 text-[2rem] tracking-[-0.03em] text-white/30 outline-none transition placeholder:text-white/22 focus:border-[#22deff]/48 focus:text-white/92 sm:text-[2.2rem]"
                placeholder="ansh.cards/yourname"
              />
            </label>
            <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/32">
              Availability: <span className="text-[#11dafd]">Searching...</span>
            </p>
          </div>

          <ContinueToHomeButton />

          <p className="mt-5 text-center text-[0.9rem] text-white/44">
            Already have an identity?{" "}
            <Link href="/login" className="font-semibold text-[#b78bff]">
              Sign in
            </Link>
          </p>
        </article>
      </section>
    </main>
  );
}
