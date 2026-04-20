import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const HANDLE_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;

function normalizeHandle(rawHandle: string): string {
  return rawHandle.trim().toLowerCase();
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { handle?: string } | null;
  const handle = normalizeHandle(body?.handle ?? "");

  if (!HANDLE_REGEX.test(handle)) {
    return NextResponse.json(
      {
        message:
          "Handle must be 3-30 chars, lowercase letters, numbers, and hyphens only.",
      },
      { status: 400 },
    );
  }

  try {
    const now = new Date();

    const appUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        authProvider: "google",
        authSubjectId: user.id,
        lastLoginAt: now,
        loginCount: { increment: 1 },
        handle,
      },
      create: {
        email: user.email,
        handle,
        fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
        avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
        authProvider: "google",
        authSubjectId: user.id,
        lastLoginAt: now,
        loginCount: 1,
      },
      select: {
        workspaceId: true,
      },
    });

    return NextResponse.json({ ok: true, workspaceId: appUser.workspaceId, wid: appUser.workspaceId });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "This handle is already taken." }, { status: 409 });
    }

    return NextResponse.json({ message: "Could not save your handle." }, { status: 500 });
  }
}
