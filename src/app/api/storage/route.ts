import { NextResponse } from "next/server";
import { scanLiveStorage } from "@/lib/telemetryPipeline";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = scanLiveStorage();
    return NextResponse.json({
      success: true,
      data: result.files,
      totalVolumeGb: result.totalVolumeGb,
      provenance: result.provenance,
    });
  } catch (err: any) {
    console.error("[API /api/storage] Storage scan failure:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "STORAGE_SCAN_ERROR",
          message: err.message || "Failed to scan local workspace files.",
          recoverable: true,
        },
        provenance: {
          source: "live",
          fetched_at: new Date().toISOString(),
          stale_after: new Date().toISOString(),
          pipeline_engine: "Local-Filesystem-Watcher",
        },
      },
      { status: 500 }
    );
  }
}
