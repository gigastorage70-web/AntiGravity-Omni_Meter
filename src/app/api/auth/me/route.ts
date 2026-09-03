import { NextResponse } from "next/server";
import { getCurrentUser, clearSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

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
  });
}

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully." });
}
