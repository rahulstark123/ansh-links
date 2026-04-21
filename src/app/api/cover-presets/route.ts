import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

function toTitleLabel(fileName: string) {
  const withoutExt = fileName.replace(/\.[^/.]+$/, "");
  return withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_COVER_BUCKET || "ansh-links-coverImages";

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ message: "Supabase environment variables are missing." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);
    const { data, error } = await supabase.storage.from(bucketName).list("", {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
          hint:
            "If bucket is public but list fails, add SUPABASE_SERVICE_ROLE_KEY to server env or create storage.objects SELECT policy for this bucket.",
          bucketName,
        },
        { status: 500 },
      );
    }

    const presets = (data ?? [])
      .filter((file) => IMAGE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext)))
      .map((file) => {
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(file.name);
        return {
          id: file.id ?? file.name,
          label: toTitleLabel(file.name),
          imageUrl: publicUrlData.publicUrl,
        };
      });

    return NextResponse.json({ presets });
  } catch (error) {
    console.error("GET /api/cover-presets failed", error);
    return NextResponse.json({ message: "Failed to load cover presets." }, { status: 500 });
  }
}
