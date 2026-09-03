import { NextResponse } from "next/server";
import { scanLiveProcesses } from "@/lib/telemetryPipeline";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = scanLiveProcesses();
    return NextResponse.json({
      success: true,
      data: result.devices,
      provenance: result.provenance,
    });
  } catch (err: any) {
    console.error("[API /api/devices] Process scan failure:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DEVICE_SCAN_ERROR",
          message: err.message || "Failed to scan live host processes.",
          recoverable: true,
        },
        provenance: {
          source: "live",
          fetched_at: new Date().toISOString(),
          stale_after: new Date().toISOString(),
          pipeline_engine: "Host-OS-Process-Inspector",
        },
      },
      { status: 500 }
    );
  }
}
