import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function sanitizeCurrency(value: string): string {
  return value.trim().toUpperCase();
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ message: "Unauthorized", code: "AUTH_REQUIRED" }, { status: 401 });
    }

    const appUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, workspaceId: true },
    });

    if (!appUser) {
      return NextResponse.json({ workspaceId: null, wid: null, products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        workspaceId: appUser.workspaceId,
        userId: appUser.id,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ workspaceId: appUser.workspaceId, wid: appUser.workspaceId, products });
  } catch (error) {
    console.error("GET /api/products failed", error);
    return NextResponse.json(
      { message: "Failed to fetch products.", code: "PRODUCTS_GET_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json({ message: "Unauthorized", code: "AUTH_REQUIRED" }, { status: 401 });
    }

    const payload = (await request.json().catch(() => null)) as
      | {
          name?: string;
          description?: string;
          linkUrl?: string;
          currency?: string;
          amount?: number;
          imageUrl?: string;
          useInLinks?: boolean;
          categoryId?: string;
        }
      | null;

    const name = payload?.name?.trim() ?? "";
    const currency = sanitizeCurrency(payload?.currency ?? "");
    const amount = Number(payload?.amount);
    const description = payload?.description?.trim() || null;
    const linkUrl = payload?.linkUrl?.trim() || null;
    const imageUrl = payload?.imageUrl?.trim() || null;
    const useInLinks = Boolean(payload?.useInLinks);
    const categoryId = payload?.categoryId?.trim() ?? "";

    if (!name) {
      return NextResponse.json({ message: "Product name is required.", code: "NAME_REQUIRED" }, { status: 400 });
    }

    if (!currency || currency.length !== 3) {
      return NextResponse.json({ message: "Select a valid currency.", code: "INVALID_CURRENCY" }, { status: 400 });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ message: "Amount must be greater than 0.", code: "INVALID_AMOUNT" }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ message: "Product category is required.", code: "CATEGORY_REQUIRED" }, { status: 400 });
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
      select: { id: true, workspaceId: true },
    });

    const category = await prisma.productCategory.findFirst({
      where: {
        id: categoryId,
        workspaceId: appUser.workspaceId,
        userId: appUser.id,
      },
      select: { id: true },
    });

    if (!category) {
      return NextResponse.json({ message: "Selected category not found.", code: "CATEGORY_NOT_FOUND" }, { status: 404 });
    }

    const product = await prisma.product.create({
      data: {
        userId: appUser.id,
        workspaceId: appUser.workspaceId,
        categoryId: category.id,
        name,
        description,
        linkUrl,
        currency,
        amount,
        imageUrl,
        useInLinks,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ workspaceId: appUser.workspaceId, wid: appUser.workspaceId, product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products failed", error);
    return NextResponse.json(
      { message: "Failed to create product.", code: "PRODUCTS_POST_FAILED" },
      { status: 500 },
    );
  }
}
