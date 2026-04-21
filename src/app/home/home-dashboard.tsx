"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import currencyCodes from "currency-codes";
import type { IconType } from "react-icons";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useUiStore } from "@/store/ui-store";
import {
  FaBehance,
  FaBoxOpen,
  FaArrowRightFromBracket,
  FaCheck,
  FaChevronDown,
  FaCompass,
  FaDribbble,
  FaFacebookF,
  FaGear,
  FaGithub,
  FaGlobe,
  FaHouse,
  FaInstagram,
  FaLink,
  FaLocationDot,
  FaLinkedinIn,
  FaPalette,
  FaPlus,
  FaShareNodes,
  FaTiktok,
  FaUser,
  FaXmark,
  FaXTwitter,
  FaYoutube,
  FaGraduationCap,
} from "react-icons/fa6";

type CardItem = {
  id: string;
  name: string;
  handle: string;
  cardSlug: string;
  shareUrl: string;
  status: "Live" | "Draft";
  updatedAt: string;
  links: string[];
  cover: string;
};

type CardLinkRow = {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
};

type ProductItem = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  enabled: boolean;
};

type ProductCategory = {
  id: string;
  name: string;
  enabled: boolean;
  products: ProductItem[];
};

type CatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  linkUrl: string | null;
  currency: string;
  amount: number;
  imageUrl: string | null;
  useInLinks: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
};

type CatalogCategory = {
  id: string;
  name: string;
};

type CoverPreset = {
  id: string;
  label: string;
  imageUrl: string;
};

type SavedSocialLink = {
  id: string;
  platform: string;
  accountName: string | null;
  customPlatform: string | null;
  url: string;
  useInCardBuilder: boolean;
};

type StoredCard = {
  id: string;
  title: string;
  cardSlug: string;
  isLive: boolean;
  status: string;
  bio: string | null;
  profileImageUrl: string | null;
  designId: string;
  defaultThemeId: string;
  showProfilePhoto: boolean;
  showAvatarBadge: boolean;
  showBio: boolean;
  showSocialChips: boolean;
  aboutWhatIDo: string | null;
  aboutInterests: unknown;
  aboutEducation: string | null;
  aboutLocation: string | null;
  selectedProductIds: unknown;
  productVisibility: unknown;
  selectedSocialIds: unknown;
  socialVisibility: unknown;
  settings: unknown;
  coverImageUrl: string | null;
  updatedAt: string;
  links: Array<{ label?: string; url?: string; enabled?: boolean }> | null;
};

type SuggestionItem = {
  id: string;
  title: string;
  type: "Video" | "Music" | "Book" | "Podcast" | "Other";
  imageUrl: string;
  enabled: boolean;
};

type PreviewProduct = {
  category: string;
  name: string;
  price: string;
  imageUrl: string;
};

type DesignPreset = {
  id: string;
  name: string;
  description: string;
  shellClass: string;
  overlayClass: string;
  linkClass: string;
  titleClass: string;
  ribbonClass: string;
  ribbonTextClass: string;
};

type ColorThemePreset = {
  id: string;
  name: string;
  shellClass: string;
  overlayClass: string;
  linkClass: string;
  ribbonClass: string;
  ribbonTextClass: string;
};

type PreviewPayload = {
  mode: "builder" | "my-links";
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
  suggestions: SuggestionItem[];
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
  design: DesignPreset;
};

const primaryNavItems: { label: string; Icon: IconType }[] = [
  { label: "Dashboard", Icon: FaHouse },
  { label: "My Links", Icon: FaLink },
  { label: "My Products", Icon: FaBoxOpen },
  { label: "Social Media", Icon: FaShareNodes },
  { label: "Explore", Icon: FaCompass },
];
const utilityNavItems: { label: string; Icon: IconType }[] = [{ label: "Settings", Icon: FaGear }];
const builderNavItems: { label: string; Icon: IconType }[] = [
  { label: "Links", Icon: FaLink },
  { label: "About You", Icon: FaUser },
  { label: "Products", Icon: FaBoxOpen },
  { label: "Social Media", Icon: FaShareNodes },
  { label: "Design", Icon: FaPalette },
  { label: "Settings", Icon: FaGear },
];

const kpiCards = [
  { label: "Profile Views", value: "48,219", delta: "+12.4%" },
  { label: "Total Clicks", value: "17,882", delta: "+9.1%" },
  { label: "CTR", value: "37.1%", delta: "+3.8%" },
  { label: "Unique Visitors", value: "31,406", delta: "+7.2%" },
  { label: "Avg Time to Click", value: "11.4s", delta: "-1.3s" },
];

const trafficSources = [
  { name: "Instagram", share: 46 },
  { name: "YouTube", share: 24 },
  { name: "Direct", share: 17 },
  { name: "QR", share: 8 },
  { name: "X / Twitter", share: 5 },
];

const socialPlatformOptions: { label: string; Icon: IconType }[] = [
  { label: "Instagram", Icon: FaInstagram },
  { label: "YouTube", Icon: FaYoutube },
  { label: "X / Twitter", Icon: FaXTwitter },
  { label: "LinkedIn", Icon: FaLinkedinIn },
  { label: "GitHub", Icon: FaGithub },
  { label: "Facebook", Icon: FaFacebookF },
  { label: "TikTok", Icon: FaTiktok },
  { label: "Behance", Icon: FaBehance },
  { label: "Dribbble", Icon: FaDribbble },
  { label: "Website", Icon: FaGlobe },
  { label: "Other", Icon: FaPlus },
];

const designPresets: DesignPreset[] = [
  {
    id: "default",
    name: "Default ANSH",
    description: "Current liquid-electric ANSH style.",
    shellClass: "bg-[linear-gradient(125deg,#2ad9ff_0%,#a26dff_55%,#ff5bcf_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(5,8,18,0.05)_0%,rgba(5,8,18,0.2)_42%,rgba(5,8,18,0.85)_66%,rgba(5,8,18,0.95)_100%)]",
    linkClass: "rounded-full border border-cyan-300/30 bg-[#131826]/85",
    titleClass: "font-sans text-[1.5rem] font-semibold",
    ribbonClass: "bg-gradient-to-r from-[#b983ff] to-[#22deff]",
    ribbonTextClass: "text-[#08101c]",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Magazine-inspired serif look with minimal links.",
    shellClass: "bg-[linear-gradient(140deg,#e9e4da_0%,#c9bec2_40%,#867a84_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(18,14,18,0.03)_0%,rgba(18,14,18,0.18)_45%,rgba(18,14,18,0.8)_72%,rgba(18,14,18,0.95)_100%)]",
    linkClass: "rounded-md border border-white/20 bg-black/35",
    titleClass: "font-display text-[1.55rem] italic font-semibold",
    ribbonClass: "bg-gradient-to-r from-[#f2e8d4] to-[#d2c2af]",
    ribbonTextClass: "text-[#2c2222]",
  },
  {
    id: "cool-neon",
    name: "Cool Neon",
    description: "High-energy cyber neon with glowing links.",
    shellClass: "bg-[linear-gradient(130deg,#00e5ff_0%,#0066ff_40%,#7a00ff_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(0,9,22,0.08)_0%,rgba(0,9,22,0.28)_46%,rgba(0,9,22,0.88)_68%,rgba(0,9,22,0.97)_100%)]",
    linkClass: "rounded-full border border-cyan-200/50 bg-[#06192e]/86 shadow-[0_0_16px_rgba(30,223,255,0.28)]",
    titleClass: "font-sans text-[1.52rem] font-bold tracking-tight",
    ribbonClass: "bg-gradient-to-r from-[#00f0ff] to-[#7a00ff]",
    ribbonTextClass: "text-white",
  },
  {
    id: "glass",
    name: "Glass Aura",
    description: "Soft glassmorphism with frosted components.",
    shellClass: "bg-[linear-gradient(140deg,#9cc9ff_0%,#b6a2ff_45%,#8ef4e5_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(12,18,35,0.06)_0%,rgba(12,18,35,0.24)_45%,rgba(12,18,35,0.78)_70%,rgba(12,18,35,0.92)_100%)]",
    linkClass: "rounded-[0.85rem] border border-white/30 bg-white/12 backdrop-blur-md",
    titleClass: "font-sans text-[1.5rem] font-semibold",
    ribbonClass: "bg-gradient-to-r from-[#d8ebff] to-[#a7d7ff]",
    ribbonTextClass: "text-[#10243d]",
  },
  {
    id: "brutalist",
    name: "Neo Brutalist",
    description: "Bold hard-edged cards with strong contrast.",
    shellClass: "bg-[linear-gradient(135deg,#ffde3d_0%,#ff8a00_48%,#ff3d81_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(10,10,10,0.04)_0%,rgba(10,10,10,0.18)_45%,rgba(10,10,10,0.82)_70%,rgba(10,10,10,0.95)_100%)]",
    linkClass: "rounded-none border-2 border-white/85 bg-black/65",
    titleClass: "font-sans text-[1.5rem] font-extrabold uppercase tracking-tight",
    ribbonClass: "bg-[#ffffff]",
    ribbonTextClass: "text-[#111111]",
  },
  {
    id: "minimal-stack",
    name: "Minimal Stack",
    description: "Clean mono layout with airy spacing.",
    shellClass: "bg-[linear-gradient(135deg,#f2f3f6_0%,#d8dce5_52%,#c2c9d6_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(16,19,28,0.02)_0%,rgba(16,19,28,0.14)_48%,rgba(16,19,28,0.74)_76%,rgba(16,19,28,0.88)_100%)]",
    linkClass: "rounded-md border border-white/25 bg-black/30",
    titleClass: "font-sans text-[1.45rem] font-semibold",
    ribbonClass: "bg-[#f1f4ff]",
    ribbonTextClass: "text-[#1e2431]",
  },
  {
    id: "media-spotlight",
    name: "Media Spotlight",
    description: "Visual-first layout with featured media block.",
    shellClass: "bg-[linear-gradient(135deg,#2f828f_0%,#2b7d87_35%,#1a4f66_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(5,10,18,0.06)_0%,rgba(5,10,18,0.2)_44%,rgba(5,10,18,0.84)_70%,rgba(5,10,18,0.95)_100%)]",
    linkClass: "rounded-xl border border-cyan-200/35 bg-[#0f2330]/84",
    titleClass: "font-sans text-[1.48rem] font-bold",
    ribbonClass: "bg-gradient-to-r from-[#8ce7ff] to-[#4fd2ff]",
    ribbonTextClass: "text-[#062235]",
  },
];

const colorThemePresets: ColorThemePreset[] = [
  {
    id: "aurora",
    name: "Aurora",
    shellClass: "bg-[linear-gradient(125deg,#2ad9ff_0%,#a26dff_55%,#ff5bcf_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(5,8,18,0.05)_0%,rgba(5,8,18,0.2)_42%,rgba(5,8,18,0.85)_66%,rgba(5,8,18,0.95)_100%)]",
    linkClass: "rounded-full border border-cyan-300/30 bg-[#131826]/85",
    ribbonClass: "bg-gradient-to-r from-[#b983ff] to-[#22deff]",
    ribbonTextClass: "text-[#08101c]",
  },
  {
    id: "sunset",
    name: "Sunset",
    shellClass: "bg-[linear-gradient(130deg,#ff9f43_0%,#ff5e62_46%,#d726d1_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(24,9,12,0.08)_0%,rgba(24,9,12,0.25)_46%,rgba(24,9,12,0.86)_70%,rgba(24,9,12,0.96)_100%)]",
    linkClass: "rounded-full border border-orange-200/35 bg-[#2a1318]/82",
    ribbonClass: "bg-gradient-to-r from-[#ffd166] to-[#ff5e62]",
    ribbonTextClass: "text-[#2a1512]",
  },
  {
    id: "emerald",
    name: "Emerald",
    shellClass: "bg-[linear-gradient(128deg,#2ec4b6_0%,#00b894_46%,#00a896_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(8,16,14,0.08)_0%,rgba(8,16,14,0.22)_44%,rgba(8,16,14,0.82)_70%,rgba(8,16,14,0.95)_100%)]",
    linkClass: "rounded-full border border-emerald-200/35 bg-[#102621]/82",
    ribbonClass: "bg-gradient-to-r from-[#b8ffec] to-[#53e3b8]",
    ribbonTextClass: "text-[#08352a]",
  },
  {
    id: "mono",
    name: "Mono",
    shellClass: "bg-[linear-gradient(130deg,#c7ccd5_0%,#9ea7b3_46%,#7f8896_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(17,20,28,0.06)_0%,rgba(17,20,28,0.18)_45%,rgba(17,20,28,0.84)_72%,rgba(17,20,28,0.95)_100%)]",
    linkClass: "rounded-full border border-white/30 bg-black/45",
    ribbonClass: "bg-gradient-to-r from-[#ffffff] to-[#d9e1ee]",
    ribbonTextClass: "text-[#18202d]",
  },
  {
    id: "royal",
    name: "Royal",
    shellClass: "bg-[linear-gradient(128deg,#6a4cff_0%,#4d2cff_44%,#1f145f_100%)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(10,7,24,0.06)_0%,rgba(10,7,24,0.24)_45%,rgba(10,7,24,0.86)_72%,rgba(10,7,24,0.96)_100%)]",
    linkClass: "rounded-full border border-indigo-200/35 bg-[#1d173a]/84",
    ribbonClass: "bg-gradient-to-r from-[#d4c3ff] to-[#7dd3fc]",
    ribbonTextClass: "text-[#1e1456]",
  },
];

