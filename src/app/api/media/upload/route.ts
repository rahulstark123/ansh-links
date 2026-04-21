import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, "_");
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

    const appUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { workspaceId: true },
    });

    if (!appUser) {
      return NextResponse.json({ message: "User not found.", code: "USER_NOT_FOUND" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const mediaType = String(formData.get("mediaType") ?? "");
    const cardIdRaw = String(formData.get("cardId") ?? "draft");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File is required.", code: "FILE_REQUIRED" }, { status: 400 });
    }
    if (!["profile", "cover"].includes(mediaType)) {
      return NextResponse.json({ message: "Invalid media type.", code: "INVALID_MEDIA_TYPE" }, { status: 400 });
    }

    const bucketName = process.env.SUPABASE_CARD_MEDIA_BUCKET || "ansh-links-card-media";

    const cardId = safeSegment(cardIdRaw || "draft");
    const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeSegment(fileExt || "jpg")}`;
    const path = `${appUser.workspaceId}/${cardId}/${mediaType}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucketName).upload(path, file, {
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

    if (uploadError) {
      return NextResponse.json(
        {
          message:
            uploadError.message ||
            "Upload failed. Ensure the bucket exists and storage insert policy allows authenticated users.",
          code: "UPLOAD_FAILED",
        },
        { status: 500 },
      );
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return NextResponse.json({
      workspaceId: appUser.workspaceId,
      cardId,
      path,
      url: data.publicUrl,
    });
  } catch (error) {
    console.error("POST /api/media/upload failed", error);
    return NextResponse.json({ message: "Failed to upload media.", code: "MEDIA_UPLOAD_FAILED" }, { status: 500 });
  }
}
