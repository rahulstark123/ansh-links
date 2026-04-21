import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CardPayload = {
  title?: string;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  designId?: string;
  defaultThemeId?: string;
  status?: "Live" | "Draft";
  showProfilePhoto?: boolean;
  showAvatarBadge?: boolean;
  showBio?: boolean;
  showSocialChips?: boolean;
  aboutWhatIDo?: string;
  aboutInterests?: string[];
  aboutEducation?: string;
  aboutLocation?: string;
  links?: Array<{ label?: string; url?: string; enabled?: boolean }>;
  selectedProductIds?: string[];
  productVisibility?: Record<string, boolean>;
  selectedSocialIds?: string[];
  socialVisibility?: Record<string, boolean>;
  settings?: {
    allowPublic?: boolean;
    allowShare?: boolean;
    allowSearchIndexing?: boolean;
    matureContentWarning?: boolean;
    removeAnshBanner?: boolean;
  };
  isLive?: boolean;
};

function slugifyCardTitle(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "card";
}

async function getUniqueCardSlug(workspaceId: number, title: string) {
  const base = slugifyCardTitle(title);
  for (let i = 0; i < 1000; i += 1) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`;
    const existing = await prisma.card.findFirst({
      where: { workspaceId, cardSlug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  return `${base}-${Date.now()}`;
}

async function getAuthenticatedWorkspace() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return { error: NextResponse.json({ message: "Unauthorized", code: "AUTH_REQUIRED" }, { status: 401 }) };
  }

  const appUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true, workspaceId: true, handle: true },
  });

  if (!appUser) {
    return { error: NextResponse.json({ message: "User not found", code: "USER_NOT_FOUND" }, { status: 404 }) };
  }

  if (!appUser.handle) {
    return { error: NextResponse.json({ message: "Handle not set. Complete onboarding first.", code: "HANDLE_REQUIRED" }, { status: 400 }) };
  }

  return { appUser };
}

export async function GET() {
  try {
    const auth = await getAuthenticatedWorkspace();
    if ("error" in auth) return auth.error;

    const cards = await prisma.card.findMany({
      where: {
        workspaceId: auth.appUser.workspaceId,
        userId: auth.appUser.id,
      },
      orderBy: { createdAt: "desc" },
    });

    const shareBaseUrl = process.env.NEXT_PUBLIC_CARD_SHARE_BASE_URL || "https://links.anshapps.in";
    return NextResponse.json({
      workspaceId: auth.appUser.workspaceId,
      wid: auth.appUser.workspaceId,
      handle: auth.appUser.handle,
      shareBaseUrl,
      cards,
    });
  } catch (error) {
    console.error("GET /api/cards failed", error);
    return NextResponse.json({ message: "Failed to fetch cards.", code: "CARDS_GET_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedWorkspace();
    if ("error" in auth) return auth.error;

    const payload = (await request.json().catch(() => null)) as CardPayload | null;
    const title = payload?.title?.trim() || "New Creator Card";
    const cardSlug = await getUniqueCardSlug(auth.appUser.workspaceId, title);

    const card = await prisma.card.create({
      data: {
        userId: auth.appUser.id,
        workspaceId: auth.appUser.workspaceId,
        cardSlug,
        title,
        bio: payload?.bio?.trim() || null,
        profileImageUrl: payload?.profileImageUrl?.trim() || null,
        coverImageUrl: payload?.coverImageUrl?.trim() || null,
        designId: payload?.designId?.trim() || "default",
        defaultThemeId: payload?.defaultThemeId?.trim() || "aurora",
        isLive: payload?.isLive ?? false,
        status: payload?.isLive ? "Live" : "Draft",
        showProfilePhoto: payload?.showProfilePhoto ?? true,
        showAvatarBadge: payload?.showAvatarBadge ?? true,
        showBio: payload?.showBio ?? true,
        showSocialChips: payload?.showSocialChips ?? true,
        aboutWhatIDo: payload?.aboutWhatIDo?.trim() || null,
        aboutInterests: payload?.aboutInterests ?? [],
        aboutEducation: payload?.aboutEducation?.trim() || null,
        aboutLocation: payload?.aboutLocation?.trim() || null,
        links: payload?.links ?? [],
        selectedProductIds: payload?.selectedProductIds ?? [],
        productVisibility: payload?.productVisibility ?? {},
        selectedSocialIds: payload?.selectedSocialIds ?? [],
        socialVisibility: payload?.socialVisibility ?? {},
        settings: payload?.settings ?? {
          allowPublic: true,
          allowShare: true,
          allowSearchIndexing: true,
          matureContentWarning: false,
          removeAnshBanner: false,
        },
      },
    });

    const shareBaseUrl = process.env.NEXT_PUBLIC_CARD_SHARE_BASE_URL || "https://links.anshapps.in";
    return NextResponse.json({
      workspaceId: auth.appUser.workspaceId,
      wid: auth.appUser.workspaceId,
      handle: auth.appUser.handle,
      shareBaseUrl,
      shareUrl: `${shareBaseUrl}/${auth.appUser.handle}/${card.cardSlug}`,
      card,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cards failed", error);
    return NextResponse.json({ message: "Failed to create card.", code: "CARDS_POST_FAILED" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthenticatedWorkspace();
    if ("error" in auth) return auth.error;

    const payload = (await request.json().catch(() => null)) as { id?: string; isLive?: boolean } | null;
    const id = payload?.id?.trim() ?? "";

    if (!id) {
      return NextResponse.json({ message: "Card id is required.", code: "CARD_ID_REQUIRED" }, { status: 400 });
    }
    if (typeof payload?.isLive !== "boolean") {
      return NextResponse.json({ message: "isLive must be boolean.", code: "INVALID_LIVE_VALUE" }, { status: 400 });
    }

    const existing = await prisma.card.findFirst({
      where: {
        id,
        workspaceId: auth.appUser.workspaceId,
        userId: auth.appUser.id,
      },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Card not found.", code: "CARD_NOT_FOUND" }, { status: 404 });
    }

    const card = await prisma.card.update({
      where: { id },
      data: {
        isLive: payload.isLive,
        status: payload.isLive ? "Live" : "Draft",
      },
    });

    return NextResponse.json({
      workspaceId: auth.appUser.workspaceId,
      wid: auth.appUser.workspaceId,
      card,
    });
  } catch (error) {
    console.error("PATCH /api/cards failed", error);
    return NextResponse.json({ message: "Failed to update card.", code: "CARDS_PATCH_FAILED" }, { status: 500 });
  }
}
