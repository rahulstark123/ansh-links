import Image from "next/image";
import Link from "next/link";

const navLinks = ["Features", "Security", "Pricing"];
const cardLinks = ["Portfolio 2024", "Latest Collections", "Connect in VR"];

const creatorBadges = ["Daily Posts", "Collab Certified", "Creator Shield", "Portfolio Pro"];
const promoHighlights = [
  {
    icon: "⚡",
    title: "Fast Deployment",
    desc: "Update your links in real-time. Your QR code and bio link stay the same, the content evolves.",
  },
  {
    icon: "▣",
    title: "Rich Analytics",
    desc: "Track every click, scan, and interaction. Know exactly where your audience is coming from.",
  },
  {
    icon: "◉",
    title: "Custom Themes",
    desc: "Liquid-electric styles that match your personal brand perfectly. Professional and edgy.",
  },
];

const finalStripFeatures = [
  {
    icon: "◉",
    title: "Custom Esthetics",
    desc: "Switch themes like you switch outfits. 100% you.",
    tint: "text-[#bf84ff]",
  },
  {
    icon: "↗",
    title: "Real Insights",
    desc: "See who's vibing with your profile in real-time.",
    tint: "text-[#22deff]",
  },
  {
    icon: "▦",
    title: "Instant Share",
    desc: "One scan, one click. Your whole world in one link.",
    tint: "text-[#ff56db]",
  },
];

const footerLinks = ["Terms", "Privacy", "Twitter", "Discord"];
const profileSocials = [
  { name: "YouTube", key: "youtube" },
  { name: "Twitter", key: "twitter" },
  { name: "Instagram", key: "instagram" },
  { name: "Facebook", key: "facebook" },
];

function MiniIcon({ label }: { label: string }) {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-sm text-white/85 backdrop-blur-md">
      {label}
    </div>
  );
}

