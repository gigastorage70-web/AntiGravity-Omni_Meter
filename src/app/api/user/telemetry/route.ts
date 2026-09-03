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

    const user = db.getUserById(targetUserId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found." },
        { status: 404 }
      );
    }

    const quotas = db.getUserQuotas(user.id);
    const g3fm = quotas.find((q) => q.model_id === "g3fm") || quotas[0];

    const provenance = {
      source: "live" as const,
      fetched_at: new Date().toISOString(),
      stale_after: new Date(Date.now() + 60000).toISOString(),
      pipeline_engine: "Antigravity-MultiTenant-Engine-v2",
      raw_source_ref: `User: ${user.email} (${user.tier})`,
      data_hash: `user_${user.id.slice(-8)}_hash`,
    };

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        role: user.role,
        storage_limit_gb: user.storage_limit_gb,
        storage_used_gb: user.storage_used_gb,
        storage_breakdown: user.storage_breakdown,
      },
      quotas: quotas.map((q) => ({
        id: q.model_id,
        name: q.model_name,
        category: q.category,
        code: q.code,
        remainingPercentage: q.remaining_percentage,
        totalLimit: q.total_limit,
        consumed: q.consumed,
        unit: q.category === "LLM" ? "Tokens / 5h Sliding Bucket" : "Credits / Day",
        rpmLimit: q.rpm_limit,
        currentRpm: q.current_rpm,
        tpmLimit: q.tpm_limit,
        currentTpm: q.current_tpm,
        rollingWindowHours: q.rolling_window_hours,
        nextReplenishMinutes: q.next_replenish_minutes,
        resetMode: "rolling" as const,
        status: q.status,
        hourlyHistory: q.hourly_history,
        provenance,
      })),
      storage: {
        totalGb: user.storage_limit_gb,
        usedGb: user.storage_used_gb,
        breakdown: user.storage_breakdown,
      },
      provenance,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId, modelId, tokens, pctBoost } = body;

    const sessionUser = getCurrentUser();
    const targetUserId = userId || sessionUser?.id || "user_developer_power";

    if (action === "burn") {
      db.burnTokens(targetUserId, modelId || "g3fm", tokens || 50000);
      return NextResponse.json({ success: true, message: `Burned ${tokens || 50000} tokens.` });
    }

    if (action === "replenish") {
      db.replenishQuota(targetUserId, modelId || "g3fm", pctBoost || 25);
      return NextResponse.json({ success: true, message: `Replenished capacity (+${pctBoost || 25}%).` });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
