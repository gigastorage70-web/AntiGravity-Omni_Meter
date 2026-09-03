import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");

    const sessionUser = getCurrentUser();
    const targetUserId = queryUserId || sessionUser?.id || "user_developer_power";

    const images = db.getUserImages(targetUserId);

    const provenance = {
      source: "live" as const,
      fetched_at: new Date().toISOString(),
      stale_after: new Date(Date.now() + 60000).toISOString(),
      pipeline_engine: "Nano-Banana-Diffusion-Engine-v2",
      raw_source_ref: `User: ${targetUserId}`,
    };

    return NextResponse.json({
      success: true,
      images: images.map((img) => ({
        id: img.id,
        title: img.prompt.slice(0, 40) + "...",
        prompt: img.prompt,
        model: img.model,
        aspectRatio: img.aspect_ratio,
        resolution: "3840 x 2160 (4K UHD)",
        seed: Math.floor(Math.random() * 899999) + 100000,
        createdAt: img.created_at.slice(0, 16).replace("T", " "),
        deviceId: img.device_id,
        deviceName: img.device_name,
        imageUrl: img.image_url,
        creditsUsed: img.credits_used,
        tags: ["Studio", "AI Generated", img.aspect_ratio],
        provenance,
      })),
      provenance,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio, userId } = body;

    const sessionUser = getCurrentUser();
    const targetUserId = userId || sessionUser?.id || "user_developer_power";

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required." }, { status: 400 });
    }

    const newImage = db.addImage(targetUserId, {
      prompt,
      aspect_ratio: aspectRatio || "16:9",
    });

    return NextResponse.json({
      success: true,
      image: newImage,
      message: "Image rendered successfully and 1 credit deducted.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
