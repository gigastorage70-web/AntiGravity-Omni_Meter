import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metrics = db.getPlatformMetrics();
    const auditLogs = db.getAuditLogs();

    return NextResponse.json({
      success: true,
      metrics,
      auditLogs,
      provenance: {
        source: "live" as const,
        fetched_at: new Date().toISOString(),
        pipeline_engine: "Universal-Admin-Telemetry-Engine",
        raw_source_ref: "MultiTenant-Master-Database",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