const createdCards: CardItem[] = [
  {
    id: "aria",
    name: "Aria Flux",
    handle: "ansh.cards/aria-flux",
    cardSlug: "aria-flux",
    shareUrl: "https://links.anshapps.in/aria/aria-flux",
    status: "Live",
    updatedAt: "Updated 3 min ago",
    links: ["Latest Portfolio", "Github Repository", "Book a Call"],
    cover: "/creator-elena.png",
  },
  {
    id: "elena",
    name: "Elena Vane",
    handle: "ansh.cards/elena-vane",
    cardSlug: "elena-vane",
    shareUrl: "https://links.anshapps.in/elena/elena-vane",
    status: "Live",
    updatedAt: "Updated 1 hour ago",
    links: ["Design Lookbook", "Press Kit", "Contact Studio"],
    cover: "/creator-milo.png",
  },
  {
    id: "milo",
    name: "Milo Chen",
    handle: "ansh.cards/milo-chen",
    cardSlug: "milo-chen",
    shareUrl: "https://links.anshapps.in/milo/milo-chen",
    status: "Draft",
    updatedAt: "Updated yesterday",
    links: ["Gaming Highlights", "Discord", "Merch Store"],
    cover: "/image1.svg",
  },
];

const initialProductCategories: ProductCategory[] = [
  {
    id: "cat-1",
    name: "My Merch",
    enabled: true,
    products: [
      { id: "prod-1", name: "Revival Tee", price: "$49", imageUrl: "/creator-milo.png", enabled: true },
      { id: "prod-2", name: "Signature Cap", price: "$29", imageUrl: "/image1.svg", enabled: true },
      { id: "prod-3", name: "Oversized Hoodie", price: "$79", imageUrl: "/creator-elena.png", enabled: false },
    ],
  },
  {
    id: "cat-2",
    name: "Electronics",
    enabled: false,
    products: [
      { id: "prod-4", name: "Creator Monitor", price: "$399", imageUrl: "/image1.svg", enabled: false },
      { id: "prod-5", name: "Studio Keyboard", price: "$129", imageUrl: "/creator-milo.png", enabled: false },
    ],
  },
];

const supportedCurrencies = ["USD", "INR", "EUR", "GBP", "AED", "SGD", "AUD", "CAD", "JPY", "CHF"].map((code) => ({
  code,
  label: `${code} - ${currencyCodes.code(code)?.currency ?? code}`,
}));

