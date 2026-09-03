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

    const videos = db.getUserVideos(targetUserId);

    const provenance = {
      source: "live" as const,
      fetched_at: new Date().toISOString(),
      stale_after: new Date(Date.now() + 60000).toISOString(),
      pipeline_engine: "Google-Veo2-Flow-Video-Engine-v2",
      raw_source_ref: `User: ${targetUserId}`,
    };

    return NextResponse.json({
      success: true,
      videos: videos.map((v) => ({
        id: v.id,
        title: v.prompt.slice(0, 45) + "...",
        prompt: v.prompt,
        engine: v.engine,
        status: v.status,
        progressPercentage: v.progress,
        durationSeconds: v.duration_seconds,
        fps: 60,
        aspectRatio: "16:9",
        videoUrl: v.video_url,
        thumbnailUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
        createdAt: v.created_at.slice(0, 16).replace("T", " "),
        deviceId: v.device_id,
        deviceName: v.device_name,
        creditsCost: 2,
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
    const { prompt, engine, userId } = body;

    const sessionUser = getCurrentUser();
    const targetUserId = userId || sessionUser?.id || "user_developer_power";

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required." }, { status: 400 });
    }

    const newVideo = db.addVideo(targetUserId, {
      prompt,
      engine: engine || "Google Veo 2",
    });

    return NextResponse.json({
      success: true,
      video: newVideo,
      message: "Video rendering pipeline started (60fps Cinematic).",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
