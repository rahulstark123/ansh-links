import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function resolveRedirectPath(nextPath: string | null): string {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/home";
  }

  return nextPath;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const safeNextPath = resolveRedirectPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const { user } = data;
  if (!user.email) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }
  const userEmail: string = user.email;
  const metadata = user.user_metadata ?? {};
  const now = new Date();

  const appUser = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      authProvider: "google",
      authSubjectId: user.id,
      lastLoginAt: now,
      loginCount: { increment: 1 },
    },
    create: {
      email: userEmail,
      fullName: metadata.full_name ?? metadata.name ?? null,
      avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
      authProvider: "google",
      authSubjectId: user.id,
      lastLoginAt: now,
      loginCount: 1,
    },
  });

  if (!appUser.handle) {
    return NextResponse.redirect(new URL("/onboarding", requestUrl.origin));
  }

  return NextResponse.redirect(new URL(safeNextPath, requestUrl.origin));
}
