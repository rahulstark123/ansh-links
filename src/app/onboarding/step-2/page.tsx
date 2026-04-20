"use client";

import { useMemo, useState } from "react";

type ThemeOption = {
  id: string;
  name: string;
  shell: string;
  wallpaper: string;
  chipBorder: string;
  glow: string;
};

type FontOption = {
  id: string;
  label: string;
  className: string;
};

const themeOptions: ThemeOption[] = [
  {
    id: "hyperlink-neon",
    name: "HyperlinkNeon",
    shell: "from-[#1d2030] via-[#181c2a] to-[#121523]",
    wallpaper: "from-[#31c7ff] via-[#9f6dff] to-[#ff4fa9]",
    chipBorder: "border-[#b683ff]",
    glow: "shadow-[0_0_0_1px_rgba(182,131,255,0.6)_inset]",
  },
  {
    id: "pastel-pop",
    name: "Pastel Pop",
    shell: "from-[#272734] via-[#1f1f2c] to-[#171722]",
    wallpaper: "from-[#fda9d9] via-[#9e7cff] to-[#5ce6ff]",
    chipBorder: "border-[#f188d6]",
    glow: "shadow-[0_0_0_1px_rgba(241,136,214,0.55)_inset]",
  },
  {
    id: "cyber-core",
    name: "Cyber Core",
    shell: "from-[#10202a] via-[#122533] to-[#101726]",
    wallpaper: "from-[#2df7ff] via-[#31b2ff] to-[#a56eff]",
    chipBorder: "border-[#20dfff]",
    glow: "shadow-[0_0_0_1px_rgba(32,223,255,0.6)_inset]",
  },
];

const surfaceColors = ["#121622", "#00b9c2", "#5f00ff", "#8f1c1c", "#6fd7ff"];

const fontOptions: FontOption[] = [
  { id: "space", label: "Space Grotesk", className: "font-sans" },
  { id: "manrope", label: "Manrope", className: "font-sans" },
  { id: "editorial", label: "Syne Editorial", className: "font-display italic" },
];

const menuItems = ["Themes", "Palettes", "Typography", "Interface"];

