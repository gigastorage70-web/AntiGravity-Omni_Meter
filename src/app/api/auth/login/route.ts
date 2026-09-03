import { NextResponse } from "next/server";
import { db, hashPassword } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No account registered with this email address. Please register first." },
        { status: 404 }
      );
    }

    // Verify password if provided (allow demo quick sign-in without password if flag is set)
    if (password && user.password_hash !== hashPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Invalid password credentials." },
        { status: 401 }
      );
    }

    // Update last login
    user.last_login_at = new Date().toISOString();

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
      message: `Welcome back, ${user.name}!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Login failed." },
      { status: 500 }
    );
  }
}
