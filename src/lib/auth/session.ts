import crypto from "crypto";
import { cookies } from "next/headers";
import { db, UserRecord } from "@/lib/db";

const SESSION_SECRET = "omni_meter_session_secret_2026_antigravity";
const SESSION_COOKIE_NAME = "omni_user_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
  tier: string;
  issuedAt: number;
}

export function createSessionToken(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [data, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("base64url");

    if (signature !== expectedSig) return null;

    const payload: SessionPayload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    );

    // Tokens valid for 30 days
    if (Date.now() - payload.issuedAt > 30 * 24 * 60 * 60 * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getCurrentUser(): UserRecord | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload) return null;

    const user = db.getUserById(payload.userId);
    return user || null;
  } catch {
    return null;
  }
}

export function setSessionCookie(payload: SessionPayload) {
  const token = createSessionToken(payload);
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  return token;
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
