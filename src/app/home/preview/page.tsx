"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLocationDot,
  FaLinkedinIn,
  FaPlus,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
  FaGraduationCap,
} from "react-icons/fa6";

type StoredPreview = {
  designId: string;
  defaultThemeId: string;
  title: string;
  handle: string;
  bio: string;
  coverImageUrl: string;
  profileImageUrl: string;
  avatarImageUrl: string;
  showProfilePhoto: boolean;
  showAvatarBadge: boolean;
  showBio: boolean;
  showSocialChips: boolean;
  aboutWhatIDo: string;
  aboutInterests: string[];
  aboutEducation: string;
  aboutLocation: string;
  suggestions: {
    id: string;
    title: string;
    type: "Video" | "Music" | "Book" | "Podcast" | "Other";
    imageUrl: string;
    enabled: boolean;
  }[];
  settings: {
    allowPublic: boolean;
    allowShare: boolean;
    allowSearchIndexing: boolean;
    matureContentWarning: boolean;
    removeAnshBanner: boolean;
  };
  links: { label: string; url: string }[];
  socials: { platform: string; customPlatform: string }[];
  products: { category: string; name: string; price: string; imageUrl: string }[];
  design: {
    shellClass: string;
    overlayClass: string;
    linkClass: string;
    titleClass: string;
    ribbonClass: string;
    ribbonTextClass: string;
  };
};

const platformIconMap: Record<string, React.ReactNode> = {
  Instagram: <FaInstagram className="text-[0.75rem]" />,
  YouTube: <FaYoutube className="text-[0.75rem]" />,
  "X / Twitter": <FaXTwitter className="text-[0.75rem]" />,
  LinkedIn: <FaLinkedinIn className="text-[0.75rem]" />,
  GitHub: <FaGithub className="text-[0.75rem]" />,
  Facebook: <FaFacebookF className="text-[0.75rem]" />,
  TikTok: <FaTiktok className="text-[0.75rem]" />,
  Behance: <FaBehance className="text-[0.75rem]" />,
  Dribbble: <FaDribbble className="text-[0.75rem]" />,
  Website: <FaGlobe className="text-[0.75rem]" />,
  Other: <FaPlus className="text-[0.75rem]" />,
};

