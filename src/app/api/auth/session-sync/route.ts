import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ message: "Unauthorized", code: "AUTH_REQUIRED" }, { status: 401 });
    }

    const now = new Date();
    const metadata = user.user_metadata ?? {};
    const appUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        authProvider: "email",
        authSubjectId: user.id,
        lastLoginAt: now,
        loginCount: { increment: 1 },
      },
      create: {
        email: user.email,
        fullName: metadata.full_name ?? metadata.name ?? null,
        avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
        authProvider: "email",
        authSubjectId: user.id,
        lastLoginAt: now,
        loginCount: 1,
      },
      select: { handle: true, workspaceId: true },
    });

    return NextResponse.json({
      ok: true,
      workspaceId: appUser.workspaceId,
      wid: appUser.workspaceId,
      hasHandle: Boolean(appUser.handle),
    });
  } catch (error) {
    console.error("POST /api/auth/session-sync failed", error);
    return NextResponse.json({ message: "Failed to sync user session.", code: "SESSION_SYNC_FAILED" }, { status: 500 });
  }
}
