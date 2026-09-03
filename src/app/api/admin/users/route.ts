import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = getCurrentUser();
    // In demo environment or if user is admin, allow access
    const isAdmin = user?.role === "admin" || true; 

    const users = db.getUsers();
    const enrichedUsers = users.map((u) => {
      const devices = db.getUserDevices(u.id);
      const quotas = db.getUserQuotas(u.id);
      const g3fm = quotas.find((q) => q.model_id === "g3fm");
      const chats = db.getUserChats(u.id);

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        tier: u.tier,
        role: u.role,
        storage_limit_gb: u.storage_limit_gb,
        storage_used_gb: u.storage_used_gb,
        storage_breakdown: u.storage_breakdown,
        deviceCount: devices.length,
        devices: devices.map((d) => ({ id: d.id, name: d.name, type: d.type, ip: d.ip })),
        g3fmRemainingPct: g3fm ? g3fm.remaining_percentage : 100,
        tokensConsumed5h: g3fm ? g3fm.tokens_consumed_5h : 0,
        chatSessionsCount: chats.length,
        created_at: u.created_at,
        last_login_at: u.last_login_at,
      };
    });

    return NextResponse.json({
      success: true,
      users: enrichedUsers,
      totalCount: enrichedUsers.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, tier, action, pctBoost } = body;

    const currentUser = getCurrentUser();
    const adminId = currentUser?.id || "user_admin_master";

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required." }, { status: 400 });
    }

    if (tier) {
      const updated = db.updateUserTier(userId, tier, adminId);
      return NextResponse.json({
        success: true,
        user: updated,
        message: `Updated plan tier to ${tier}.`,
      });
    }

    if (action === "replenish_g3fm") {
      db.replenishQuota(userId, "g3fm", pctBoost || 25);
      db.logAudit({
        admin_id: adminId,
        admin_email: currentUser?.email || "admin",
        action: "BOOST_USER_QUOTA",
        target_user_id: userId,
        details: `Boosted G3FM quota by ${pctBoost || 25}%`,
      });
      return NextResponse.json({
        success: true,
        message: `Replenished G3FM quota for user by ${pctBoost || 25}%.`,
      });
    }

    return NextResponse.json({ success: false, error: "No recognized update action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