export default function PreviewPage() {
  const [data, setData] = useState<StoredPreview | null>(null);
  const productsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("ansh-live-preview");
    if (!raw) return;
    try {
      setData(JSON.parse(raw));
    } catch {
      setData(null);
    }
  }, []);

  const socials = useMemo(() => data?.socials ?? [], [data]);
  const products = useMemo(() => data?.products ?? [], [data]);
  const suggestions = useMemo(() => data?.suggestions?.filter((item) => item.enabled) ?? [], [data]);

  const scrollProducts = (direction: "left" | "right") => {
    const track = productsTrackRef.current;
    if (!track) return;
    const amount = 180;
    track.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const renderLayoutContent = () => {
    if (!data) return null;

    const aboutContainerClass =
      data.designId === "brutalist"
        ? "mt-5 rounded-none border-2 border-white/80 bg-black/45 p-3.5"
        : data.designId === "editorial"
          ? "mt-5 rounded-md border border-white/20 bg-black/25 p-4"
          : data.designId === "glass"
            ? "mt-5 rounded-[1rem] border border-white/28 bg-white/10 p-3.5 backdrop-blur-md"
            : data.designId === "cool-neon"
              ? "mt-5 rounded-[1rem] border border-cyan-300/30 bg-[#071426]/70 p-3.5 shadow-[0_0_16px_rgba(34,222,255,0.2)]"
              : data.designId === "minimal-stack"
                ? "mt-5 rounded-md border border-white/14 bg-black/22 p-3.5"
                : data.designId === "media-spotlight"
                  ? "mt-5 rounded-xl border border-cyan-200/25 bg-[#0d1a26]/70 p-3.5"
                  : "mt-5 rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(12,16,27,0.6),rgba(8,11,20,0.72))] p-3.5";
    const aboutTextClass =
      data.designId === "editorial" ? "text-[0.9rem] leading-relaxed text-white/82 italic" : "text-[0.88rem] leading-relaxed text-white/75";
    const aboutTagClass =
      data.designId === "brutalist"
        ? "rounded-none border border-white/75 bg-black/30 px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.09em] text-white"
        : data.designId === "editorial"
          ? "rounded-sm border border-white/24 bg-white/10 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-white/90"
          : "rounded-full border border-white/12 bg-[linear-gradient(90deg,rgba(185,131,255,0.18),rgba(34,222,255,0.14))] px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.09em] text-white/88";
    const metaChipClass =
      data.designId === "brutalist"
        ? "inline-flex items-center gap-1.5 rounded-none border border-white/75 bg-black/35 px-3 py-1.5 text-[0.68rem] font-semibold text-white"
        : "inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] font-semibold text-white/82";
    const suggestionContainerClass =
      data.designId === "brutalist"
        ? "mt-5 rounded-none border-2 border-white/80 bg-black/42 p-3.5"
        : data.designId === "editorial"
          ? "mt-5 rounded-md border border-white/20 bg-black/25 p-4"
          : data.designId === "glass"
            ? "mt-5 rounded-[1rem] border border-white/28 bg-white/10 p-3.5 backdrop-blur-md"
            : data.designId === "cool-neon"
              ? "mt-5 rounded-[1rem] border border-cyan-300/30 bg-[#071426]/70 p-3.5 shadow-[0_0_16px_rgba(34,222,255,0.2)]"
              : data.designId === "minimal-stack"
                ? "mt-5 rounded-md border border-white/14 bg-black/22 p-3.5"
                : data.designId === "media-spotlight"
                  ? "mt-5 rounded-xl border border-cyan-200/25 bg-[#0d1a26]/70 p-3.5"
                  : "mt-5 rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(12,16,27,0.56),rgba(8,11,20,0.68))] p-3.5";
    const suggestionRowClass =
      data.designId === "brutalist"
        ? "flex items-center gap-2 rounded-none border border-white/70 bg-black/30 p-2"
        : "flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.05] p-2";

    const quickLinksBlock = (
      <>
        <p className="mt-5 text-[0.58rem] font-bold uppercase tracking-[0.17em] text-white/55">Quick Links</p>
        <div className="mt-2.5 space-y-2.5">
          {data.links.map((link, idx) => (
            <div key={`${link.label}-${idx}`} className={`flex items-center justify-between px-3 py-2.5 text-sm text-white/86 ${data.design.linkClass}`}>
              {link.label || `Link ${idx + 1}`}
              <span className="text-white/40">›</span>
            </div>
          ))}
        </div>
      </>
    );

    const socialsBlock =
      data.showSocialChips && socials.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {socials.map((social, idx) => (
            <span key={`${social.platform}-${idx}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.64rem] font-semibold text-white/85">
              {platformIconMap[social.platform] ?? <FaPlus className="text-[0.75rem]" />}
              {social.platform === "Other" ? social.customPlatform || "Other" : social.platform}
            </span>
          ))}
        </div>
      ) : null;

    const productsBlock =
      products.length ? (
        <div className="mt-5">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.17em] text-white/55">Products</p>
          <div className="relative mt-2">
            <button type="button" onClick={() => scrollProducts("left")} aria-label="scroll-products-left" className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-[#0b0f18]/90 px-2 py-1 text-xs text-white/85 shadow-[0_6px_14px_rgba(0,0,0,0.4)]">‹</button>
            <button type="button" onClick={() => scrollProducts("right")} aria-label="scroll-products-right" className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-[#0b0f18]/90 px-2 py-1 text-xs text-white/85 shadow-[0_6px_14px_rgba(0,0,0,0.4)]">›</button>
            <div ref={productsTrackRef} className="scrollbar-hidden flex gap-2.5 overflow-x-auto overflow-y-hidden pb-1 pl-8 pr-8">
              {products.map((product, idx) => (
                <div key={`${product.name}-${idx}`} className="w-[140px] shrink-0 rounded-md border border-white/18 bg-black/35 p-1.5">
                  <div className="h-20 rounded-sm bg-cover bg-center" style={{ backgroundImage: `url('${product.imageUrl}')` }} />
                  <p className="mt-1.5 line-clamp-1 text-[0.66rem] font-semibold text-white/90">{product.name}</p>
                  <p className="text-[0.62rem] text-cyan-200">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null;

    const aboutYouBlock =
      data.aboutWhatIDo || data.aboutInterests?.length || data.aboutEducation || data.aboutLocation ? (
        <div className={aboutContainerClass}>
          {data.aboutWhatIDo ? <p className={aboutTextClass}>{data.aboutWhatIDo}</p> : null}

          {data.aboutInterests?.length ? (
            <div className="mt-3.5 flex flex-wrap gap-2">
              {data.aboutInterests.map((tag, idx) => (
                <span
                  key={`preview-interest-${idx}`}
                  className={aboutTagClass}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {(data.aboutEducation || data.aboutLocation) ? (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {data.aboutEducation ? (
                <span className={metaChipClass}>
                  <FaGraduationCap className="text-cyan-300/90" />
                  {data.aboutEducation}
                </span>
              ) : null}
              {data.aboutLocation ? (
                <span className={metaChipClass}>
                  <FaLocationDot className="text-[#f472d0]" />
                  {data.aboutLocation}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null;

    const mySuggestionsBlock =
      suggestions.length ? (
        <div className={suggestionContainerClass}>
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/60">My Suggestions</p>
          <div className="mt-2.5 space-y-2">
            {suggestions.map((item) => (
              <div key={item.id} className={suggestionRowClass}>
                <div className="h-9 w-9 shrink-0 rounded-sm bg-cover bg-center" style={{ backgroundImage: `url('${item.imageUrl}')` }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8rem] font-semibold text-white/92">{item.title}</p>
                  <p className="text-[0.62rem] uppercase tracking-[0.1em] text-cyan-200/85">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null;

    const settingsInfoBlock = data.settings ? (
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-semibold ${data.settings.allowPublic ? "bg-emerald-400/15 text-emerald-200" : "bg-red-400/15 text-red-200"}`}>
          {data.settings.allowPublic ? "Public" : "Private"}
        </span>
        {data.settings.allowShare ? <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[0.62rem] font-semibold text-cyan-200">Share Enabled</span> : null}
        {data.settings.matureContentWarning ? (
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[0.62rem] font-semibold text-amber-200">18+ Warning</span>
        ) : null}
      </div>
    ) : null;

    if (data.designId === "editorial") {
      return (
        <div className="relative bg-black/30 p-5 backdrop-blur-sm text-center">
          {data.showProfilePhoto ? <div className="mx-auto h-14 w-14 rounded-full border border-white/35 bg-cover bg-center" style={{ backgroundImage: `url('${data.profileImageUrl}')` }} /> : null}
          <h2 className={`mt-3 ${data.design.titleClass}`}>{data.title}</h2>
          <p className="text-sm text-cyan-200/90">@{data.handle.replace("ansh.cards/", "")}</p>
          {data.showBio ? <p className="mx-auto mt-2.5 max-w-[280px] text-xs text-white/75">{data.bio}</p> : null}
          <div className="mt-5 grid grid-cols-2 gap-2.5">{data.links.slice(0, 4).map((link, idx) => <div key={`ed-${idx}`} className={`px-3 py-3 text-sm ${data.design.linkClass}`}>{link.label}</div>)}</div>
          {socialsBlock}
          {aboutYouBlock}
          {mySuggestionsBlock}
          {productsBlock}
          {settingsInfoBlock}
        </div>
      );
    }

    if (data.designId === "minimal-stack") {
      return (
        <div className="relative bg-black/25 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {data.showProfilePhoto ? <div className="h-10 w-10 rounded-full border border-white/35 bg-cover bg-center" style={{ backgroundImage: `url('${data.profileImageUrl}')` }} /> : null}
            <div className="min-w-0">
              <h2 className={`truncate leading-none ${data.design.titleClass}`}>{data.title}</h2>
              <p className="mt-1 text-xs text-white/70">@{data.handle.replace("ansh.cards/", "")}</p>
            </div>
          </div>
          {data.showBio ? <p className="mt-3.5 text-xs text-white/70">{data.bio}</p> : null}
          {quickLinksBlock}
          {aboutYouBlock}
          {mySuggestionsBlock}
          {productsBlock}
          {settingsInfoBlock}
        </div>
      );
    }

    if (data.designId === "media-spotlight") {
      return (
        <div className="relative bg-black/36 p-5 backdrop-blur-sm">
          <div className="rounded-lg border border-white/18 bg-black/30 p-3">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/60">Featured</p>
            <div className="mt-2 h-24 rounded-md bg-cover bg-center" style={{ backgroundImage: `url('${data.coverImageUrl}')` }} />
          </div>
          <div className="mt-4.5">
            <h2 className={`truncate leading-none ${data.design.titleClass}`}>{data.title}</h2>
            <p className="mt-1 text-sm text-cyan-200/90">@{data.handle.replace("ansh.cards/", "")}</p>
          </div>
          {quickLinksBlock}
          {aboutYouBlock}
          {mySuggestionsBlock}
          {productsBlock}
          {settingsInfoBlock}
        </div>
      );
    }

    return (
      <div className="relative bg-black/38 p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          {data.showProfilePhoto ? <div className="h-12 w-12 rounded-full border border-white/35 bg-cover bg-center" style={{ backgroundImage: `url('${data.profileImageUrl}')` }} /> : null}
          <div className="min-w-0 flex-1">
            <h2 className={`truncate leading-none ${data.design.titleClass}`}>{data.title}</h2>
            <p className="mt-1 text-sm text-cyan-300/90">@{data.handle.replace("ansh.cards/", "")}</p>
          </div>
          {data.showAvatarBadge ? <div className="h-9 w-9 rounded-full border border-white/30 bg-cover bg-center" style={{ backgroundImage: `url('${data.avatarImageUrl}')` }} /> : null}
        </div>
        {data.showBio ? <p className="mt-2.5 text-xs text-white/75">{data.bio}</p> : null}
        {quickLinksBlock}
        {socialsBlock}
        {aboutYouBlock}
        {mySuggestionsBlock}
        {productsBlock}
        {settingsInfoBlock}
      </div>
    );
  };

  return (
    <main className="relative min-h-screen overflow-auto bg-[#060810] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_44%_at_52%_54%,rgba(0,228,255,0.22),transparent_72%),radial-gradient(58%_52%_at_95%_84%,rgba(154,90,255,0.2),transparent_75%)]" />
      <section className="relative z-10 mx-auto w-full max-w-[1180px] px-6 pb-16 pt-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>
          <p className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-cyan-200">
            Live Card Preview
          </p>
        </div>

        <div className="mx-auto w-full max-w-[455px]">
          {!data ? (
            <div className="rounded-xl border border-white/12 bg-[#0f1321] p-5 text-center text-white/70">
              Preview data is not available yet. Open preview from the builder screen.
            </div>
          ) : (
            <div className="scrollbar-ansh relative max-h-[calc(100vh-10.5rem)] overflow-y-auto overflow-x-hidden rounded-[1.6rem] border border-cyan-300/25 shadow-[0_30px_80px_rgba(0,0,0,0.62)]">
              {!data.settings?.removeAnshBanner ? (
                <div
                  className={`absolute -left-8 top-5 z-20 -rotate-45 rounded-sm px-10 py-1 text-[0.52rem] font-bold uppercase tracking-[0.16em] ${data.design.ribbonClass} ${data.design.ribbonTextClass}`}
                >
                  ANSH
                </div>
              ) : null}

              <div className={`absolute inset-0 ${data.design.shellClass}`} />
              <div className={`absolute inset-0 ${data.design.overlayClass}`} />
              <div className="relative h-44 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${data.coverImageUrl}')` }} />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,14,22,0.22),rgba(12,14,22,0.05)_45%,rgba(12,14,22,0.34))]" />
              </div>

              {renderLayoutContent()}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