export default function OnboardingStepTwoPage() {
  const [activeMenu, setActiveMenu] = useState("Interface");
  const [activeTheme, setActiveTheme] = useState(themeOptions[0]);
  const [activeSurface, setActiveSurface] = useState(surfaceColors[4]);
  const [activeFont, setActiveFont] = useState(fontOptions[0]);

  const previewCardStyle = useMemo(
    () => ({
      borderColor: activeSurface,
      boxShadow: `0 0 0 1px ${activeSurface}55 inset`,
    }),
    [activeSurface],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060810] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(64%_45%_at_52%_55%,rgba(0,229,255,0.22),transparent_72%),radial-gradient(60%_58%_at_94%_88%,rgba(158,96,255,0.2),transparent_76%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,20,0.9),rgba(4,6,11,0.95))]" />
      <div className="relative z-10 grid min-h-screen w-full grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_460px]">
        <aside className="border-r border-white/8 bg-gradient-to-b from-[#131726]/90 to-[#0d1019]/90 px-6 py-8 backdrop-blur-xl">
          <p className="text-lg font-semibold text-[#c495ff]">ANSH Studio</p>
          <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/30">Identity Customizer</p>

          <nav className="mt-8 space-y-2">
            {menuItems.map((item) => {
              const active = item === activeMenu;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveMenu(item)}
                  className={`flex w-full items-center justify-between rounded-full px-4 py-2.5 text-left text-sm font-semibold transition ${
                    active
                      ? "border border-cyan-300/35 bg-gradient-to-r from-[#2f3150]/90 to-[#143441]/90 text-white"
                      : "text-white/38 hover:bg-white/5 hover:text-white/70"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="border-r border-white/8 px-8 py-10 sm:px-12">
          <h1 className="text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.02em]">Design Your Node</h1>
          <p className="mt-2 max-w-[420px] text-[1rem] text-white/48">
            Synchronize your digital footprint with high-energy aesthetics.
          </p>

          <div className="mt-9">
            <p className="text-[0.9rem] font-bold uppercase tracking-[0.11em] text-[#12dbff]">1. Global Atmosphere</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-[580px]">
              {themeOptions.map((theme) => {
                const selected = theme.id === activeTheme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setActiveTheme(theme)}
                    className={`rounded-[1.2rem] border bg-white/[0.02] p-2.5 text-left transition ${
                      selected ? `${theme.chipBorder} ${theme.glow}` : "border-white/8"
                    }`}
                  >
                    <div className={`h-16 rounded-[1.1rem] bg-gradient-to-br ${theme.shell}`} />
                    <p className="mt-2 text-xs font-semibold text-white/70">{theme.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[0.9rem] font-bold uppercase tracking-[0.11em] text-[#12dbff]">2. Core Surface</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {surfaceColors.map((color) => {
                const selected = color === activeSurface;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setActiveSurface(color)}
                    className={`h-10 w-10 rounded-full border transition ${selected ? "scale-110 border-white/70" : "border-white/15"}`}
                    style={{ backgroundColor: color }}
                    aria-label={`surface-${color}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex h-12 w-full max-w-[320px] items-center rounded-full border border-white/8 bg-[#0f1220]/90 px-4 text-sm font-semibold text-white/55">
              #{activeSurface.replace("#", "").toUpperCase()}
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[0.9rem] font-bold uppercase tracking-[0.11em] text-[#12dbff]">3. Type Persona</p>
            <div className="mt-4 max-w-[360px] space-y-3">
              {fontOptions.map((font) => {
                const selected = font.id === activeFont.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setActiveFont(font)}
                    className={`flex w-full items-center justify-between rounded-full border px-5 py-3 text-left transition ${
                      selected ? "border-[#bb86ff] bg-[#222033]/75 text-white" : "border-white/8 bg-[#121522]/60 text-white/62"
                    }`}
                  >
                    <span className={`text-[1.65rem] ${font.className}`}>{font.label}</span>
                    {selected ? <span className="text-[#c191ff]">●</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center px-6 py-10 sm:px-8 lg:justify-end lg:pr-14">
          <div className="absolute right-8 top-8 rounded-full border border-white/10 bg-[#151923]/80 px-4 py-1 text-[0.65rem] font-bold uppercase tracking-[0.11em] text-[#13ddff] shadow-[0_0_18px_rgba(19,221,255,0.22)]">
            Live Update Active
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-x-5 -bottom-8 h-20 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className="w-[312px] rounded-[3.1rem] border-[7px] border-[#34394d] bg-[#090c15] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.62)]">
              <div className={`rounded-[2.45rem] bg-gradient-to-b ${activeTheme.shell} p-3`}>
                <div className="relative h-[548px] overflow-hidden rounded-[2.15rem] bg-[#080a12]">
                <div className={`h-36 bg-gradient-to-br ${activeTheme.wallpaper}`} />
                <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_12%_20%,rgba(255,255,255,0.18),transparent_20%),linear-gradient(180deg,transparent_30%,rgba(5,8,14,0.9)_62%)]" />

                <div className="relative z-10 -mt-9 px-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full border border-white/40 bg-[url('/creator-elena.png')] bg-cover bg-center" />
                    <div className={activeFont.className}>
                      <p className="text-[1.9rem] font-semibold leading-none">Aria_Flux</p>
                      <p className="text-sm text-cyan-300/85">@aria.design</p>
                    </div>
                  </div>

                  <div className="mt-7">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Bio</p>
                    <p className={`mt-2 text-[1rem] leading-snug text-white/78 ${activeFont.className}`}>
                      Liquid motion designer and digital architect. Exploring the boundary between electricity and identity.
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {["Latest Portfolio", "Github Repository", "Flux Audio Log"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="flex w-full items-center justify-between rounded-full border bg-[#171a26]/88 px-4 py-3 text-left text-sm font-semibold text-white/86 transition hover:bg-[#1f2434]"
                        style={previewCardStyle}
                      >
                        {item}
                        <span className="text-white/40">›</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around border-t border-white/10 bg-[#0b0e17]/96 py-3 text-white/45">
                  <span className="text-[#14dbff]">⌂</span>
                  <span>⌕</span>
                  <span>✉</span>
                  <span>⚙</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>
      </div>
    </main>
  );
}
