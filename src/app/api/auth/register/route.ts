import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, tier } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const validTiers = ["free", "google_one_premium", "workspace_enterprise", "vertex_cloud"];
    const chosenTier = validTiers.includes(tier) ? tier : "free";

    const user = db.createUser({
      email,
      password,
      name: name || email.split("@")[0],
      tier: chosenTier,
      role: email.includes("admin") ? "admin" : "user",
    });

    // Set session cookie
    const token = setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
      issuedAt: Date.now(),
    });

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
      token,
      message: `Account registered successfully on ${user.tier} plan.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Registration failed." },
      { status: 400 }
    );
  }
}
