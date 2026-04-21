import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    select: { id: true, workspaceId: true },
  });

  if (!appUser) {
    return { error: NextResponse.json({ message: "User not found", code: "USER_NOT_FOUND" }, { status: 404 }) };
  }

  return { appUser };
}

export async function GET() {
  try {
    const auth = await getAuthenticatedWorkspace();
    if ("error" in auth) return auth.error;

    const socialLinks = await prisma.socialLink.findMany({
      where: { workspaceId: auth.appUser.workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ workspaceId: auth.appUser.workspaceId, socialLinks });
  } catch (error) {
    console.error("GET /api/social-media failed", error);
    return NextResponse.json({ message: "Failed to fetch social links.", code: "SOCIAL_GET_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedWorkspace();
    if ("error" in auth) return auth.error;

    const payload = (await request.json().catch(() => null)) as
      | {
          platform?: string;
          accountName?: string;
          customPlatform?: string;
          url?: string;
          useInCardBuilder?: boolean;
        }
      | null;

    const platform = payload?.platform?.trim() ?? "";
    const accountName = payload?.accountName?.trim() || null;
    const customPlatform = payload?.customPlatform?.trim() || null;
    const url = payload?.url?.trim() ?? "";
    const useInCardBuilder = Boolean(payload?.useInCardBuilder);

    if (!platform) {
      return NextResponse.json({ message: "Platform is required.", code: "PLATFORM_REQUIRED" }, { status: 400 });
    }
    if (platform === "Other" && !customPlatform) {
      return NextResponse.json({ message: "Custom platform name is required.", code: "CUSTOM_PLATFORM_REQUIRED" }, { status: 400 });
    }
    if (!url) {
      return NextResponse.json({ message: "Social link is required.", code: "URL_REQUIRED" }, { status: 400 });
    }

    const socialLink = await prisma.socialLink.create({
      data: {
        userId: auth.appUser.id,
        workspaceId: auth.appUser.workspaceId,
        platform,
        accountName,
        customPlatform,
        url,
        useInCardBuilder,
      },
    });

    return NextResponse.json({ workspaceId: auth.appUser.workspaceId, socialLink }, { status: 201 });
  } catch (error) {
    console.error("POST /api/social-media failed", error);
    return NextResponse.json({ message: "Failed to create social link.", code: "SOCIAL_POST_FAILED" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await getAuthenticatedWorkspace();
    if ("error" in auth) return auth.error;

    const payload = (await request.json().catch(() => null)) as
      | {
          id?: string;
          platform?: string;
          accountName?: string;
          customPlatform?: string;
          url?: string;
          useInCardBuilder?: boolean;
        }
      | null;

    const id = payload?.id?.trim() ?? "";
    if (!id) {
      return NextResponse.json({ message: "Social id is required.", code: "ID_REQUIRED" }, { status: 400 });
    }

    const existing = await prisma.socialLink.findFirst({
      where: {
        id,
        workspaceId: auth.appUser.workspaceId,
      },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Social link not found.", code: "SOCIAL_NOT_FOUND" }, { status: 404 });
    }

    const data: {
      platform?: string;
      accountName?: string | null;
      customPlatform?: string | null;
      url?: string;
      useInCardBuilder?: boolean;
    } = {};

    if (typeof payload?.platform === "string" && payload.platform.trim()) {
      data.platform = payload.platform.trim();
    }
    if (typeof payload?.customPlatform === "string") {
      data.customPlatform = payload.customPlatform.trim() || null;
    }
    if (typeof payload?.accountName === "string") {
      data.accountName = payload.accountName.trim() || null;
    }
    if (typeof payload?.url === "string" && payload.url.trim()) {
      data.url = payload.url.trim();
    }
    if (typeof payload?.useInCardBuilder === "boolean") {
      data.useInCardBuilder = payload.useInCardBuilder;
    }

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data,
    });

    return NextResponse.json({ workspaceId: auth.appUser.workspaceId, socialLink });
  } catch (error) {
    console.error("PATCH /api/social-media failed", error);
    return NextResponse.json({ message: "Failed to update social link.", code: "SOCIAL_PATCH_FAILED" }, { status: 500 });
  }
}