const fileToOptimizedDataUrl = async (file: File): Promise<string> => {
  const imageBitmap = await createImageBitmap(file);
  const maxWidth = 1280;
  const scale = imageBitmap.width > maxWidth ? maxWidth / imageBitmap.width : 1;
  const targetWidth = Math.max(1, Math.round(imageBitmap.width * scale));
  const targetHeight = Math.max(1, Math.round(imageBitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process image.");
  }

  context.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
  imageBitmap.close();
  return canvas.toDataURL("image/webp", 0.82);
};

export default function HomeDashboard() {
  const [isUnsupportedScreen, setIsUnsupportedScreen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [builderSection, setBuilderSection] = useState("Links");
  const [draftTitle, setDraftTitle] = useState("New Creator Card");
  const [draftBio, setDraftBio] = useState("Add your intro to tell visitors what you do and what they should click first.");
  const [draftLinkRows, setDraftLinkRows] = useState<CardLinkRow[]>([
    { id: "link-1", label: "Portfolio", url: "https://ansh.cards/portfolio", enabled: true },
    { id: "link-2", label: "Book a Call", url: "https://cal.com/ansh", enabled: true },
    { id: "link-3", label: "Latest Video", url: "https://youtube.com/", enabled: true },
  ]);
  const [draftDesignId, setDraftDesignId] = useState("default");
  const [defaultThemeId, setDefaultThemeId] = useState("aurora");
  const [showProfilePhoto, setShowProfilePhoto] = useState(true);
  const [showAvatarBadge, setShowAvatarBadge] = useState(true);
  const [showBio, setShowBio] = useState(true);
  const [showSocialChips, setShowSocialChips] = useState(true);
  const [aboutWhatIDo, setAboutWhatIDo] = useState("Digital creator building high-energy identity experiences.");
  const [aboutInterestsInput, setAboutInterestsInput] = useState("UI, Branding, Music, Fashion");
  const [aboutEducation, setAboutEducation] = useState("");
  const [aboutLocation, setAboutLocation] = useState("");
  const [cardSettings, setCardSettings] = useState({
    allowPublic: true,
    allowShare: true,
    allowSearchIndexing: true,
    matureContentWarning: false,
    removeAnshBanner: false,
  });
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([
    { id: "sug-1", title: "Watch My Mind & Me on Apple TV+", type: "Video", imageUrl: "/creator-elena.png", enabled: true },
    { id: "sug-2", title: "Listen to Future Nostalgia", type: "Music", imageUrl: "/creator-milo.png", enabled: true },
    { id: "sug-3", title: "Read The Creative Act", type: "Book", imageUrl: "/image1.svg", enabled: true },
  ]);
  const [profileImageUrl, setProfileImageUrl] = useState("/creator-elena.png");
  const [avatarImageUrl, setAvatarImageUrl] = useState("/digital-avatar.svg");
  const [coverImageUrl, setCoverImageUrl] = useState("/creator-milo.png");
  const [showExitBuilderModal, setShowExitBuilderModal] = useState(false);
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isSelectProductsModalOpen, setIsSelectProductsModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isSocialPlatformMenuOpen, setIsSocialPlatformMenuOpen] = useState(false);
  const [isSelectSocialModalOpen, setIsSelectSocialModalOpen] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);
  const [selectedSavedSocialIds, setSelectedSavedSocialIds] = useState<string[]>([]);
  const [builderSelectedSocialIds, setBuilderSelectedSocialIds] = useState<string[]>([]);
  const [builderSocialVisibility, setBuilderSocialVisibility] = useState<Record<string, boolean>>({});
  const [selectedCatalogProductIds, setSelectedCatalogProductIds] = useState<string[]>([]);
  const [builderSelectedProductIds, setBuilderSelectedProductIds] = useState<string[]>([]);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    linkUrl: "",
    currency: "USD",
    amount: "",
    imageUrl: "",
    imageFileName: "",
    categoryId: "",
    useInLinks: true,
  });
  const [newProductCategoryName, setNewProductCategoryName] = useState("");
  const [builderProductVisibility, setBuilderProductVisibility] = useState<Record<string, boolean>>({});
  const [socialForm, setSocialForm] = useState({
    id: "",
    platform: "Instagram",
    accountName: "",
    customPlatform: "",
    url: "",
    useInCardBuilder: true,
  });
  const queryClient = useQueryClient();
  const toast = useUiStore((state) => state.toast);
  const showToastStore = useUiStore((state) => state.showToast);
  const clearToast = useUiStore((state) => state.clearToast);
  const isProductModalOpen = useUiStore((state) => state.isProductModalOpen);
  const setProductModalOpen = useUiStore((state) => state.setProductModalOpen);

  const showRightPane = isBuilderMode || activeTab === "Dashboard" || (activeTab === "My Links" && !!selectedCardId);
  const { data: productsQueryData, isLoading: isCatalogLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products", { method: "GET" });
      const payload = (await response.json().catch(() => ({}))) as { products?: CatalogProduct[]; message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Could not load products.");
      }
      return payload;
    },
  });

  const catalogProducts = productsQueryData?.products ?? [];
  const { data: categoriesQueryData } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const response = await fetch("/api/product-categories", { method: "GET" });
      const payload = (await response.json().catch(() => ({}))) as { categories?: CatalogCategory[]; message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Could not load categories.");
      }
      return payload;
    },
  });
  const catalogCategories = categoriesQueryData?.categories ?? [];
  const { data: socialQueryData } = useQuery({
    queryKey: ["social-media"],
    queryFn: async () => {
      const response = await fetch("/api/social-media", { method: "GET" });
      const payload = (await response.json().catch(() => ({}))) as { socialLinks?: SavedSocialLink[]; message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Could not load social links.");
      }
      return payload;
    },
  });
  const savedSocialLinks = socialQueryData?.socialLinks ?? [];
  const { data: cardsQueryData } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const response = await fetch("/api/cards", { method: "GET" });
      const payload = (await response.json().catch(() => ({}))) as {
        cards?: StoredCard[];
        handle?: string;
        shareBaseUrl?: string;
        message?: string;
      };
      if (!response.ok) {
        throw new Error(payload.message ?? "Could not load cards.");
      }
      return payload;
    },
  });
  const handleSlug = cardsQueryData?.handle ?? "new-creator";
  const shareBaseUrl = cardsQueryData?.shareBaseUrl ?? "https://links.anshapps.in";
  const draftHandle = `links.anshapps.in/${handleSlug}`;
  const createdCards = useMemo<CardItem[]>(
    () =>
      (cardsQueryData?.cards ?? []).map((card) => {
        const enabledLinks = (card.links ?? []).filter((item) => item?.enabled !== false);
        return {
          id: card.id,
          name: card.title,
          handle: draftHandle,
          cardSlug: card.cardSlug,
          shareUrl: `${shareBaseUrl}/${handleSlug}/${card.cardSlug}`,
          status: card.isLive ? "Live" : "Draft",
          updatedAt: `Updated ${new Date(card.updatedAt).toLocaleDateString()}`,
          links: enabledLinks.map((item) => item.label?.trim() || "Untitled link"),
          cover: card.coverImageUrl || "/image1.svg",
        };
      }),
    [cardsQueryData?.cards, handleSlug, draftHandle, shareBaseUrl],
  );
  const selectedCard = useMemo(
    () => createdCards.find((card) => card.id === selectedCardId) ?? null,
    [createdCards, selectedCardId],
  );
  const selectedStoredCard = useMemo(
    () => (cardsQueryData?.cards ?? []).find((card) => card.id === selectedCardId) ?? null,
    [cardsQueryData?.cards, selectedCardId],
  );
  const { data: coverPresetsQueryData } = useQuery({
    queryKey: ["cover-presets"],
    queryFn: async () => {
      const response = await fetch("/api/cover-presets", { method: "GET" });
      const payload = (await response.json().catch(() => ({}))) as { presets?: CoverPreset[]; message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Could not load cover presets.");
      }
      return payload;
    },
  });
  const coverImagePresets = coverPresetsQueryData?.presets ?? [];

  const catalogProductsForPreview = useMemo(
    () =>
      catalogProducts
        .filter((item) => builderSelectedProductIds.includes(item.id))
        .filter((item) => builderProductVisibility[item.id] ?? true)
        .map((item) => ({
          category: item.category.name,
          name: item.name,
          price: `${item.currency} ${item.amount.toFixed(2)}`,
          imageUrl: item.imageUrl || "/image1.svg",
        })),
    [builderProductVisibility, builderSelectedProductIds, catalogProducts],
  );
  const selectableProducts = useMemo(
    () => catalogProducts.filter((item) => item.useInLinks),
    [catalogProducts],
  );
  const builderSelectedProducts = useMemo(
    () => catalogProducts.filter((item) => builderSelectedProductIds.includes(item.id)),
    [builderSelectedProductIds, catalogProducts],
  );
  const rightPaneMode: "dashboard" | "my-links" | "builder" | null = isBuilderMode
    ? "builder"
    : activeTab === "Dashboard"
      ? "dashboard"
      : activeTab === "My Links" && selectedCard
        ? "my-links"
        : null;

  useEffect(() => {
    const updateScreenState = () => {
      setIsUnsupportedScreen(window.innerWidth < 1250);
    };
    updateScreenState();
    window.addEventListener("resize", updateScreenState);
    return () => window.removeEventListener("resize", updateScreenState);
  }, []);

  useEffect(() => {
    if (!selectedStoredCard || activeTab !== "My Links") return;

    const links = Array.isArray(selectedStoredCard.links)
      ? selectedStoredCard.links.map((item, index) => ({
          id: `saved-link-${index + 1}`,
          label: item.label || "",
          url: item.url || "",
          enabled: item.enabled !== false,
        }))
      : [];
    const aboutInterests = Array.isArray(selectedStoredCard.aboutInterests)
      ? selectedStoredCard.aboutInterests.filter((item): item is string => typeof item === "string")
      : [];
    const selectedProductIds = Array.isArray(selectedStoredCard.selectedProductIds)
      ? selectedStoredCard.selectedProductIds.filter((item): item is string => typeof item === "string")
      : [];
    const selectedSocialIds = Array.isArray(selectedStoredCard.selectedSocialIds)
      ? selectedStoredCard.selectedSocialIds.filter((item): item is string => typeof item === "string")
      : [];
    const productVisibility =
      selectedStoredCard.productVisibility && typeof selectedStoredCard.productVisibility === "object"
        ? (selectedStoredCard.productVisibility as Record<string, boolean>)
        : {};
    const socialVisibility =
      selectedStoredCard.socialVisibility && typeof selectedStoredCard.socialVisibility === "object"
        ? (selectedStoredCard.socialVisibility as Record<string, boolean>)
        : {};
    const settings =
      selectedStoredCard.settings && typeof selectedStoredCard.settings === "object"
        ? (selectedStoredCard.settings as Partial<typeof cardSettings>)
        : {};

    setDraftTitle(selectedStoredCard.title || "New Creator Card");
    setDraftBio(selectedStoredCard.bio || "");
    setProfileImageUrl(selectedStoredCard.profileImageUrl || "/creator-elena.png");
    setCoverImageUrl(selectedStoredCard.coverImageUrl || "/image1.svg");
    setDraftDesignId(selectedStoredCard.designId || "default");
    setDefaultThemeId(selectedStoredCard.defaultThemeId || "aurora");
    setShowProfilePhoto(selectedStoredCard.showProfilePhoto ?? true);
    setShowAvatarBadge(selectedStoredCard.showAvatarBadge ?? true);
    setShowBio(selectedStoredCard.showBio ?? true);
    setShowSocialChips(selectedStoredCard.showSocialChips ?? true);
    setAboutWhatIDo(selectedStoredCard.aboutWhatIDo || "");
    setAboutInterestsInput(aboutInterests.join(", "));
    setAboutEducation(selectedStoredCard.aboutEducation || "");
    setAboutLocation(selectedStoredCard.aboutLocation || "");
    setDraftLinkRows(
      links.length
        ? links
        : [{ id: "saved-link-1", label: "Portfolio", url: "", enabled: true }],
    );
    setBuilderSelectedProductIds(selectedProductIds);
    setBuilderProductVisibility(productVisibility);
    setBuilderSelectedSocialIds(selectedSocialIds);
    setBuilderSocialVisibility(socialVisibility);
    setCardSettings({
      allowPublic: settings.allowPublic ?? true,
      allowShare: settings.allowShare ?? true,
      allowSearchIndexing: settings.allowSearchIndexing ?? true,
      matureContentWarning: settings.matureContentWarning ?? false,
      removeAnshBanner: settings.removeAnshBanner ?? false,
    });
  }, [activeTab, selectedStoredCard]);

  const handleExitBuilder = () => {
    setShowExitBuilderModal(true);
  };

  const showToast = (type: "success" | "error", message: string) => {
    showToastStore({ type, message });
    setTimeout(() => {
      clearToast();
    }, 3000);
  };
  const handleShareCard = async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("success", "Share link copied.");
    } catch {
      showToast("error", "Could not copy share link.");
    }
  };

  const createProductMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      description: string;
      linkUrl: string;
      currency: string;
      amount: number;
      imageUrl: string;
      categoryId: string;
      useInLinks: boolean;
    }) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody = (await response.json().catch(() => ({}))) as {
        message?: string;
        product?: CatalogProduct;
      };

      if (!response.ok) {
        throw new Error(responseBody.message ?? "Could not create product.");
      }

      return responseBody;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const createCardMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      bio: string;
      profileImageUrl: string;
      coverImageUrl: string;
      designId: string;
      defaultThemeId: string;
      showProfilePhoto: boolean;
      showAvatarBadge: boolean;
      showBio: boolean;
      showSocialChips: boolean;
      aboutWhatIDo: string;
      aboutInterests: string[];
      aboutEducation: string;
      aboutLocation: string;
      links: CardLinkRow[];
      selectedProductIds: string[];
      productVisibility: Record<string, boolean>;
      selectedSocialIds: string[];
      socialVisibility: Record<string, boolean>;
      settings: typeof cardSettings;
      isLive: boolean;
    }) => {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const payloadJson = (await response.json().catch(() => ({}))) as { card?: { id: string }; message?: string };
      if (!response.ok || !payloadJson.card) {
        throw new Error(payloadJson.message ?? "Could not create card.");
      }
      return payloadJson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
  const updateCardLiveMutation = useMutation({
    mutationFn: async (payload: { id: string; isLive: boolean }) => {
      const response = await fetch("/api/cards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const payloadJson = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        throw new Error(payloadJson.message ?? "Could not update card live status.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
  const handleSaveCard = async (isLive: boolean) => {
    try {
      const response = await createCardMutation.mutateAsync({
        title: draftTitle,
        bio: draftBio,
        profileImageUrl,
        coverImageUrl,
        designId: draftDesignId,
        defaultThemeId,
        showProfilePhoto,
        showAvatarBadge,
        showBio,
        showSocialChips,
        aboutWhatIDo,
        aboutInterests: aboutInterestsInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        aboutEducation,
        aboutLocation,
        links: draftLinkRows,
        selectedProductIds: builderSelectedProductIds,
        productVisibility: builderProductVisibility,
        selectedSocialIds: builderSelectedSocialIds,
        socialVisibility: builderSocialVisibility,
        settings: cardSettings,
        isLive,
      });
      if (!response.card?.id) {
        throw new Error("Card was created but response is incomplete.");
      }
      showToast("success", isLive ? "Card saved and set live." : "Card saved as draft.");
      setIsBuilderMode(false);
      setBuilderSection("Links");
      setSelectedCardId(response.card.id);
      setActiveTab("My Links");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not save card.");
    }
  };

  const createCategoryMutation = useMutation({
    mutationFn: async (payload: { name: string }) => {
      const response = await fetch("/api/product-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseBody = (await response.json().catch(() => ({}))) as {
        message?: string;
        category?: CatalogCategory;
      };
      if (!response.ok) {
        throw new Error(responseBody.message ?? "Could not create category.");
      }
      return responseBody;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
  const createSocialMutation = useMutation({
    mutationFn: async (payload: {
      id?: string;
      platform: string;
      accountName: string;
      customPlatform: string;
      url: string;
      useInCardBuilder: boolean;
    }) => {
      const isUpdate = Boolean(payload.id);
      const response = await fetch("/api/social-media", {
        method: isUpdate ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseBody = (await response.json().catch(() => ({}))) as {
        message?: string;
        socialLink?: SavedSocialLink;
      };
      if (!response.ok) {
        throw new Error(responseBody.message ?? "Could not save social media.");
      }
      return responseBody;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-media"] });
    },
  });

  const confirmExitBuilder = () => {
    setShowExitBuilderModal(false);
    setIsBuilderMode(false);
    setBuilderSection("Links");
  };

  const handleCreateProduct = async () => {
    if (isProductSubmitting) return;

    if (!productForm.name.trim()) {
      showToast("error", "Product name is required.");
      return;
    }

    if (!productForm.amount || Number(productForm.amount) <= 0) {
      showToast("error", "Amount must be greater than 0.");
      return;
    }
    if (!productForm.categoryId) {
      showToast("error", "Please select a product category.");
      return;
    }

    try {
      setIsProductSubmitting(true);
      await createProductMutation.mutateAsync({
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        linkUrl: productForm.linkUrl.trim(),
        currency: productForm.currency,
        amount: Number(productForm.amount),
        imageUrl: productForm.imageUrl.trim(),
        categoryId: productForm.categoryId,
        useInLinks: productForm.useInLinks,
      });

      setProductForm({
        name: "",
        description: "",
        linkUrl: "",
        currency: "USD",
        amount: "",
        imageUrl: "",
        imageFileName: "",
        categoryId: catalogCategories[0]?.id ?? "",
        useInLinks: true,
      });
      setProductModalOpen(false);
      showToast("success", "Product added successfully.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not create product.");
    } finally {
      setIsProductSubmitting(false);
    }
  };

  const handleCreateCategory = async () => {
    const trimmedName = newProductCategoryName.trim();
    if (!trimmedName) {
      showToast("error", "Category name is required.");
      return;
    }
    try {
      setIsCategorySubmitting(true);
      const response = await createCategoryMutation.mutateAsync({ name: trimmedName });
      if (response.category) {
        setProductForm((prev) => ({ ...prev, categoryId: response.category!.id }));
      }
      setNewProductCategoryName("");
      showToast("success", "Category created.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not create category.");
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleAddSelectedProductsToBuilder = () => {
    setBuilderSelectedProductIds((prev) => Array.from(new Set([...prev, ...selectedCatalogProductIds])));
    setSelectedCatalogProductIds([]);
    setIsSelectProductsModalOpen(false);
    showToast("success", "Selected products added to your list.");
  };

  const handleSaveSocial = async () => {
    const platform = socialForm.platform.trim();
    const url = socialForm.url.trim();
    if (!platform) {
      showToast("error", "Please select a platform.");
      return;
    }
    if (platform === "Other" && !socialForm.customPlatform.trim()) {
      showToast("error", "Please add custom platform name.");
      return;
    }
    if (!url) {
      showToast("error", "Please add social profile link.");
      return;
    }
    try {
      setIsSocialSubmitting(true);
      const result = await createSocialMutation.mutateAsync({
        id: socialForm.id || undefined,
        platform,
        accountName: socialForm.accountName.trim(),
        customPlatform: socialForm.customPlatform.trim(),
        url,
        useInCardBuilder: socialForm.useInCardBuilder,
      });
      if (result.socialLink?.useInCardBuilder) {
        setBuilderSelectedSocialIds((prev) => Array.from(new Set([...prev, result.socialLink!.id])));
      }
      setSocialForm({
        id: "",
        platform: "Instagram",
        accountName: "",
        customPlatform: "",
        url: "",
        useInCardBuilder: true,
      });
      setIsSocialModalOpen(false);
      showToast("success", "Social media saved.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Could not save social media.");
    } finally {
      setIsSocialSubmitting(false);
    }
  };

  const handleAddSelectedSocialsToBuilder = () => {
    setBuilderSelectedSocialIds((prev) => Array.from(new Set([...prev, ...selectedSavedSocialIds])));
    setSelectedSavedSocialIds([]);
    setIsSelectSocialModalOpen(false);
    showToast("success", "Selected social media added to your list.");
  };

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const getSocialOption = (platform: string) => socialPlatformOptions.find((opt) => opt.label === platform) ?? socialPlatformOptions[0];
  const selectedDesign = useMemo(
    () => designPresets.find((preset) => preset.id === draftDesignId) ?? designPresets[0],
    [draftDesignId],
  );
  const selectedDefaultTheme = useMemo(
    () => colorThemePresets.find((theme) => theme.id === defaultThemeId) ?? colorThemePresets[0],
    [defaultThemeId],
  );
  const resolvedDesign = useMemo(() => {
    return {
      ...selectedDesign,
      shellClass: selectedDefaultTheme.shellClass,
      overlayClass: selectedDefaultTheme.overlayClass,
      linkClass: selectedDefaultTheme.linkClass,
      ribbonClass: selectedDefaultTheme.ribbonClass,
      ribbonTextClass: selectedDefaultTheme.ribbonTextClass,
    };
  }, [selectedDefaultTheme, selectedDesign]);
  const enabledProductsForPreview = useMemo(() => [...catalogProductsForPreview], [catalogProductsForPreview]);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    mediaType: "profile" | "cover",
    setUrl: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (mediaType === "profile") setIsProfileUploading(true);
      if (mediaType === "cover") setIsCoverUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("mediaType", mediaType);
      formData.append("cardId", selectedCardId || "draft");

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string; url?: string };

      if (!response.ok || !payload.url) {
        showToast("error", payload.message ?? "Could not upload image.");
        return;
      }

      setUrl(payload.url);
      showToast("success", `${mediaType === "profile" ? "Profile" : "Cover"} image uploaded.`);
    } finally {
      if (mediaType === "profile") setIsProfileUploading(false);
      if (mediaType === "cover") setIsCoverUploading(false);
    }
  };

  const ProductCarousel = ({ products, idPrefix }: { products: PreviewProduct[]; idPrefix: string }) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const scrollByAmount = (direction: "left" | "right") => {
      const track = trackRef.current;
      if (!track) return;
      const amount = 180;
      track.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
      <div className="mt-2">
        <div className="relative">
          <button
            type="button"
            aria-label={`scroll-left-${idPrefix}`}
            onClick={() => scrollByAmount("left")}
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-[#0b0f18]/90 px-2 py-1 text-xs text-white/85 shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={`scroll-right-${idPrefix}`}
            onClick={() => scrollByAmount("right")}
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-[#0b0f18]/90 px-2 py-1 text-xs text-white/85 shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
          >
            ›
          </button>

          <div ref={trackRef} className="scrollbar-hidden flex gap-2.5 overflow-x-auto overflow-y-hidden pb-1 pl-8 pr-8">
            {products.map((product, idx) => (
              <div key={`${idPrefix}-product-${idx}`} className="w-[140px] shrink-0 rounded-md border border-white/18 bg-black/35 p-1.5">
                <div className="h-20 rounded-sm bg-cover bg-center" style={{ backgroundImage: `url('${product.imageUrl}')` }} />
                <p className="mt-1.5 line-clamp-1 text-[0.66rem] font-semibold text-white/90">{product.name}</p>
                <p className="text-[0.62rem] text-cyan-200">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const enabledLinks = draftLinkRows.filter((item) => item.enabled);
  const enabledSocials = savedSocialLinks
    .filter((row) => builderSelectedSocialIds.includes(row.id))
    .filter((row) => builderSocialVisibility[row.id] ?? true)
    .map((row) => ({
      id: row.id,
      platform: row.platform,
      enabled: true,
      url: row.url,
      customPlatform: row.customPlatform ?? "",
    }));
  const aboutInterests = aboutInterestsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const renderBuilderLayout = () => {
    const aboutContainerClass =
      draftDesignId === "brutalist"
        ? "mt-5 rounded-none border-2 border-white/80 bg-black/45 p-3.5"
        : draftDesignId === "editorial"
          ? "mt-5 rounded-md border border-white/20 bg-black/25 p-4"
          : draftDesignId === "glass"
            ? "mt-5 rounded-[1rem] border border-white/28 bg-white/10 p-3.5 backdrop-blur-md"
            : draftDesignId === "cool-neon"
              ? "mt-5 rounded-[1rem] border border-cyan-300/30 bg-[#071426]/70 p-3.5 shadow-[0_0_16px_rgba(34,222,255,0.2)]"
              : draftDesignId === "minimal-stack"
                ? "mt-5 rounded-md border border-white/14 bg-black/22 p-3.5"
                : draftDesignId === "media-spotlight"
                  ? "mt-5 rounded-xl border border-cyan-200/25 bg-[#0d1a26]/70 p-3.5"
                  : "mt-5 rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(12,16,27,0.6),rgba(8,11,20,0.72))] p-3.5";
    const aboutTextClass =
      draftDesignId === "editorial" ? "text-[0.9rem] leading-relaxed text-white/82 italic" : "text-[0.88rem] leading-relaxed text-white/75";
    const aboutTagClass =
      draftDesignId === "brutalist"
        ? "rounded-none border border-white/75 bg-black/30 px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.09em] text-white"
        : draftDesignId === "editorial"
          ? "rounded-sm border border-white/24 bg-white/10 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.09em] text-white/90"
          : "rounded-full border border-white/12 bg-[linear-gradient(90deg,rgba(185,131,255,0.18),rgba(34,222,255,0.14))] px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.09em] text-white/88";
    const metaChipClass =
      draftDesignId === "brutalist"
        ? "inline-flex items-center gap-1.5 rounded-none border border-white/75 bg-black/35 px-3 py-1.5 text-[0.68rem] font-semibold text-white"
        : "inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[0.68rem] font-semibold text-white/82";
    const suggestionContainerClass =
      draftDesignId === "brutalist"
        ? "mt-5 rounded-none border-2 border-white/80 bg-black/42 p-3.5"
        : draftDesignId === "editorial"
          ? "mt-5 rounded-md border border-white/20 bg-black/25 p-4"
          : draftDesignId === "glass"
            ? "mt-5 rounded-[1rem] border border-white/28 bg-white/10 p-3.5 backdrop-blur-md"
            : draftDesignId === "cool-neon"
              ? "mt-5 rounded-[1rem] border border-cyan-300/30 bg-[#071426]/70 p-3.5 shadow-[0_0_16px_rgba(34,222,255,0.2)]"
              : draftDesignId === "minimal-stack"
                ? "mt-5 rounded-md border border-white/14 bg-black/22 p-3.5"
                : draftDesignId === "media-spotlight"
                  ? "mt-5 rounded-xl border border-cyan-200/25 bg-[#0d1a26]/70 p-3.5"
                  : "mt-5 rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(12,16,27,0.56),rgba(8,11,20,0.68))] p-3.5";
    const suggestionRowClass =
      draftDesignId === "brutalist"
        ? "flex items-center gap-2 rounded-none border border-white/70 bg-black/30 p-2"
        : "flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.05] p-2";

    const quickLinksBlock = (
      <>
        <p className="mt-5 text-[0.58rem] font-bold uppercase tracking-[0.17em] text-white/55">Quick Links</p>
        <div className="mt-2.5 space-y-2.5">
          {enabledLinks.map((item, idx) => (
            <div key={`preview-builder-link-${item.id}`} className={`flex items-center justify-between px-3 py-2.5 text-sm text-white/86 ${resolvedDesign.linkClass}`} title={item.url}>
              {item.label || `Link ${idx + 1}`}
              <span className="text-white/40">›</span>
            </div>
          ))}
        </div>
      </>
    );

    const socialBlock =
      showSocialChips && enabledSocials.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {enabledSocials.map((row) => {
            const platformOption = getSocialOption(row.platform);
            return (
              <span key={`preview-social-${row.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.64rem] font-semibold text-white/85">
                <platformOption.Icon className="text-[0.68rem]" />
                {row.platform === "Other" ? row.customPlatform || "Other" : row.platform}
              </span>
            );
          })}
        </div>
      ) : null;

    const productsBlock =
      enabledProductsForPreview.length ? (
        <div className="mt-5">
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.17em] text-white/55">Products</p>
          <ProductCarousel products={enabledProductsForPreview} idPrefix="builder" />
        </div>
      ) : null;

    const settingsInfoBlock = (
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-semibold ${cardSettings.allowPublic ? "bg-emerald-400/15 text-emerald-200" : "bg-red-400/15 text-red-200"}`}>
          {cardSettings.allowPublic ? "Public" : "Private"}
        </span>
        {cardSettings.allowShare ? (
          <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[0.62rem] font-semibold text-cyan-200">Share Enabled</span>
        ) : null}
        {cardSettings.matureContentWarning ? (
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[0.62rem] font-semibold text-amber-200">18+ Warning</span>
        ) : null}
      </div>
    );

    const aboutYouBlock =
      aboutWhatIDo || aboutInterests.length || aboutEducation || aboutLocation ? (
        <div className={aboutContainerClass}>
          {aboutWhatIDo ? <p className={aboutTextClass}>{aboutWhatIDo}</p> : null}

          {aboutInterests.length ? (
            <div className="mt-3.5 flex flex-wrap gap-2">
              {aboutInterests.map((tag, idx) => (
                <span
                  key={`interest-${idx}`}
                  className={aboutTagClass}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {(aboutEducation || aboutLocation) ? (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {aboutEducation ? (
                <span className={metaChipClass}>
                  <FaGraduationCap className="text-cyan-300/90" />
                  {aboutEducation}
                </span>
              ) : null}
              {aboutLocation ? (
                <span className={metaChipClass}>
                  <FaLocationDot className="text-[#f472d0]" />
                  {aboutLocation}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null;

    const mySuggestionsBlock =
      suggestions.some((item) => item.enabled) ? (
        <div className={suggestionContainerClass}>
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/60">My Suggestions</p>
          <div className="mt-2.5 space-y-2">
            {suggestions
              .filter((item) => item.enabled)
              .map((item) => (
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

    if (draftDesignId === "editorial") {
      return (
        <div className="relative bg-black/30 p-5 backdrop-blur-sm">
          <div className="text-center">
            {showProfilePhoto ? <div className="mx-auto h-14 w-14 rounded-full border border-white/35 bg-cover bg-center" style={{ backgroundImage: `url('${profileImageUrl}')` }} /> : null}
            <h2 className={`mt-3 ${resolvedDesign.titleClass}`}>{draftTitle || "New Creator Card"}</h2>
            <p className="text-sm text-cyan-200/90">@{draftHandle.replace("ansh.cards/", "")}</p>
            {showBio ? <p className="mx-auto mt-2.5 max-w-[280px] text-xs text-white/75">{draftBio}</p> : null}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5">{enabledLinks.slice(0, 4).map((item) => <div key={`ed-${item.id}`} className={`px-3 py-3 text-sm ${resolvedDesign.linkClass}`}>{item.label}</div>)}</div>
          {socialBlock}
          {aboutYouBlock}
          {mySuggestionsBlock}
          {productsBlock}
          {settingsInfoBlock}
        </div>
      );
    }

    if (draftDesignId === "minimal-stack") {
      return (
        <div className="relative bg-black/25 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {showProfilePhoto ? <div className="h-10 w-10 rounded-full border border-white/35 bg-cover bg-center" style={{ backgroundImage: `url('${profileImageUrl}')` }} /> : null}
            <div className="min-w-0">
              <h2 className={`truncate leading-none ${resolvedDesign.titleClass}`}>{draftTitle || "New Creator Card"}</h2>
              <p className="mt-1 text-xs text-white/70">@{draftHandle.replace("ansh.cards/", "")}</p>
            </div>
          </div>
          {showBio ? <p className="mt-3.5 text-xs text-white/70">{draftBio}</p> : null}
          {quickLinksBlock}
          {aboutYouBlock}
          {mySuggestionsBlock}
          {productsBlock}
          {settingsInfoBlock}
        </div>
      );
    }

    if (draftDesignId === "media-spotlight") {
      return (
        <div className="relative bg-black/36 p-5 backdrop-blur-sm">
          <div className="rounded-lg border border-white/18 bg-black/30 p-3">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/60">Featured</p>
            <div className="mt-2 h-24 rounded-md bg-cover bg-center" style={{ backgroundImage: `url('${coverImageUrl}')` }} />
          </div>
          <div className="mt-4.5 flex items-start gap-3">
            {showProfilePhoto ? <div className="h-11 w-11 rounded-full border border-white/35 bg-cover bg-center" style={{ backgroundImage: `url('${profileImageUrl}')` }} /> : null}
            <div className="min-w-0 flex-1">
              <h2 className={`truncate leading-none ${resolvedDesign.titleClass}`}>{draftTitle || "New Creator Card"}</h2>
              <p className="mt-1 text-sm text-cyan-200/90">@{draftHandle.replace("ansh.cards/", "")}</p>
            </div>
          </div>
          {quickLinksBlock}
          {aboutYouBlock}
          {mySuggestionsBlock}
          {productsBlock}
          {settingsInfoBlock}
        </div>
      );
    }

    if (draftDesignId === "brutalist") {
      return (
        <div className="relative bg-black/55 p-5">
          <div className="border-2 border-white bg-black/40 p-3">
            <h2 className={`leading-none ${resolvedDesign.titleClass}`}>{draftTitle || "New Creator Card"}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/70">@{draftHandle.replace("ansh.cards/", "")}</p>
          </div>
          {showBio ? <p className="mt-3.5 border border-white/35 bg-black/25 p-2.5 text-xs text-white/78">{draftBio}</p> : null}
          {quickLinksBlock}
          {aboutYouBlock}
          {mySuggestionsBlock}
          {productsBlock}
          {settingsInfoBlock}
        </div>
      );
    }

    if (draftDesignId === "glass") {
      return (
        <div className="relative bg-black/24 p-5 backdrop-blur-sm">
          <div className="rounded-xl border border-white/35 bg-white/12 p-3">
            <div className="flex items-center gap-3">
              {showProfilePhoto ? <div className="h-11 w-11 rounded-full border border-white/40 bg-cover bg-center" style={{ backgroundImage: `url('${profileImageUrl}')` }} /> : null}
              <div className="min-w-0 flex-1">
                <h2 className={`truncate leading-none ${resolvedDesign.titleClass}`}>{draftTitle || "New Creator Card"}</h2>
                <p className="mt-1 text-xs text-white/80">@{draftHandle.replace("ansh.cards/", "")}</p>
              </div>
            </div>
          </div>
          {quickLinksBlock}
          {socialBlock}
          {aboutYouBlock}
          {mySuggestionsBlock}
          {productsBlock}
          {settingsInfoBlock}
        </div>
      );
    }

    if (draftDesignId === "cool-neon") {
      return (
        <div className="relative bg-[#060d1e]/58 p-5 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className={`truncate leading-none ${resolvedDesign.titleClass}`}>{draftTitle || "New Creator Card"}</h2>
              <p className="mt-1 text-sm text-cyan-300/90">@{draftHandle.replace("ansh.cards/", "")}</p>
            </div>
            {showAvatarBadge ? <div className="h-10 w-10 rounded-full border border-cyan-200/45 bg-cover bg-center shadow-[0_0_14px_rgba(34,222,255,0.3)]" style={{ backgroundImage: `url('${avatarImageUrl}')` }} /> : null}
          </div>
          {quickLinksBlock}
          {socialBlock}
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
          {showProfilePhoto ? <div className="h-11 w-11 rounded-full border border-white/35 bg-cover bg-center" style={{ backgroundImage: `url('${profileImageUrl}')` }} /> : null}
          <div className="min-w-0 flex-1">
            <h2 className={`truncate leading-none ${resolvedDesign.titleClass}`}>{draftTitle || "New Creator Card"}</h2>
            <p className="mt-1 text-sm text-cyan-300/90">@{draftHandle.replace("ansh.cards/", "")}</p>
          </div>
          {showAvatarBadge ? <div className="h-9 w-9 rounded-full border border-white/30 bg-cover bg-center" style={{ backgroundImage: `url('${avatarImageUrl}')` }} /> : null}
        </div>
        {showBio ? <p className="mt-2.5 text-xs text-white/75">{draftBio}</p> : null}
        {quickLinksBlock}
        {socialBlock}
        {aboutYouBlock}
        {mySuggestionsBlock}
        {productsBlock}
        {settingsInfoBlock}
      </div>
    );
  };

  const openPreviewPage = (payload: PreviewPayload) => {
    localStorage.setItem("ansh-live-preview", JSON.stringify(payload));
    window.open("/home/preview", "_blank");
  };

  if (isUnsupportedScreen) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#060810] px-6 text-white">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl font-semibold">
            Sorry We are currently not available for this screen size please check on other devices
          </h1>
          <p className="mt-4 text-lg text-white/70">
            For mobile mobile screen our app is in development phase
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={`relative bg-[#060810] text-white ${isBuilderMode ? "h-screen overflow-hidden" : "min-h-screen overflow-hidden"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(62%_44%_at_52%_54%,rgba(0,228,255,0.22),transparent_72%),radial-gradient(58%_52%_at_95%_84%,rgba(154,90,255,0.2),transparent_75%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,20,0.9),rgba(4,6,11,0.95))]" />

      <section
        className={`relative z-10 grid w-full grid-cols-1 ${
          isBuilderMode ? "h-full overflow-hidden" : "min-h-screen"
        } ${
          showRightPane ? "lg:grid-cols-[230px_minmax(0,1fr)_430px]" : "lg:grid-cols-[230px_minmax(0,1fr)]"
        }`}
      >
        <aside className="flex flex-col border-r border-white/8 bg-gradient-to-b from-[#131726]/92 to-[#0d1019]/90 px-6 py-8 backdrop-blur-xl">
          {isBuilderMode ? (
            <>
              <div>
                <button
                  type="button"
                  onClick={handleExitBuilder}
                  className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:text-white"
                >
                  <span>←</span>
                  Back
                </button>
                <p className="mt-5 font-display text-[1.35rem] font-bold uppercase tracking-tight text-white">Card Builder</p>
                <p className="mt-1 text-[0.63rem] font-bold uppercase tracking-[0.14em] text-white/34">Build In Progress</p>

                <nav className="mt-8 space-y-2">
                  {builderNavItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setBuilderSection(item.label)}
                      className={`w-full rounded-full px-4 py-2.5 text-left text-sm font-semibold transition ${
                        item.label === builderSection
                          ? "border border-cyan-300/35 bg-gradient-to-r from-[#303356] to-[#143747] text-white"
                          : "text-white/45 hover:bg-white/5 hover:text-white/75"
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <item.Icon className={`h-4 w-4 ${item.label === builderSection ? "text-cyan-200" : "text-white/45"}`} />
                        {item.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="font-display text-[1.5rem] font-bold uppercase tracking-tight text-white">ANSH Links</p>
                <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/34">Creator Console</p>

                <nav className="mt-8 space-y-2">
                  {primaryNavItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full rounded-full px-4 py-2.5 text-left text-sm font-semibold transition ${
                        item.label === activeTab
                          ? "border border-cyan-300/35 bg-gradient-to-r from-[#303356] to-[#143747] text-white"
                          : "text-white/45 hover:bg-white/5 hover:text-white/75"
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <item.Icon className={`h-4 w-4 ${item.label === activeTab ? "text-cyan-200" : "text-white/45"}`} />
                        {item.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="mt-auto border-t border-white/10 pt-6">
                <nav className="space-y-2">
                  {utilityNavItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full rounded-full px-4 py-2.5 text-left text-sm font-semibold transition ${
                        item.label === activeTab
                          ? "border border-cyan-300/35 bg-gradient-to-r from-[#303356] to-[#143747] text-white"
                          : "text-white/45 hover:bg-white/5 hover:text-white/75"
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <item.Icon className={`h-4 w-4 ${item.label === activeTab ? "text-cyan-200" : "text-white/45"}`} />
                        {item.label}
                      </span>
                    </button>
                  ))}
                </nav>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 w-full rounded-full border border-rose-300/20 bg-rose-500/10 px-4 py-2.5 text-left text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                >
                  <span className="flex items-center gap-3.5">
                    <FaArrowRightFromBracket className="h-4 w-4" />
                    Logout
                  </span>
                </button>
              </div>
            </>
          )}
        </aside>

        <article
          className={`${showRightPane ? "border-r border-white/8" : ""} px-8 py-10 sm:px-12 ${
            isBuilderMode ? "scrollbar-ansh h-full overflow-y-auto" : ""
          }`}
        >
          {isBuilderMode ? (
            <>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">Card Builder</p>
                  <h1 className="mt-3 text-[2.6rem] font-semibold leading-[0.95] tracking-tight">Edit Your New Card</h1>
                  <p className="mt-2 max-w-[620px] text-white/56">
                    Make changes in this editor. Live preview updates instantly on the right side.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleSaveCard(false)}
                    disabled={createCardMutation.isPending}
                    className="rounded-lg border border-white/20 bg-[#1a2134] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#222b43] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {createCardMutation.isPending ? "Saving..." : "Save Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSaveCard(true)}
                    disabled={createCardMutation.isPending}
                    className="rounded-lg bg-gradient-to-r from-[#b781ff] to-[#23deff] px-4 py-2.5 text-sm font-bold text-[#0d1120] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {createCardMutation.isPending ? "Saving..." : "Save Card"}
                  </button>
                </div>
              </header>

              {builderSection === "Links" ? (
                <div className="mt-8 rounded-xl border border-white/10 bg-[#0f1321] p-5">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Profile Info</p>
                  <div className="mt-4 rounded-lg border border-white/10 bg-[#0c101a] p-4">
                    <div className="grid gap-4">
                    <label className="block">
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/50">Handle</span>
                      <input
                        value={draftHandle}
                        readOnly
                        className="mt-2 w-full cursor-not-allowed rounded-md border border-white/12 bg-[#0e1320] px-3 py-2.5 text-white/80 outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/50">Card title</span>
                      <input
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        className="mt-2 w-full rounded-md border border-white/12 bg-[#0c101a] px-3 py-2.5 text-white outline-none focus:border-cyan-300/45"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/50">Bio</span>
                      <textarea
                        value={draftBio}
                        onChange={(e) => setDraftBio(e.target.value)}
                        rows={3}
                        className="mt-2 w-full rounded-md border border-white/12 bg-[#0c101a] px-3 py-2.5 text-white outline-none focus:border-cyan-300/45"
                      />
                    </label>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-white/10 bg-[#0c101a] p-4">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Photos & Cover</p>
                    <div className="mt-3 grid gap-4">
                      <label className="block">
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/50">Profile photo URL</span>
                        <input
                          value={profileImageUrl}
                          onChange={(e) => setProfileImageUrl(e.target.value)}
                          className="mt-2 w-full rounded-md border border-white/12 bg-[#0c101a] px-3 py-2.5 text-white outline-none focus:border-cyan-300/45"
                        />
                        <div className="mt-2">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/12 bg-[#111726] px-3 py-2 text-xs font-semibold text-white/80 transition hover:text-white">
                            <span>Upload Profile Pic</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "profile", setProfileImageUrl)}
                            />
                          </label>
                          {isProfileUploading ? <span className="ml-2 text-xs text-cyan-200/80">Uploading...</span> : null}
                        </div>
                      </label>
                      <label className="block">
                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/50">Cover image URL</span>
                        <input
                          value={coverImageUrl}
                          onChange={(e) => setCoverImageUrl(e.target.value)}
                          className="mt-2 w-full rounded-md border border-white/12 bg-[#0c101a] px-3 py-2.5 text-white outline-none focus:border-cyan-300/45"
                        />
                        <div className="mt-3 grid gap-2 sm:grid-cols-4">
                          {coverImagePresets.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setCoverImageUrl(preset.imageUrl)}
                              className={`overflow-hidden rounded-md border text-left transition ${
                                coverImageUrl === preset.imageUrl ? "border-cyan-300/45" : "border-white/12 hover:border-white/25"
                              }`}
                            >
                              <div className="h-14 bg-cover bg-center" style={{ backgroundImage: `url('${preset.imageUrl}')` }} />
                              <div className="bg-[#101524] px-2 py-1 text-[0.62rem] font-semibold text-white/75">{preset.label}</div>
                            </button>
                          ))}
                        </div>
                        {!coverImagePresets.length ? (
                          <p className="mt-2 text-xs text-white/45">No backend cover presets found in bucket.</p>
                        ) : null}
                        <div className="mt-2">
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/12 bg-[#111726] px-3 py-2 text-xs font-semibold text-white/80 transition hover:text-white">
                            <span>Upload Cover Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "cover", setCoverImageUrl)}
                            />
                          </label>
                          {isCoverUploading ? <span className="ml-2 text-xs text-cyan-200/80">Uploading...</span> : null}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-white/10 bg-[#0c101a] p-4">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Card Elements</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {[
                        { label: "Profile Photo", enabled: showProfilePhoto, setEnabled: setShowProfilePhoto },
                        { label: "Avatar Badge", enabled: showAvatarBadge, setEnabled: setShowAvatarBadge },
                        { label: "Bio", enabled: showBio, setEnabled: setShowBio },
                        { label: "Social Chips", enabled: showSocialChips, setEnabled: setShowSocialChips },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => item.setEnabled(!item.enabled)}
                          className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm transition ${
                            item.enabled
                              ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                              : "border-white/12 bg-[#0c101a] text-white/60"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="text-xs font-bold uppercase">{item.enabled ? "On" : "Off"}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-white/10 bg-[#0c101a] p-4">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Quick Links</p>
                    <div className="mt-3 space-y-3">
                      {draftLinkRows.map((row) => (
                        <div key={row.id} className="grid gap-2 rounded-lg border border-white/10 bg-[#0c101a] p-3 sm:grid-cols-[96px_1fr_1fr]">
                          <button
                            type="button"
                            onClick={() =>
                              setDraftLinkRows((prev) =>
                                prev.map((item) => (item.id === row.id ? { ...item, enabled: !item.enabled } : item)),
                              )
                            }
                            className={`rounded-md border px-2.5 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                              row.enabled
                                ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                                : "border-white/15 bg-white/[0.03] text-white/45"
                            }`}
                          >
                            {row.enabled ? "On" : "Off"}
                          </button>
                          <input
                            value={row.label}
                            onChange={(e) =>
                              setDraftLinkRows((prev) =>
                                prev.map((item) => (item.id === row.id ? { ...item, label: e.target.value } : item)),
                              )
                            }
                            placeholder="Link label"
                            className="rounded-md border border-white/12 bg-[#111726] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/45"
                          />
                          <input
                            value={row.url}
                            onChange={(e) =>
                              setDraftLinkRows((prev) =>
                                prev.map((item) => (item.id === row.id ? { ...item, url: e.target.value } : item)),
                              )
                            }
                            placeholder="Paste URL"
                            className="rounded-md border border-white/12 bg-[#111726] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/45"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setDraftLinkRows((prev) => [
                          ...prev,
                          {
                            id: `link-${prev.length + 1}`,
                            label: `New Link ${prev.length + 1}`,
                            url: "",
                            enabled: true,
                          },
                        ])
                      }
                      className="mt-4 rounded-md border border-dashed border-white/20 bg-white/[0.02] px-3.5 py-2 text-sm font-semibold text-white/75 transition hover:text-white"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>
              ) : builderSection === "Products" ? (
                <div className="mt-8 rounded-xl border border-white/10 bg-[#0f1321] p-5">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Products</p>
                  <p className="mt-2 text-xs text-white/55">
                    Select existing products and toggle which ones should appear in your live preview.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSelectProductsModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08]"
                    >
                      <FaCheck className="h-3.5 w-3.5" />
                      Select Product
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProductForm((prev) => ({
                          ...prev,
                          categoryId: prev.categoryId || catalogCategories[0]?.id || "",
                        }));
                        setProductModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-cyan-300/35 bg-gradient-to-r from-[#27355a] to-[#124054] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <FaPlus className="h-3.5 w-3.5" />
                      Create Product
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {!builderSelectedProducts.length ? (
                      <div className="rounded-lg border border-white/10 bg-[#0c101a] p-4 text-sm text-white/55">
                        No products in your list. Use <span className="font-semibold text-white/80">Select Product</span> to add from catalog.
                      </div>
                    ) : null}
                    {builderSelectedProducts.map((product) => {
                      const enabled = builderProductVisibility[product.id] ?? true;
                      return (
                        <div key={`builder-catalog-product-${product.id}`} className="rounded-lg border border-white/10 bg-[#0c101a] p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{product.name}</p>
                              <p className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-cyan-200/80">{product.category.name}</p>
                              <p className="mt-1 text-xs text-white/55">
                                {product.currency} {product.amount.toFixed(2)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setBuilderProductVisibility((prev) => ({
                                  ...prev,
                                  [product.id]: !(prev[product.id] ?? product.useInLinks),
                                }))
                              }
                              className={`rounded-md border px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                                enabled
                                  ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                                  : "border-white/15 bg-white/[0.03] text-white/45"
                              }`}
                            >
                              {enabled ? "On" : "Off"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : builderSection === "About You" ? (
                <div className="mt-8 rounded-xl border border-white/10 bg-[#0f1321] p-5">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">About You</p>
                  <p className="mt-2 text-xs text-white/55">This section appears above products in the card preview.</p>

                  <div className="mt-4 grid gap-4">
                    <label className="block">
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/55">What I do</span>
                      <textarea
                        value={aboutWhatIDo}
                        onChange={(e) => setAboutWhatIDo(e.target.value)}
                        rows={2}
                        placeholder="Tell visitors what you do"
                        className="mt-2 w-full rounded-md border border-white/12 bg-[#0c101a] px-3 py-2.5 text-white outline-none focus:border-cyan-300/45"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/55">Interests (tags)</span>
                      <input
                        value={aboutInterestsInput}
                        onChange={(e) => setAboutInterestsInput(e.target.value)}
                        placeholder="UI, Branding, AI, Fashion"
                        className="mt-2 w-full rounded-md border border-white/12 bg-[#0c101a] px-3 py-2.5 text-white outline-none focus:border-cyan-300/45"
                      />
                      <p className="mt-1 text-xs text-white/45">Use comma-separated values.</p>
                    </label>

                    <label className="block">
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/55">Education (optional)</span>
                      <input
                        value={aboutEducation}
                        onChange={(e) => setAboutEducation(e.target.value)}
                        placeholder="e.g. B.Des, NID"
                        className="mt-2 w-full rounded-md border border-white/12 bg-[#0c101a] px-3 py-2.5 text-white outline-none focus:border-cyan-300/45"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/55">Location (optional)</span>
                      <input
                        value={aboutLocation}
                        onChange={(e) => setAboutLocation(e.target.value)}
                        placeholder="e.g. Mumbai, India"
                        className="mt-2 w-full rounded-md border border-white/12 bg-[#0c101a] px-3 py-2.5 text-white outline-none focus:border-cyan-300/45"
                      />
                    </label>
                  </div>

                  <p className="mt-6 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">My Suggestions</p>
                  <p className="mt-1 text-xs text-white/55">Recommend videos, music, books, podcasts or anything you vibe with.</p>
                  <div className="mt-3 space-y-3">
                    {suggestions.map((item) => (
                      <div key={item.id} className="grid gap-2 rounded-lg border border-white/10 bg-[#0c101a] p-3 sm:grid-cols-[80px_1fr_110px_1fr]">
                        <button
                          type="button"
                          onClick={() =>
                            setSuggestions((prev) =>
                              prev.map((s) => (s.id === item.id ? { ...s, enabled: !s.enabled } : s)),
                            )
                          }
                          className={`rounded-md border px-2 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                            item.enabled ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/15 bg-white/[0.03] text-white/45"
                          }`}
                        >
                          {item.enabled ? "On" : "Off"}
                        </button>
                        <input
                          value={item.title}
                          onChange={(e) =>
                            setSuggestions((prev) =>
                              prev.map((s) => (s.id === item.id ? { ...s, title: e.target.value } : s)),
                            )
                          }
                          placeholder="Suggestion title"
                          className="rounded-md border border-white/12 bg-[#111726] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/45"
                        />
                        <select
                          value={item.type}
                          onChange={(e) =>
                            setSuggestions((prev) =>
                              prev.map((s) => (s.id === item.id ? { ...s, type: e.target.value as SuggestionItem["type"] } : s)),
                            )
                          }
                          className="rounded-md border border-white/12 bg-[#111726] px-2.5 py-2 text-sm text-white outline-none focus:border-cyan-300/45"
                        >
                          {["Video", "Music", "Book", "Podcast", "Other"].map((type) => (
                            <option key={`${item.id}-${type}`} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <input
                          value={item.imageUrl}
                          onChange={(e) =>
                            setSuggestions((prev) =>
                              prev.map((s) => (s.id === item.id ? { ...s, imageUrl: e.target.value } : s)),
                            )
                          }
                          placeholder="Image URL"
                          className="rounded-md border border-white/12 bg-[#111726] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/45"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSuggestions((prev) => [
                        ...prev,
                        {
                          id: `sug-${Date.now()}`,
                          title: "New Suggestion",
                          type: "Other",
                          imageUrl: "/image1.svg",
                          enabled: true,
                        },
                      ])
                    }
                    className="mt-4 rounded-md border border-dashed border-white/20 bg-white/[0.02] px-3.5 py-2 text-sm font-semibold text-white/75 transition hover:text-white"
                  >
                    + Add Suggestion
                  </button>
                </div>
              ) : builderSection === "Social Media" ? (
                <div className="mt-8 rounded-xl border border-white/10 bg-[#0f1321] p-5">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Social Media</p>
                  <p className="mt-2 text-xs text-white/55">Select saved social media and toggle what you want to show in card preview.</p>
                  <div className="mt-4 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSelectSocialModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08]"
                    >
                      <FaCheck className="h-3.5 w-3.5" />
                      Select Social Media
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSocialForm({
                          id: "",
                          platform: "Instagram",
                          accountName: "",
                          customPlatform: "",
                          url: "",
                          useInCardBuilder: true,
                        });
                        setIsSocialModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-cyan-300/35 bg-gradient-to-r from-[#27355a] to-[#124054] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <FaPlus className="h-3.5 w-3.5" />
                      Add Social Media
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {!builderSelectedSocialIds.length ? (
                      <div className="rounded-lg border border-white/10 bg-[#0c101a] p-4 text-sm text-white/55">
                        No social media in your list. Use <span className="font-semibold text-white/80">Select Social Media</span> to add.
                      </div>
                    ) : null}
                    {savedSocialLinks
                      .filter((item) => builderSelectedSocialIds.includes(item.id))
                      .map((item) => {
                        const enabled = builderSocialVisibility[item.id] ?? true;
                        const displayName = item.platform === "Other" ? item.customPlatform || "Other" : item.platform;
                        return (
                          <div key={`builder-social-${item.id}`} className="rounded-lg border border-white/10 bg-[#0c101a] p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                                <p className="mt-1 truncate text-xs text-white/55">{item.url}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setBuilderSocialVisibility((prev) => ({
                                    ...prev,
                                    [item.id]: !(prev[item.id] ?? true),
                                  }))
                                }
                                className={`rounded-md border px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                                  enabled
                                    ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                                    : "border-white/15 bg-white/[0.03] text-white/45"
                                }`}
                              >
                                {enabled ? "On" : "Off"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : builderSection === "Design" ? (
                <div className="mt-8 rounded-xl border border-white/10 bg-[#0f1321] p-5">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Design Presets</p>
                  <p className="mt-2 text-xs text-white/55">
                    Choose a complete card personality. These presets change typography, link shape, and overall visual treatment.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {designPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setDraftDesignId(preset.id)}
                        className={`overflow-hidden rounded-lg border text-left transition ${
                          draftDesignId === preset.id
                            ? "border-cyan-300/45 bg-[#11243a]"
                            : "border-white/12 bg-[#0b0f19] hover:border-white/25"
                        }`}
                      >
                        <div className={`h-16 ${preset.shellClass}`} />
                        <div className="p-3">
                          <p className="text-sm font-semibold">{preset.name}</p>
                          <p className="mt-1 text-xs text-white/55">{preset.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Color Themes</p>
                    <p className="mt-1 text-xs text-white/55">Applies to whichever layout design is selected above.</p>
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {colorThemePresets.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setDefaultThemeId(theme.id)}
                          className={`overflow-hidden rounded-md border ${defaultThemeId === theme.id ? "border-cyan-300/45" : "border-white/15"}`}
                          title={theme.name}
                        >
                          <div className={`h-8 ${theme.shellClass}`} />
                          <div className="bg-[#101524] px-1 py-1 text-[0.6rem] font-semibold text-white/75">{theme.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : builderSection === "Settings" ? (
                <div className="mt-8 rounded-xl border border-white/10 bg-[#0f1321] p-5">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Card Settings</p>
                  <p className="mt-2 text-xs text-white/55">Control privacy, sharing, discovery, and engagement behavior for this card.</p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {[
                      { key: "allowPublic", label: "Allow Public", desc: "Card can be viewed by anyone with link" },
                      { key: "allowShare", label: "Allow Share", desc: "Enable share/copy actions for visitors" },
                      { key: "allowSearchIndexing", label: "Allow Search Indexing", desc: "Let search engines index this card" },
                      { key: "matureContentWarning", label: "Mature Content Warning", desc: "Show warning before opening card" },
                      { key: "removeAnshBanner", label: "Remove ANSH Banner", desc: "Hide ANSH ribbon from preview card" },
                    ].map((item) => {
                      const enabled = cardSettings[item.key as keyof typeof cardSettings];
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() =>
                            setCardSettings((prev) => ({
                              ...prev,
                              [item.key]: !prev[item.key as keyof typeof prev],
                            }))
                          }
                          className={`rounded-md border p-3 text-left transition ${
                            enabled ? "border-cyan-300/38 bg-cyan-300/12" : "border-white/12 bg-[#0c101a]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white/90">{item.label}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-bold uppercase ${enabled ? "bg-cyan-300/20 text-cyan-200" : "bg-white/10 text-white/55"}`}>
                              {enabled ? "On" : "Off"}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-white/55">{item.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-xl border border-white/10 bg-[#0f1321] p-6">
                  <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">{builderSection}</p>
                  <h2 className="mt-3 text-3xl font-semibold">Section Editor</h2>
                  <p className="mt-2 text-white/56">Controls for this section will be available in the next iteration.</p>
                </div>
              )}
            </>
          ) : activeTab === "Dashboard" ? (
            <>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">Dashboard</p>
                  <h1 className="mt-3 text-[2.8rem] font-semibold leading-[0.95] tracking-tight">Analytics Overview</h1>
                  <p className="mt-2 max-w-[620px] text-white/56">
                    Track visibility, engagement, and card performance to optimize your digital identity.
                  </p>
                </div>
                <button className="rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:text-white">
                  Last 30 Days
                </button>
              </header>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {kpiCards.map((kpi) => (
                  <article key={kpi.label} className="rounded-lg border border-white/10 bg-[#0f1321] p-3.5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/45">{kpi.label}</p>
                    <p className="mt-2 text-2xl font-semibold leading-none">{kpi.value}</p>
                    <p className="mt-2 text-xs font-semibold text-cyan-300">{kpi.delta}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                <article className="rounded-xl border border-white/10 bg-[#0f1321] p-4">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Views vs Clicks Trend</p>
                  <div className="mt-4 grid h-44 grid-cols-12 items-end gap-2">
                    {[45, 52, 58, 62, 56, 67, 73, 70, 76, 82, 79, 88].map((h, idx) => (
                      <div key={`bar-${idx}`} className="rounded-t bg-gradient-to-t from-[#7f58ff] to-[#1fdfff]" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </article>

                <article className="rounded-xl border border-white/10 bg-[#0f1321] p-4">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Traffic Sources</p>
                  <div className="mt-4 space-y-3">
                    {trafficSources.map((source) => (
                      <div key={source.name}>
                        <div className="mb-1 flex items-center justify-between text-xs text-white/70">
                          <span>{source.name}</span>
                          <span>{source.share}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 rounded-full bg-gradient-to-r from-[#ba86ff] to-[#1fdfff]" style={{ width: `${source.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="mt-6 rounded-xl border border-white/10 bg-[#0f1321] p-4">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#21ddff]">Top Performing Cards</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {createdCards.map((card) => (
                    <div key={`top-${card.id}`} className="rounded-lg border border-white/10 bg-[#141a2a] p-3">
                      <p className="text-sm font-semibold">{card.name}</p>
                      <p className="mt-1 text-xs text-white/45">{card.handle}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-white/70">
                        <span>CTR 36.8%</span>
                        <span>2.4k clicks</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : activeTab === "My Links" ? (
            <>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">My Links</p>
                  <h1 className="mt-3 text-[2.8rem] font-semibold leading-[0.95] tracking-tight">Your Created Cards</h1>
                  <p className="mt-2 max-w-[620px] text-white/56">
                    These are your created profile cards. Click any card to open the right-side live preview.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsBuilderMode(true);
                    setBuilderSection("Links");
                    setSelectedCardId(null);
                  }}
                  className="rounded-lg bg-gradient-to-r from-[#b781ff] to-[#23deff] px-4 py-2.5 text-sm font-bold text-[#0d1120] transition hover:brightness-110"
                >
                  + Create New Card
                </button>
              </header>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {createdCards.map((card) => {
                  const isActive = selectedCard?.id === card.id;
                  return (
                    <div
                      key={card.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCardId(card.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedCardId(card.id);
                        }
                      }}
                      className={`group relative aspect-[3/4] overflow-hidden rounded-[1.2rem] border text-left transition ${
                        isActive
                          ? "border-cyan-300/45 bg-[#12253a]/70 shadow-[0_0_0_1px_rgba(22,220,255,0.3)_inset]"
                          : "border-white/10 bg-[#0f1321] hover:border-white/20"
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-105"
                        style={{
                          backgroundImage: `linear-gradient(135deg,rgba(39,217,255,0.38),rgba(162,109,255,0.34),rgba(255,91,207,0.4)), url('${card.cover}')`,
                        }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,18,0.08)_0%,rgba(5,8,18,0.22)_40%,rgba(5,8,18,0.82)_62%,rgba(5,8,18,0.95)_100%)]" />

                      <div className="absolute inset-x-0 top-[52%] h-[48%] backdrop-blur-sm" />

                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[1.03rem] font-semibold">{card.name}</p>
                          <div
                            className="inline-flex rounded-full border border-white/20 bg-black/35 p-0.5"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => updateCardLiveMutation.mutate({ id: card.id, isLive: true })}
                              disabled={updateCardLiveMutation.isPending}
                              className={`rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.09em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                card.status === "Live"
                                  ? "bg-cyan-400/25 text-cyan-100"
                                  : "text-white/55 hover:text-white/80"
                              }`}
                            >
                              Live
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCardLiveMutation.mutate({ id: card.id, isLive: false })}
                              disabled={updateCardLiveMutation.isPending}
                              className={`rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.09em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                card.status === "Draft"
                                  ? "bg-white/20 text-white"
                                  : "text-white/55 hover:text-white/80"
                              }`}
                            >
                              Draft
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 truncate text-sm text-white/70">{card.handle}</p>
                        <p className="mt-2 text-xs text-white/55">{card.updatedAt}</p>

                        <div className="mt-3 space-y-1.5 opacity-75">
                          <div className="h-2.5 w-full rounded-full bg-white/14 blur-[0.2px]" />
                          <div className="h-2.5 w-4/5 rounded-full bg-white/10 blur-[0.2px]" />
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-white/80">
                          <span className="rounded-md bg-white/10 px-2 py-1">{card.links.length} links</span>
                          <span className="text-white/55">Click to preview</span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleShareCard(card.shareUrl);
                            }}
                            className="ml-auto inline-flex items-center gap-1 rounded-md border border-cyan-300/35 bg-cyan-300/12 px-2 py-1 text-[0.68rem] font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                          >
                            <FaShareNodes className="h-3 w-3" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : activeTab === "My Products" ? (
            <>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">My Products</p>
                  <h1 className="mt-3 text-[2.6rem] font-semibold leading-[0.95] tracking-tight">Product Catalog</h1>
                  <p className="mt-2 max-w-[620px] text-white/56">
                    Add products for your catalog. Toggle use in links while adding to make products appear in your card links section.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProductForm((prev) => ({
                      ...prev,
                      categoryId: prev.categoryId || catalogCategories[0]?.id || "",
                    }));
                    setProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-cyan-300/35 bg-gradient-to-r from-[#27355a] to-[#124054] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <FaPlus className="h-3.5 w-3.5" />
                  Add Product
                </button>
              </header>

              <div className="mt-8">
                {isCatalogLoading ? <p className="text-sm text-white/60">Loading products...</p> : null}
                {!catalogProducts.length && !isCatalogLoading ? (
                  <div className="rounded-xl border border-white/10 bg-[#0f1321] p-6 text-sm text-white/60">
                    No products yet. Click <span className="font-semibold text-white/85">Add Product</span> to create your first one.
                  </div>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                  {catalogProducts.map((product) => (
                    <div key={`catalog-product-${product.id}`} className="rounded-xl border border-white/10 bg-[#101526] p-3">
                      <div
                        className="h-32 rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url('${product.imageUrl || "/image1.svg"}')` }}
                      />
                      <div className="mt-3 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{product.name}</p>
                          <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-cyan-200/80">
                            {product.category.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-white/55">{product.description || "No description added."}</p>
                        </div>
                        <span
                          className={`rounded-md border px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${
                            product.useInLinks ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/15 text-white/45"
                          }`}
                        >
                          {product.useInLinks ? "In Links" : "Catalog"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-white/85">
                        {product.currency} {product.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeTab === "Social Media" ? (
            <>
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">Social Media</p>
                  <h1 className="mt-3 text-[2.6rem] font-semibold leading-[0.95] tracking-tight">Social Profiles</h1>
                  <p className="mt-2 max-w-[620px] text-white/56">
                    Save your social media links here and choose which ones are available inside card builder.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSocialForm({
                      id: "",
                      platform: "Instagram",
                      accountName: "",
                      customPlatform: "",
                      url: "",
                      useInCardBuilder: true,
                    });
                    setIsSocialModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-cyan-300/35 bg-gradient-to-r from-[#27355a] to-[#124054] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <FaPlus className="h-3.5 w-3.5" />
                  Add Social Media
                </button>
              </header>

              <div className="mt-8">
                {!savedSocialLinks.length ? (
                  <div className="rounded-xl border border-white/10 bg-[#0f1321] p-6 text-sm text-white/60">
                    No social links yet. Click <span className="font-semibold text-white/85">Add Social Media</span> to create your first one.
                  </div>
                ) : null}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {savedSocialLinks.map((item) => {
                    const displayName = item.platform === "Other" ? item.customPlatform || "Other" : item.platform;
                    const SocialIcon = getSocialOption(item.platform).Icon;
                    return (
                      <button
                        key={`social-item-${item.id}`}
                        type="button"
                        onClick={() => {
                          setSocialForm({
                            id: item.id,
                            platform: item.platform,
                            accountName: item.accountName ?? "",
                            customPlatform: item.customPlatform ?? "",
                            url: item.url,
                            useInCardBuilder: item.useInCardBuilder,
                          });
                          setIsSocialModalOpen(true);
                        }}
                        className="rounded-xl border border-white/10 bg-[#101526] p-4 text-left transition hover:border-white/25"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{displayName}</p>
                            <p className="mt-1 truncate text-xs text-white/60">{item.accountName || "No account name"}</p>
                            <p className="mt-2 truncate text-xs text-white/55">{item.url}</p>
                          </div>
                          <SocialIcon className="h-9 w-9 shrink-0 text-cyan-200/85" />
                        </div>
                        <span
                          className={`mt-3 inline-flex rounded-md border px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] ${
                            item.useInCardBuilder ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/15 text-white/45"
                          }`}
                        >
                          {item.useInCardBuilder ? "Builder Enabled" : "Hidden in Builder"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#0f1321] p-6">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">{activeTab}</p>
              <h2 className="mt-3 text-3xl font-semibold">Coming Soon</h2>
              <p className="mt-2 text-white/56">This section will be available in the next iteration.</p>
            </div>
          )}
        </article>

        {rightPaneMode === "dashboard" ? (
          <aside className="relative px-6 py-10 lg:pr-12">
            <div className="rounded-xl border border-white/10 bg-[#0f1321] p-4">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">Insights</p>
              <h3 className="mt-2 text-xl font-semibold">What to do next</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/75">
                <li className="rounded-md border border-white/10 bg-white/[0.02] p-3">Aria Flux card CTR dropped by 4% this week.</li>
                <li className="rounded-md border border-white/10 bg-white/[0.02] p-3">Instagram sends highest traffic, keep first two links optimized.</li>
                <li className="rounded-md border border-white/10 bg-white/[0.02] p-3">Best active slot: 7:30 PM to 9:00 PM IST.</li>
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#0f1321] p-4">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#21ddff]">Top Card Snapshot</p>
              <div className="mt-3 h-32 rounded-lg bg-[linear-gradient(125deg,#2ad9ff_0%,#a26dff_55%,#ff5bcf_100%)]" />
              <p className="mt-3 text-lg font-semibold">Aria Flux</p>
              <p className="text-sm text-white/50">12.8k views · 4.9k clicks · 38.2% CTR</p>
            </div>
          </aside>
        ) : rightPaneMode === "builder" ? (
          <aside className="scrollbar-ansh relative flex h-full items-start justify-center overflow-y-auto overflow-x-hidden px-6 py-10 lg:justify-end lg:pr-12">
            <div className="absolute left-6 right-8 top-8 flex items-center justify-between">
              <div className="rounded-full border border-white/10 bg-[#151923]/80 px-4 py-1 text-[0.64rem] font-bold uppercase tracking-[0.1em] text-[#13ddff] shadow-[0_0_18px_rgba(19,221,255,0.22)]">
                Live Preview
              </div>
              <button
                type="button"
                onClick={() =>
                  openPreviewPage({
                    mode: "builder",
                    designId: draftDesignId,
                    defaultThemeId,
                    title: draftTitle || "New Creator Card",
                    handle: draftHandle,
                    bio: draftBio,
                    coverImageUrl,
                    profileImageUrl,
                    avatarImageUrl,
                    showProfilePhoto,
                    showAvatarBadge,
                    showBio,
                    showSocialChips,
                    aboutWhatIDo,
                    aboutInterests,
                    aboutEducation,
                    aboutLocation,
                    suggestions,
                    settings: cardSettings,
                    links: draftLinkRows.filter((item) => item.enabled).map((item) => ({ label: item.label, url: item.url })),
                    socials: enabledSocials.map((row) => ({ platform: row.platform, customPlatform: row.customPlatform })),
                    products: enabledProductsForPreview,
                    design: resolvedDesign,
                  })
                }
                className="rounded-md border border-white/12 bg-[#151923]/80 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:text-white"
              >
                Open Preview
              </button>
            </div>

            <div className="relative w-full max-w-[380px]">
              <div className="pointer-events-none absolute inset-x-8 -bottom-8 h-20 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="relative mt-12 overflow-hidden rounded-[1.6rem] border border-cyan-300/25 shadow-[0_30px_80px_rgba(0,0,0,0.62)]">
                {!cardSettings.removeAnshBanner ? (
                  <div
                    className={`absolute -left-8 top-5 z-20 -rotate-45 rounded-sm px-10 py-1 text-[0.52rem] font-bold uppercase tracking-[0.16em] ${resolvedDesign.ribbonClass} ${resolvedDesign.ribbonTextClass}`}
                  >
                    ANSH
                  </div>
                ) : null}
                <div className={`absolute inset-0 ${resolvedDesign.shellClass}`} />
                <div className={`absolute inset-0 ${resolvedDesign.overlayClass}`} />
                <div className="relative h-36 overflow-hidden border-b border-white/10">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${coverImageUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,14,22,0.22),rgba(12,14,22,0.05)_45%,rgba(12,14,22,0.34))]" />
                </div>

                {renderBuilderLayout()}
              </div>
            </div>
          </aside>
        ) : rightPaneMode === "my-links" && selectedCard ? (
          <aside className="scrollbar-ansh relative flex h-full items-start justify-center overflow-y-auto overflow-x-hidden px-6 py-10 lg:justify-end lg:pr-12">
            <div className="absolute left-6 right-8 top-8 flex items-center justify-between">
              <div className="rounded-full border border-white/10 bg-[#151923]/80 px-4 py-1 text-[0.64rem] font-bold uppercase tracking-[0.1em] text-[#13ddff] shadow-[0_0_18px_rgba(19,221,255,0.22)]">
                Live Preview
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openPreviewPage({
                      mode: "my-links",
                      designId: draftDesignId,
                      defaultThemeId,
                      title: draftTitle || "New Creator Card",
                      handle: draftHandle,
                      bio: draftBio,
                      coverImageUrl,
                      profileImageUrl,
                      avatarImageUrl,
                      showProfilePhoto,
                      showAvatarBadge,
                      showBio,
                      showSocialChips,
                      aboutWhatIDo,
                      aboutInterests,
                      aboutEducation,
                      aboutLocation,
                      suggestions,
                      settings: cardSettings,
                      links: draftLinkRows.filter((item) => item.enabled).map((item) => ({ label: item.label, url: item.url })),
                      socials: enabledSocials.map((row) => ({ platform: row.platform, customPlatform: row.customPlatform })),
                      products: enabledProductsForPreview,
                      design: resolvedDesign,
                    })
                  }
                  className="rounded-md border border-white/12 bg-[#151923]/80 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:text-white"
                >
                  Open Preview
                </button>
                <button
                  type="button"
                  aria-label="Edit card"
                  className="grid h-8 w-8 place-items-center rounded-md border border-white/12 bg-[#151923]/80 text-white/75 transition hover:text-white"
                >
                  ✎
                </button>
                <button
                  type="button"
                  aria-label="Delete card"
                  className="grid h-8 w-8 place-items-center rounded-md border border-red-300/30 bg-[#23141a]/80 text-red-200/85 transition hover:text-red-100"
                >
                  🗑
                </button>
              </div>
            </div>

            <div className="relative w-full max-w-[380px]">
              <div className="pointer-events-none absolute inset-x-8 -bottom-8 h-20 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="relative mt-12 overflow-hidden rounded-[1.6rem] border border-cyan-300/25 shadow-[0_30px_80px_rgba(0,0,0,0.62)]">
                {!cardSettings.removeAnshBanner ? (
                  <div
                    className={`absolute -left-8 top-5 z-20 -rotate-45 rounded-sm px-10 py-1 text-[0.52rem] font-bold uppercase tracking-[0.16em] ${resolvedDesign.ribbonClass} ${resolvedDesign.ribbonTextClass}`}
                  >
                    ANSH
                  </div>
                ) : null}
                <div className={`absolute inset-0 ${resolvedDesign.shellClass}`} />
                <div className={`absolute inset-0 ${resolvedDesign.overlayClass}`} />
                <div className="relative h-36 overflow-hidden border-b border-white/10">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${coverImageUrl}')` }} />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,14,22,0.22),rgba(12,14,22,0.05)_45%,rgba(12,14,22,0.34))]" />
                </div>
                {renderBuilderLayout()}
              </div>
            </div>
          </aside>
        ) : null}
      </section>

      {showExitBuilderModal ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cyan-300/25 bg-[#0d1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Confirm Exit</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Leave card builder?</h3>
            <p className="mt-3 text-sm text-white/65">
              Your current builder progress will stay in this session, but you will exit the editor view.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowExitBuilderModal(false)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmExitBuilder}
                className="rounded-full bg-gradient-to-r from-[#b983ff] to-[#22deff] px-5 py-2 text-sm font-bold text-[#08101c] transition hover:brightness-110"
              >
                Exit Builder
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isProductModalOpen ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-cyan-300/25 bg-[#0d1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">New Product</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Add product details</h3>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.02] text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close product modal"
              >
                <FaXmark className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Product Name *</span>
                <input
                  value={productForm.name}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="e.g. Creator Hoodie"
                  className="mt-2 w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                />
              </label>

              <label className="block">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Product Description</span>
                <textarea
                  value={productForm.description}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Optional short description"
                  rows={3}
                  className="mt-2 w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                />
              </label>

              <label className="block">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Product Link</span>
                <input
                  value={productForm.linkUrl}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, linkUrl: event.target.value }))}
                  placeholder="https://example.com/product"
                  className="mt-2 w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                />
              </label>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Product Category *</span>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={isCategorySubmitting}
                    className="inline-flex items-center gap-1 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20 disabled:opacity-60"
                  >
                    <FaPlus className="h-3 w-3" />
                    Add Category
                  </button>
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_170px]">
                  <select
                    value={productForm.categoryId}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                    className="w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                  >
                    <option value="">Select category</option>
                    {catalogCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    value={newProductCategoryName}
                    onChange={(event) => setNewProductCategoryName(event.target.value)}
                    placeholder="New category"
                    className="w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                <label className="block">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Currency *</span>
                  <select
                    value={productForm.currency}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, currency: event.target.value }))}
                    className="mt-2 w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                  >
                    {supportedCurrencies.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Amount *</span>
                  <input
                    value={productForm.amount}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, amount: event.target.value }))}
                    placeholder="0.00"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-2 w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Product Image (optional)</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    try {
                      const optimizedImage = await fileToOptimizedDataUrl(file);
                      setProductForm((prev) => ({
                        ...prev,
                        imageUrl: optimizedImage,
                        imageFileName: file.name,
                      }));
                    } catch {
                      showToast("error", "Could not process selected image.");
                    }
                  }}
                  className="mt-2 w-full cursor-pointer rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cyan-100 hover:file:bg-cyan-300/30"
                />
                <p className="mt-2 text-xs text-white/50">
                  {productForm.imageFileName ? `Selected: ${productForm.imageFileName}` : "No image selected."}
                </p>
                {productForm.imageUrl ? (
                  <div className="mt-3 h-24 w-full rounded-md border border-white/12 bg-cover bg-center" style={{ backgroundImage: `url('${productForm.imageUrl}')` }} />
                ) : null}
              </label>

              <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#0f1424] px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-white/90">Use in Links</p>
                  <p className="text-xs text-white/50">Enable this to show the product in links/products preview.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProductForm((prev) => ({ ...prev, useInLinks: !prev.useInLinks }))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                    productForm.useInLinks ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/20 text-white/55"
                  }`}
                >
                  {productForm.useInLinks ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateProduct}
                disabled={isProductSubmitting}
                className="rounded-full bg-gradient-to-r from-[#b983ff] to-[#22deff] px-5 py-2 text-sm font-bold text-[#08101c] transition hover:brightness-110 disabled:opacity-70"
              >
                {isProductSubmitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isSelectProductsModalOpen ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-cyan-300/25 bg-[#0d1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Select Products</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Add products to builder list</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSelectProductsModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.02] text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close select products modal"
              >
                <FaXmark className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm text-white/60">Only products with useInLinks enabled are shown here.</p>
            <div className="mt-4 max-h-[340px] space-y-2 overflow-y-auto pr-1">
              {!selectableProducts.length ? (
                <div className="rounded-md border border-white/10 bg-[#0f1424] p-4 text-sm text-white/55">
                  No eligible products found. Create product with use in links enabled.
                </div>
              ) : null}
              {selectableProducts.map((product) => {
                const isSelected = selectedCatalogProductIds.includes(product.id);
                return (
                  <button
                    key={`select-product-${product.id}`}
                    type="button"
                    onClick={() =>
                      setSelectedCatalogProductIds((prev) =>
                        prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id],
                      )
                    }
                    className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left transition ${
                      isSelected
                        ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                        : "border-white/12 bg-[#0f1424] text-white/80"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{product.name}</p>
                      <p className="mt-0.5 text-xs text-white/55">{product.category.name}</p>
                    </div>
                    <span className="text-xs font-bold uppercase">{isSelected ? "Selected" : "Select"}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSelectProductsModalOpen(false)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSelectedProductsToBuilder}
                disabled={!selectedCatalogProductIds.length}
                className="rounded-full bg-gradient-to-r from-[#b983ff] to-[#22deff] px-5 py-2 text-sm font-bold text-[#08101c] transition hover:brightness-110 disabled:opacity-60"
              >
                Add to my list
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isSocialModalOpen ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-cyan-300/25 bg-[#0d1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Social Media</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">{socialForm.id ? "Edit social media" : "Add social media"}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSocialModalOpen(false);
                  setIsSocialPlatformMenuOpen(false);
                }}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.02] text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close social media modal"
              >
                <FaXmark className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Social Media</span>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => setIsSocialPlatformMenuOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none transition hover:border-cyan-300/35"
                  >
                    <span className="flex items-center gap-2.5">
                      {(() => {
                        const selected = getSocialOption(socialForm.platform);
                        return <selected.Icon className="text-cyan-200/90" />;
                      })()}
                      <span>{socialForm.platform}</span>
                    </span>
                    <FaChevronDown className="text-xs text-white/65" />
                  </button>
                  {isSocialPlatformMenuOpen ? (
                    <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-md border border-white/12 bg-[#0f1524] shadow-[0_14px_34px_rgba(0,0,0,0.4)]">
                      {socialPlatformOptions.map((platform) => (
                        <button
                          key={`modal-social-platform-${platform.label}`}
                          type="button"
                          onClick={() => {
                            setSocialForm((prev) => ({ ...prev, platform: platform.label }));
                            setIsSocialPlatformMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-2.5 py-2 text-left text-sm transition ${
                            socialForm.platform === platform.label ? "bg-cyan-400/20 text-white" : "text-white/86 hover:bg-white/7"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <platform.Icon className="text-cyan-200/90" />
                            <span>{platform.label}</span>
                          </span>
                          {socialForm.platform === platform.label ? <FaCheck className="text-xs text-cyan-200" /> : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </label>

              <label className="block">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Account Name</span>
                <input
                  value={socialForm.accountName}
                  onChange={(event) => setSocialForm((prev) => ({ ...prev, accountName: event.target.value }))}
                  placeholder="@username or page name"
                  className="mt-2 w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                />
              </label>

              {socialForm.platform === "Other" ? (
                <label className="block">
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Other Platform Name</span>
                  <input
                    value={socialForm.customPlatform}
                    onChange={(event) => setSocialForm((prev) => ({ ...prev, customPlatform: event.target.value }))}
                    placeholder="Enter platform name"
                    className="mt-2 w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/60">Link</span>
                <input
                  value={socialForm.url}
                  onChange={(event) => setSocialForm((prev) => ({ ...prev, url: event.target.value }))}
                  placeholder="https://"
                  className="mt-2 w-full rounded-md border border-white/12 bg-[#0f1424] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/45"
                />
              </label>

              <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#0f1424] px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-white/90">Use in Card Builder</p>
                  <p className="text-xs text-white/50">Allow this social to appear in builder selection list.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSocialForm((prev) => ({ ...prev, useInCardBuilder: !prev.useInCardBuilder }))}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition ${
                    socialForm.useInCardBuilder ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/20 text-white/55"
                  }`}
                >
                  {socialForm.useInCardBuilder ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSocialModalOpen(false);
                  setIsSocialPlatformMenuOpen(false);
                }}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSocial}
                disabled={isSocialSubmitting}
                className="rounded-full bg-gradient-to-r from-[#b983ff] to-[#22deff] px-5 py-2 text-sm font-bold text-[#08101c] transition hover:brightness-110 disabled:opacity-60"
              >
                {isSocialSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isSelectSocialModalOpen ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-cyan-300/25 bg-[#0d1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#22deff]">Select Social Media</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Add socials to builder list</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSelectSocialModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.02] text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close select social modal"
              >
                <FaXmark className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm text-white/60">Only social links with use in card builder enabled are shown here.</p>
            <div className="mt-4 max-h-[340px] space-y-2 overflow-y-auto pr-1">
              {savedSocialLinks.filter((item) => item.useInCardBuilder).length === 0 ? (
                <div className="rounded-md border border-white/10 bg-[#0f1424] p-4 text-sm text-white/55">
                  No eligible social media found. Add social with use in card builder enabled.
                </div>
              ) : null}
              {savedSocialLinks
                .filter((item) => item.useInCardBuilder)
                .map((item) => {
                  const displayName = item.platform === "Other" ? item.customPlatform || "Other" : item.platform;
                  const isSelected = selectedSavedSocialIds.includes(item.id);
                  return (
                    <button
                      key={`select-social-${item.id}`}
                      type="button"
                      onClick={() =>
                        setSelectedSavedSocialIds((prev) =>
                          prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left transition ${
                        isSelected
                          ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                          : "border-white/12 bg-[#0f1424] text-white/80"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{displayName}</p>
                        <p className="mt-0.5 truncate text-xs text-white/55">{item.url}</p>
                      </div>
                      <span className="text-xs font-bold uppercase">{isSelected ? "Selected" : "Select"}</span>
                    </button>
                  );
                })}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSelectSocialModalOpen(false)}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSelectedSocialsToBuilder}
                disabled={!selectedSavedSocialIds.length}
                className="rounded-full bg-gradient-to-r from-[#b983ff] to-[#22deff] px-5 py-2 text-sm font-bold text-[#08101c] transition hover:brightness-110 disabled:opacity-60"
              >
                Add Social Media
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none absolute right-4 top-4 z-40">
          <div
            className={`rounded-md border px-4 py-3 text-sm font-semibold shadow-lg ${
              toast.type === "success"
                ? "border-emerald-300/35 bg-emerald-500/15 text-emerald-100"
                : "border-rose-300/35 bg-rose-500/15 text-rose-100"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
    </main>
  );
}
