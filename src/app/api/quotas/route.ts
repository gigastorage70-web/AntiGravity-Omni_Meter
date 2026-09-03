import { NextResponse } from "next/server";
import { calculateLiveQuotas } from "@/lib/telemetryPipeline";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = calculateLiveQuotas();
    return NextResponse.json({
      success: true,
      data: result.quotas,
      totalWindowTokens: result.totalWindowTokens,
      activeWindowStart: result.activeWindowStart,
      nextReplenishMinutes: result.nextReplenishMinutes,
      hourlyHistory: result.hourlyHistory,
      provenance: result.provenance,
    });
  } catch (err: any) {
    console.error("[API /api/quotas] Pipeline failure:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "QUOTA_PIPELINE_ERROR",
          message: err.message || "Failed to calculate live model quotas from local transcripts.",
          recoverable: true,
        },
        provenance: {
          source: "live",
          fetched_at: new Date().toISOString(),
          stale_after: new Date().toISOString(),
          pipeline_engine: "Antigravity-JSONL-Telemetry-Engine-v1",
        },
      },
      { status: 500 }
    );
  }
}
