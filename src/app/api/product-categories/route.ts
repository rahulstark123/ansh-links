import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
      select: { workspaceId: true },
    });

    if (!appUser) {
      return NextResponse.json({ workspaceId: null, categories: [] });
    }

    const categories = await prisma.productCategory.findMany({
      where: { workspaceId: appUser.workspaceId },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ workspaceId: appUser.workspaceId, categories });
  } catch (error) {
    console.error("GET /api/product-categories failed", error);
    return NextResponse.json({ message: "Failed to fetch categories.", code: "CATEGORIES_GET_FAILED" }, { status: 500 });
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

    const payload = (await request.json().catch(() => null)) as { name?: string } | null;
    const name = payload?.name?.trim() ?? "";

    if (!name) {
      return NextResponse.json({ message: "Category name is required.", code: "CATEGORY_NAME_REQUIRED" }, { status: 400 });
    }

    const appUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true, workspaceId: true },
    });

    if (!appUser) {
      return NextResponse.json({ message: "User not found.", code: "USER_NOT_FOUND" }, { status: 404 });
    }

    const category = await prisma.productCategory.create({
      data: {
        userId: appUser.id,
        workspaceId: appUser.workspaceId,
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ workspaceId: appUser.workspaceId, category }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Category already exists.", code: "CATEGORY_DUPLICATE" }, { status: 409 });
    }
    console.error("POST /api/product-categories failed", error);
    return NextResponse.json({ message: "Failed to create category.", code: "CATEGORIES_POST_FAILED" }, { status: 500 });
  }
}
