import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function sanitizeCurrency(value: string): string {
  return value.trim().toUpperCase();
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const appUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  if (!appUser) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: { userId: appUser.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
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

  const payload = (await request.json().catch(() => null)) as
    | {
        name?: string;
        description?: string;
        currency?: string;
        amount?: number;
        imageUrl?: string;
        useInLinks?: boolean;
      }
    | null;

  const name = payload?.name?.trim() ?? "";
  const currency = sanitizeCurrency(payload?.currency ?? "");
  const amount = Number(payload?.amount);
  const description = payload?.description?.trim() || null;
  const imageUrl = payload?.imageUrl?.trim() || null;
  const useInLinks = Boolean(payload?.useInLinks);

  if (!name) {
    return NextResponse.json({ message: "Product name is required." }, { status: 400 });
  }

  if (!currency || currency.length !== 3) {
    return NextResponse.json({ message: "Select a valid currency." }, { status: 400 });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: "Amount must be greater than 0." }, { status: 400 });
  }

  const appUser = await prisma.user.upsert({
    where: { email: user.email },
    update: { authProvider: "google", authSubjectId: user.id },
    create: {
      email: user.email,
      authProvider: "google",
      authSubjectId: user.id,
      loginCount: 1,
      lastLoginAt: new Date(),
    },
    select: { id: true },
  });

  const product = await prisma.product.create({
    data: {
      userId: appUser.id,
      name,
      description,
      currency,
      amount,
      imageUrl,
      useInLinks,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