function SocialGlyph({ platform }: { platform: string }) {
  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff4e45]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.2" y="6.2" width="17.6" height="11.6" rx="3.2" />
        <path d="M10 9.2L15.4 12L10 14.8V9.2Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "twitter") {
    return (
      <span className="text-[1.05rem] font-black tracking-tight text-[#60a5fa]" aria-hidden>
        X
      </span>
    );
  }

  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff73db]" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4.1" y="4.1" width="15.8" height="15.8" rx="4.6" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.2" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <span className="text-[1.2rem] font-bold text-[#22ddff]" aria-hidden>
      f
    </span>
  );
}

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#06070d] text-white">
      <div className="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-[#3a2fd7]/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-80 w-80 rounded-full bg-[#00d7ff]/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-32 top-10 h-64 w-64 rounded-full bg-[#912dff]/15 blur-[130px]" />

      <section className="relative mx-auto flex w-full max-w-[1280px] flex-col px-5 pb-20 pt-8 sm:px-8 lg:px-14">
        <nav className="mb-20 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b0c14]/90 px-5 py-4 backdrop-blur-lg md:px-7 lg:mb-24">
          <p className="font-display text-[1.7rem] font-bold uppercase leading-none tracking-tight text-white">ANSH LINKS</p>

          <ul className="hidden items-center gap-10 text-[0.98rem] font-semibold text-white/60 md:flex">
            {navLinks.map((item, index) => (
              <li
                key={item}
                className={index === 0 ? "border-b-2 border-[#8b4fff] pb-1 text-white" : "hover:text-white"}
              >
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-[#b575ff] to-[#00d3ff] px-6 py-2.5 text-sm font-bold text-[#090a12] transition hover:brightness-110"
          >
            Get Started
          </Link>
        </nav>

        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-8">
          <div className="max-w-[660px]">
            {/* <p className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#1bdcff]">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#1bdcff] shadow-[0_0_10px_#1bdcff]" />
              New: 3D cards available
            </p> */}

            <h1 className="font-display text-[3rem] font-bold leading-[0.98] tracking-tight text-white sm:text-[4.4rem] lg:text-[5.25rem]">
              Your Signature
              <br />
              in the{" "}
              <span className="bg-gradient-to-r from-[#bd8cff] via-[#7a9dff] to-[#65cfff] bg-clip-text text-transparent">Digital</span>
              <br />
              <span className="bg-gradient-to-r from-[#6a84ff] to-[#21ddff] bg-clip-text text-transparent">World</span>
            </h1>

            <p className="mt-7 max-w-[600px] text-xl leading-relaxed text-white/60">
              Create a digital identity that actually feels like you.
              <br />
              No templates, just pure liquid expression.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-gradient-to-r from-[#b775ff] to-[#00d8ff] px-8 py-4 text-base font-bold text-[#090a10] transition hover:brightness-110"
              >
                Create Your Card
              </Link>
              <button className="rounded-xl border border-white/10 bg-white/[0.04] px-8 py-4 text-base font-semibold text-[#1fe0ff] backdrop-blur-md transition hover:border-[#1fe0ff]/50">
                See Examples <span className="ml-2">-&gt;</span>
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center">
                <div className="-mr-2 grid h-10 w-10 place-items-center rounded-full border border-[#84f0ff]/30 bg-gradient-to-br from-[#24d2ff] to-[#5361ff] text-xs font-bold text-white">
                  A
                </div>
                <div className="-mr-2 grid h-10 w-10 place-items-center rounded-full border border-[#84f0ff]/30 bg-gradient-to-br from-[#7f56ff] to-[#24d2ff] text-xs font-bold text-white">
                  C
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full border border-[#84f0ff]/30 bg-gradient-to-br from-[#1ab6ff] to-[#4de1d9] text-xs font-bold text-white">
                  D
                </div>
              </div>
              <p className="text-sm uppercase tracking-[0.12em] text-white/45">
                <span className="font-bold text-white">12K+</span> identities minted
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] lg:mx-0">
            <div className="float-soft absolute left-2 top-2 z-20 rounded-xl border border-white/10 bg-[#12131f]/90 px-4 py-3 shadow-[0_14px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <p className="text-[0.6rem] uppercase tracking-[0.14em] text-white/45">Recent Activity</p>
              <p className="mt-1 text-[1.05rem] font-semibold text-white">42 New Views</p>
            </div>

            <article className="relative mt-8 rounded-[2rem] border border-white/12 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_20px_80px_rgba(15,17,39,0.65)] backdrop-blur-xl sm:p-8">
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border border-cyan-300/30 shadow-[0_0_30px_rgba(64,228,255,0.45)]">
                <Image src="/image1.svg" alt="Alex Thorne profile" width={112} height={112} className="h-full w-full object-cover" />
              </div>

              <h2 className="mt-5 text-center text-4xl font-bold tracking-tight">Alex Thorne</h2>
              <p className="mt-1 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#24deff]">
                Digital Curator & Architect
              </p>

              <div className="mt-7 space-y-3">
                {cardLinks.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl border border-white/7 bg-white/[0.06] px-4 py-4 text-[0.96rem] text-white/85"
                  >
                    <span>{item}</span>
                    <span className="text-white/35">+</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-center gap-3">
                <MiniIcon label="O" />
                <MiniIcon label="S" />
                <MiniIcon label="+" />
              </div>
            </article>

            <div className="absolute -bottom-3 right-[-12px] rounded-lg border border-white/10 bg-[#141523]/90 px-4 py-3 text-sm text-white/70 backdrop-blur-xl sm:-right-10">
              <p className="text-[0.6rem] uppercase tracking-[0.16em] text-[#b887ff]">Live Status</p>
              <p className="mt-1">Design in progress...</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-28 w-full max-w-[1280px] px-5 pb-24 pt-16 sm:mt-32 sm:px-8 sm:pt-20 lg:mt-36 lg:px-14 lg:pt-24">
        <div className="pointer-events-none absolute -top-12 left-1/2 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#7f5cff]/40 to-transparent" />
        <div className="pointer-events-none absolute -top-28 left-1/2 h-24 w-[78%] -translate-x-1/2 rounded-full bg-[#5f4cff]/12 blur-3xl" />
        <div className="pointer-events-none absolute left-8 top-10 h-64 w-64 rounded-full bg-[#8a4dff]/14 blur-[120px]" />
        <div className="pointer-events-none absolute right-10 top-14 h-60 w-60 rounded-full bg-[#1fdcff]/10 blur-[125px]" />

        <h2 className="font-display text-[2.8rem] font-bold leading-[0.95] tracking-tight text-white sm:text-[4rem] md:text-[5.1rem]">
          All your links.
          <br />
          <span className="bg-gradient-to-r from-[#c485ff] via-[#d65bdb] to-[#29dcff] bg-clip-text text-transparent">
            One beautiful card.
          </span>
        </h2>
        <p className="mt-7 max-w-[700px] text-[1.12rem] leading-relaxed text-white/55">
          Ditch the bio-link clutter. ANSH Smart Links aggregate your digital existence into a single, high-performance
          editorial experience.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start xl:gap-10">
          <div className="space-y-6">
            <article className="rounded-[1.75rem] border border-white/9 bg-gradient-to-b from-[#171b2a] to-[#10131a] p-6 shadow-[0_20px_46px_rgba(4,8,19,0.62)] sm:p-7">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Logic</p>
              <h3 className="mt-4 text-[2.05rem] font-bold leading-none text-white">Semantic Grouping</h3>
              <p className="mt-4 max-w-[390px] text-base leading-relaxed text-white/57">
                Automatically sort your links by intent. Socials stay expressive, portfolios stay professional, and
                highlights stay bold.
              </p>
              <ul className="mt-7 space-y-3 text-white/84">
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#bf84ff]" />
                  <span>Visual Differentiation</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#22deff]" />
                  <span>Deep Click Analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5ae8]" />
                  <span>Real-time Feed Sync</span>
                </li>
              </ul>
            </article>

            <article className="rounded-[1.6rem] border border-cyan-300/28 bg-gradient-to-r from-[#1e2232] to-[#20232f] p-6 shadow-[0_16px_32px_rgba(4,9,18,0.54)]">
              <h3 className="text-[1.9rem] font-bold leading-none text-white">Neon Borders</h3>
              <p className="mt-3 max-w-[360px] text-base leading-relaxed text-white/55">
                Active highlights that guide your audience&apos;s eyes to what matters most right now.
              </p>
            </article>
          </div>

          <div className="flex justify-center lg:justify-end">
            <article className="w-full max-w-[430px] rounded-[2.2rem] border border-white/9 bg-gradient-to-b from-[#20212b] to-[#16181f] p-5 shadow-[0_24px_62px_rgba(4,8,18,0.66)] sm:p-6">
              <div className="grid place-items-center">
                <div className="h-20 w-20 overflow-hidden rounded-full border border-[#d987ff]/45 shadow-[0_0_20px_rgba(173,93,255,0.38)]">
                  <Image
                    src="/digital-avatar.svg"
                    alt="Alexa Vibes digital avatar"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-center text-[1.9rem] font-bold tracking-tight text-white">ALEXA_VIBES</h3>
                <p className="mt-1 text-center text-[0.66rem] font-bold uppercase tracking-[0.19em] text-[#24deff]">
                  Digital Architect
                </p>
              </div>

              <div className="mt-7">
                <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-white/35">Featured</p>
                <div className="relative mt-3 overflow-hidden rounded-[1.35rem] border border-white/8 bg-gradient-to-r from-[#12141c] via-[#1a1d27] to-[#10141b]">
                  <div className="h-36 w-full bg-[radial-gradient(circle_at_20%_30%,#2b3345,transparent_30%),radial-gradient(circle_at_70%_40%,#24465f,transparent_30%),linear-gradient(120deg,#0d0f15,#1a1e2a_40%,#10141e_80%)]" />
                  <button className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-xl text-black shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    ▶
                  </button>
                  <p className="absolute bottom-2.5 left-3.5 text-[0.56rem] font-black uppercase tracking-[0.16em] text-white/86">
                    New Track: Electric Liquid
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-white/35">Socials</p>
                <div className="mt-3 grid grid-cols-4 gap-2.5">
                  {profileSocials.map((social) => (
                    <div
                      key={social.name}
                      className="grid h-16 place-items-center rounded-md border border-white/8 bg-white/[0.06]"
                      title={social.name}
                    >
                      <SocialGlyph platform={social.key} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-white/35">Portfolio</p>
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between rounded-md border border-white/8 bg-[#10131d] px-3 py-2.5 text-white/90">
                    <span className="text-sm font-semibold">⚡ Behance</span>
                    <span className="text-sm">↗</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-white/8 bg-[#10131d] px-3 py-2.5 text-white/90">
                    <span className="text-sm font-semibold">{"</>"} GitHub</span>
                    <span className="text-sm">↗</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-28 w-full max-w-[1280px] px-5 pb-28 pt-16 sm:mt-32 sm:px-8 sm:pt-20 lg:mt-36 lg:px-14 lg:pt-24">
        <div className="pointer-events-none absolute -top-12 left-1/2 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#24deff]/40 to-transparent" />
        <div className="pointer-events-none absolute -top-28 left-1/2 h-24 w-[78%] -translate-x-1/2 rounded-full bg-[#1fcfff]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-20 top-12 h-60 w-60 rounded-full bg-[#6f49ff]/12 blur-[120px]" />
        <div className="pointer-events-none absolute right-24 top-24 h-56 w-56 rounded-full bg-[#14dbff]/12 blur-[120px]" />

        <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#21deff]">Platform Showcase</p>
        <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.96] tracking-tight text-white sm:text-[3.3rem] md:text-[4.3rem]">
          The Creator
          <br />
          <span className="bg-gradient-to-r from-[#ae84ff] via-[#78a1ff] to-[#24deff] bg-clip-text text-transparent">Ecosystem</span>
        </h2>
        <p className="mt-7 max-w-[630px] text-[1.03rem] leading-relaxed text-white/60">
          Identity is fluid. Our cards morph to match your frequency, from high-fashion editorial to precision tech aesthetics.
        </p>

        <div className="mt-20 flex min-h-[460px] items-center justify-center sm:min-h-[520px]">
          <div className="relative h-[420px] w-full max-w-[840px] sm:h-[480px]">
            <article className="absolute left-[4%] top-[16%] z-10 w-[40%] -rotate-[8deg] rounded-[1.55rem] border border-white/12 bg-gradient-to-b from-[#22242e] to-[#101118] p-4 shadow-[0_24px_60px_rgba(5,8,17,0.65)] sm:left-[5%] sm:top-[13%] sm:w-[36%]">
              <div className="mx-auto h-[7.7rem] w-[6rem] overflow-hidden rounded-xl border border-white/10 bg-[#16171d] sm:h-[10rem] sm:w-[8rem]">
                <Image src="/creator-milo.png" alt="Milo Chen portrait" width={128} height={160} className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-4 text-[2rem] font-bold leading-none text-white">Milo Chen</h3>
              <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#cf7dff]">University Student</p>
              <div className="mt-3 space-y-1.5">
                {creatorBadges.map((badge) => (
                  <div key={badge} className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.58rem] font-semibold text-white/75">
                    {badge}
                  </div>
                ))}
              </div>
            </article>

            <article className="absolute right-[4%] top-[16%] z-10 w-[40%] rotate-[7deg] rounded-[1.55rem] border border-white/12 bg-gradient-to-b from-[#22242e] to-[#101118] p-4 shadow-[0_24px_60px_rgba(5,8,17,0.65)] sm:right-[5%] sm:top-[13%] sm:w-[36%]">
              <div className="mb-4 flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-white/[0.08] text-sm text-[#1fe0ff]">S</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#1fe0ff] text-[0.56rem] font-black text-[#07212a]">+</span>
              </div>
              <h3 className="text-[2rem] font-bold leading-none text-white">Alex Thorne</h3>
              <p className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#cf7dff]">Tech Influencer</p>
              <div className="mt-3 space-y-1.5">
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.58rem] font-semibold text-[#28dcff]">
                  27K Current Glow
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.58rem] font-semibold text-[#cb86ff]">
                  84 Neurons Pro Max
                </div>
              </div>
              <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/78">1.2K Members Active</p>
              <div className="mt-5 flex items-center justify-between text-white/50">
                <span className="text-sm">◻</span>
                <span className="text-sm">···</span>
              </div>
            </article>

            <article className="absolute left-1/2 top-[2%] z-20 w-[47%] -translate-x-1/2 rounded-[1.85rem] border border-cyan-300/22 bg-gradient-to-b from-[#131a2b] via-[#0f1119] to-[#090b12] p-5 shadow-[0_24px_80px_rgba(3,7,20,0.78)] sm:top-0 sm:w-[41%] md:w-[38%] sm:p-5">
              <div className="mx-auto h-44 w-[8.7rem] overflow-hidden rounded-xl border border-cyan-300/20 bg-[#111827] sm:h-52 sm:w-[10rem]">
                <Image src="/creator-elena.png" alt="Elena Vane portrait" width={176} height={240} className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-4 text-center text-[1.9rem] font-bold tracking-tight text-white sm:text-[2.05rem]">Elena Vane</h3>
              <p className="mt-1 text-center text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#1ee1ff]">Creative Director</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              </div>
              <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#9a5dff] to-[#22ddff] px-4 py-2.5 text-[0.6rem] font-black uppercase tracking-[0.14em] text-[#130a1f] shadow-[0_0_24px_rgba(120,94,255,0.45)] transition hover:brightness-110">
                View Lookbook <span className="ml-2">-&gt;</span>
              </button>
            </article>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[1.18fr_0.62fr_0.62fr]">
          <article className="rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-[#121726] to-[#0d0f18] p-6 shadow-[0_18px_36px_rgba(6,8,17,0.6)] sm:p-7">
            <p className="text-xl text-[#20deff]">↳</p>
            <h3 className="mt-10 font-display text-[2rem] font-bold leading-[0.92] text-white">Infinite Adaptability</h3>
            <p className="mt-4 max-w-[340px] text-sm leading-relaxed text-white/60">
              Switch styles as fast as your mood changes. One identity, unlimited expressions.
            </p>
          </article>

          <article className="rounded-[1.2rem] border border-[#d9a7ff]/20 bg-[#c58cff] p-6 text-[#180f2a] shadow-[0_18px_36px_rgba(129,78,193,0.45)] sm:p-7">
            <h3 className="text-5xl font-extrabold tracking-tight">0.1s</h3>
            <p className="mt-20 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#3b245f]">Update Latency</p>
          </article>

          <article className="rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-[#1d1f28] to-[#111218] p-6 shadow-[0_18px_36px_rgba(6,8,17,0.6)] sm:p-7">
            <p className="text-xl text-[#ff4fe1]">✤</p>
            <h3 className="mt-16 text-[1.8rem] font-extrabold tracking-tight text-white">2.4M+</h3>
            <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/55">Active Nodes</p>
          </article>
        </div>
      </section>

      <section className="relative mx-auto mt-28 w-full max-w-[1280px] px-5 pb-36 pt-16 sm:mt-32 sm:px-8 sm:pt-20 lg:mt-36 lg:px-14 lg:pt-24">
        <div className="pointer-events-none absolute -top-12 left-1/2 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#9f6bff]/42 to-transparent" />
        <div className="pointer-events-none absolute -top-28 left-1/2 h-24 w-[78%] -translate-x-1/2 rounded-full bg-[#8c58ff]/12 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 rounded-full bg-[#8355ff]/14 blur-[120px]" />
        <div className="pointer-events-none absolute left-16 top-44 h-52 w-52 rounded-full bg-[#22ddff]/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-12 top-52 h-56 w-56 rounded-full bg-[#ad59ff]/10 blur-[130px]" />

        <div className="mx-auto max-w-[820px] text-center">
          <h2 className="font-display text-[2.5rem] font-bold leading-[0.94] tracking-tight text-white sm:text-[3.5rem] md:text-[4.3rem]">
            Promote yourself
            <br />
            <span className="bg-gradient-to-r from-[#ab89ff] via-[#79a6ff] to-[#24deff] bg-clip-text text-transparent">
              in one click
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-[620px] text-[1.02rem] leading-relaxed text-white/60">
            Share your card and let people discover everything about you - your work, your links, your identity.
          </p>
        </div>

        <div className="mt-20 grid gap-9 xl:grid-cols-[0.82fr_1.18fr] xl:gap-10">
          <div className="space-y-6">
            <article className="rounded-[1.55rem] border border-white/8 bg-gradient-to-b from-[#131522] to-[#0d1017] p-7 shadow-[0_20px_48px_rgba(4,8,19,0.68)]">
              <div className="rounded-[1.3rem] border border-white/9 bg-gradient-to-b from-[#141826] to-[#10131a] p-7">
                <div className="mx-auto w-fit rounded-[1.1rem] bg-[#f2f7ff] p-4 shadow-[0_0_20px_rgba(72,224,255,0.28)]">
                  <div className="rounded-xl bg-[#191d24] px-4 pb-4 pt-3 text-center">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#9fa7ab]">Custom</p>
                    <div className="mx-auto mt-3 h-28 w-28 rounded-sm bg-white p-1.5">
                      <Image src="/qr-code.svg" alt="Profile QR code" width={112} height={112} className="h-full w-full object-contain" />
                    </div>
                    <p className="mt-3 text-xs text-[#cfd5da]">safe work</p>
                  </div>
                </div>
                <h3 className="mt-7 text-center text-[2rem] font-bold leading-none text-white">Instant Access</h3>
                <p className="mx-auto mt-4 max-w-[360px] text-center text-[1.05rem] leading-relaxed text-white/56">
                  Scanning reveals your digital ecosystem instantly.
                </p>
                <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg border border-white/9 bg-[#171922] py-3.5 text-lg font-bold text-[#1fe0ff] transition hover:bg-[#1c1f2b]">
                  <span>⭳</span>
                  <span>Download SVG</span>
                </button>
              </div>
            </article>

            <article className="rounded-xl border border-white/10 bg-[#121523] p-4">
              <p className="text-[0.76rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Personal URL</p>
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <p className="flex-1 text-[1.03rem] text-white/65">ansh.cards/alex-rivers</p>
                <button className="rounded-md bg-[#c687ff] px-4 py-2 text-base font-bold text-[#261339]">Copy</button>
              </div>
              <p className="mt-3 text-sm text-[#b960ff]">✔ Link copied to clipboard!</p>
            </article>
          </div>

          <article className="rounded-[1.6rem] border border-white/8 bg-gradient-to-b from-[#121423] to-[#0d0f17] p-7 shadow-[0_20px_58px_rgba(4,8,18,0.65)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_230px] lg:items-start">
              <div>
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-[#be88ff]/40 bg-[#201a2a] text-sm font-bold text-[#ffb66f]">
                    A
                  </span>
                  <div>
                    <p className="text-[1.35rem] font-semibold text-white">@alex_rivers</p>
                    <p className="text-sm text-white/55">Design Lead</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 w-[72%] rounded-full bg-white/6" />
                  <div className="h-3 w-[55%] rounded-full bg-white/6" />
                </div>

                <div className="mt-7 flex max-w-[430px] items-center gap-3 rounded-lg border border-[#bb86ff]/25 bg-[#242231] px-4 py-3">
                  <span className="text-[#a977ff]">⛓</span>
                  <p className="text-[1.2rem] font-semibold text-[#c689ff]">ansh.cards/alex-rivers</p>
                </div>

                <div className="mt-10 grid max-w-[430px] grid-cols-3 gap-3">
                  <div className="h-24 rounded-sm bg-white/10" />
                  <div className="h-24 rounded-sm bg-white/10" />
                  <div className="h-24 rounded-sm bg-white/10" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[0.84rem] font-bold uppercase tracking-[0.14em] text-white/80">
                  <span className="text-[#20deff]">▣</span>
                  Messenger
                </div>
                <div className="mt-4 rounded-[2rem] border border-cyan-300/25 bg-gradient-to-b from-[#163747] to-[#172531] p-4">
                  <p className="text-[1.1rem] leading-tight text-white/95">
                    Hey! Here is my full portfolio and contact details:
                  </p>
                  <div className="mt-4 rounded-[1.2rem] bg-gradient-to-r from-[#7e6ab2] to-[#2b91a5] p-4">
                    <div className="h-20 rounded-lg border border-white/8 bg-black/10" />
                    <p className="mt-3 text-sm font-semibold text-white">Alex Rivers | Digital Identity</p>
                    <p className="text-xs text-white/65">ansh.cards</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_250px] lg:items-end">
              <div>
                <h3 className="text-[3rem] font-bold leading-none text-white">Ready to talk?</h3>
                <p className="mt-4 max-w-[480px] text-[2rem] leading-tight text-white/58">
                  Find all my socials and booking links in one place.
                </p>
              </div>

              <div className="rounded-[1.6rem] border border-cyan-300/30 bg-gradient-to-r from-[#1e2336] to-[#173247] px-5 py-4">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#22ddff]">Digital Card</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[2rem] font-black uppercase leading-[0.95] text-white">
                    ANSH /
                    <br />
                    ALEX
                  </p>
                  <span className="text-2xl text-[#22deff]">⌘</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-24 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {promoHighlights.map((item) => (
            <article key={item.title} className="px-1 text-center sm:px-2">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-lg text-white shadow-[0_0_18px_rgba(121,146,255,0.24)]">
                {item.icon}
              </div>
              <h3 className="mt-5 text-2xl font-bold text-white">{item.title}</h3>
              <p className="mx-auto mt-3 max-w-[330px] text-sm leading-relaxed text-white/58">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-28 w-full max-w-[1280px] px-5 pb-36 pt-16 sm:mt-32 sm:px-8 sm:pt-20 lg:mt-36 lg:px-14 lg:pt-24">
        <div className="pointer-events-none absolute -top-12 left-1/2 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#24deff]/42 to-transparent" />
        <div className="pointer-events-none absolute -top-28 left-1/2 h-24 w-[78%] -translate-x-1/2 rounded-full bg-[#27d9ff]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-12 top-20 h-64 w-64 rounded-full bg-[#8f57ff]/11 blur-[130px]" />
        <div className="pointer-events-none absolute right-16 top-24 h-64 w-64 rounded-full bg-[#22ddff]/11 blur-[130px]" />

        <div className="mx-auto max-w-[780px] text-center">
          <h2 className="font-display text-[2.6rem] font-bold leading-[0.95] tracking-tight text-white sm:text-[3.5rem] md:text-[4.1rem]">
            CHOOSE YOUR{" "}
            <span className="bg-gradient-to-r from-[#7fd7ff] to-[#24deff] bg-clip-text italic text-transparent">VIBE.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-[620px] text-[1.04rem] leading-relaxed text-white/60">
            Your digital identity shouldn&apos;t be boring. Pick a plan that matches your aesthetic.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-[980px] gap-9 lg:grid-cols-2">
          <article className="rounded-[1.5rem] border border-white/12 bg-gradient-to-b from-[#1a1a2b] to-[#101218] p-7 shadow-[0_22px_48px_rgba(5,8,18,0.66)] sm:p-8">
            <div className="flex items-start justify-between">
              <p className="text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#c88bff]">Free Plan</p>
              <span className="text-3xl text-white/14">◌</span>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <p className="text-6xl font-extrabold tracking-tight text-white">₹0</p>
              <p className="pb-2 text-lg text-white/58">/ month</p>
            </div>

            <ul className="mt-9 space-y-4">
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#bf84ff]" />
                <span>Create your digital card</span>
              </li>
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#bf84ff]" />
                <span>Add unlimited links</span>
              </li>
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#bf84ff]" />
                <span>Basic themes</span>
              </li>
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#bf84ff]" />
                <span>Share anywhere (Insta, WA, QR)</span>
              </li>
            </ul>

            <button className="mt-16 w-full rounded-lg border border-white/16 bg-white/[0.02] py-3.5 text-lg font-semibold text-white/88 transition hover:bg-white/[0.06]">
              Start Now
            </button>
          </article>

          <article className="rounded-[1.5rem] border border-cyan-300/22 bg-gradient-to-b from-[#12192a] to-[#0d151d] p-7 shadow-[0_24px_60px_rgba(7,24,33,0.62)] sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1ac7dd]/20 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#22deff]" />
              <span className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#22deff]">Most Popular</span>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <p className="text-6xl font-extrabold tracking-tight text-white">₹99</p>
              <p className="pb-2 text-lg text-white/62">/ month</p>
            </div>

            <div className="mt-2 flex items-center gap-2 text-[0.72rem] font-bold">
              <span className="text-[#1fe0ff]">OR ₹999 / year</span>
              <span className="rounded-sm bg-[#1de1ff] px-1.5 py-0.5 text-[#053846]">SAVE 15%</span>
            </div>

            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#1fe0ff]" />
                <span>Advanced themes & customization</span>
              </li>
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#1fe0ff]" />
                <span>Avatar styles (premium look)</span>
              </li>
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#1fe0ff]" />
                <span>Remove ANSH branding</span>
              </li>
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#1fe0ff]" />
                <span>Basic analytics (views, clicks)</span>
              </li>
              <li className="flex items-center gap-3 text-white/86">
                <span className="h-3 w-3 rounded-full bg-[#1fe0ff]" />
                <span>Priority profile styling</span>
              </li>
            </ul>

            <button className="mt-11 w-full rounded-lg bg-gradient-to-r from-[#b47dff] to-[#22deff] py-3.5 text-lg font-bold text-[#101322] shadow-[0_0_30px_rgba(60,223,255,0.35)] transition hover:brightness-110">
              Go Pro
            </button>
          </article>
        </div>

        <p className="mt-16 text-center text-[1.7rem] font-medium text-white/85">
          Start free. <span className="font-bold text-[#bb86ff]">Upgrade</span> when you grow.
        </p>
      </section>

      <section className="relative mx-auto mt-28 w-full max-w-[1280px] px-5 pb-32 pt-16 sm:mt-32 sm:px-8 sm:pt-20 lg:mt-36 lg:px-14 lg:pt-24">
        <div className="pointer-events-none absolute -top-12 left-1/2 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#30deff]/40 to-transparent" />
        <div className="pointer-events-none absolute -top-28 left-1/2 h-24 w-[78%] -translate-x-1/2 rounded-full bg-[#22deff]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-44 w-[72%] -translate-x-1/2 rounded-full bg-[#1ddcff]/8 blur-[120px]" />

        <div className="grid gap-7 md:grid-cols-3 lg:gap-9">
          {finalStripFeatures.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[1.25rem] border border-white/10 bg-gradient-to-b from-[#1b1c29] to-[#11121a] px-6 py-7 text-center shadow-[0_16px_32px_rgba(4,8,17,0.56)] sm:px-7 sm:py-8"
            >
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.03]">
                <span className={`text-lg ${feature.tint}`}>{feature.icon}</span>
              </div>
              <h3 className="mt-5 text-[1.55rem] font-bold leading-none text-white">{feature.title}</h3>
              <p className="mx-auto mt-4 max-w-[280px] text-sm leading-relaxed text-white/58">{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative mt-28 sm:mt-32 lg:mt-36">
        <div className="pointer-events-none absolute -top-12 left-1/2 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#9b67ff]/42 to-transparent" />
        <div className="pointer-events-none absolute -top-28 left-1/2 h-24 w-[78%] -translate-x-1/2 rounded-full bg-[#8d56ff]/12 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-8 h-64 w-[78%] -translate-x-1/2 rounded-full bg-[#5f46ff]/10 blur-[130px]" />

        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-5 pb-28 pt-24 text-center sm:px-8 sm:pb-32 sm:pt-28 lg:px-14">
          <h2 className="font-display text-[3rem] font-bold uppercase leading-[0.92] tracking-tight text-white sm:text-[4.5rem] md:text-[5.6rem]">
            Claim Your
            <br />
            <span className="bg-gradient-to-r from-[#ca7dff] via-[#9f8fff] to-[#24deff] bg-clip-text text-transparent">Presence.</span>
          </h2>

          <button className="mt-12 rounded-full border border-cyan-300/25 bg-black px-10 py-4 text-xl font-semibold text-white shadow-[0_0_26px_rgba(74,221,255,0.38)] transition hover:brightness-110">
            Get ANSH Links Free
          </button>
        </div>

        <footer className="border-t border-white/7 bg-[#04060d]/95">
          <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:px-14">
            <div className="text-center lg:text-left">
              <p className="font-display text-2xl font-bold uppercase text-white">ANSH Links</p>
              <p className="mt-3 max-w-[330px] text-sm leading-relaxed text-white/52">
                The fluid identity protocol for the next generation.
              </p>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/56">
              {footerLinks.map((link) => (
                <li key={link} className="transition hover:text-white/85">
                  {link}
                </li>
              ))}
            </ul>

            <p className="text-center text-xs text-white/44 lg:text-right">
              © 2024 ANSH Links. Liquid Electric Editorial.
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
