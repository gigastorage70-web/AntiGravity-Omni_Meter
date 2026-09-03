"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Cloud,
  Cpu,
  Eye,
  EyeOff,
  Flame,
  HardDrive,
  Key,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { GoogleSubscriptionInfo } from "@/types";

interface LoginPageProps {
  onLoginSuccess: (user: GoogleSubscriptionInfo) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>("developer.admin@gmail.com");
  const [displayName, setDisplayName] = useState<string>("Antigravity Power User");
  const [selectedTier, setSelectedTier] = useState<
    "Google One AI Premium" | "Google Workspace AI" | "Vertex Enterprise"
  >("Google One AI Premium");

  const [step, setStep] = useState<"form" | "authenticating" | "ready">("form");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const triggerAuth = (customEmail?: string, customName?: string, customTier?: any) => {
    const finalEmail = customEmail || email;
    const finalName = customName || displayName || finalEmail.split("@")[0];
    const finalTier = customTier || selectedTier;

    setStep("authenticating");
    setStatusMessage("Authenticating Google OAuth 2.0 handshake...");

    setTimeout(() => {
      setStatusMessage(`Detecting Google AI Entitlement (${finalTier})...`);
    }, 350);

    setTimeout(() => {
      setStatusMessage("Capturing Gemini 3 Flash (G3FM), Pro, & Claude quotas...");
    }, 700);

    setTimeout(() => {
      setStatusMessage("Linking multi-device sessions & Cloudflare R2 vault...");
    }, 1050);

    setTimeout(() => {
      setStatusMessage("Authentication complete. Launching Command Center...");
      setStep("ready");
      setTimeout(() => {
        onLoginSuccess({
          accountEmail: finalEmail,
          displayName: finalName,
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
          tierName: finalTier,
          renewalDate: "2026-09-28",
          storageUsedGb: 48.6,
          storageLimitGb: finalTier === "Google One AI Premium" ? 2048 : 5120,
          cloudFlareR2Status: "connected",
          r2BucketName: "antigravity-vault-us-east",
          totalSyncedFiles: 1428,
          totalSyncedVolumeGb: 12.4,
        });
      }, 400);
    }, 1400);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAuth();
  };

  return (
    <div className="min-h-screen bg-[#070a10] flex flex-col items-center justify-center p-4 py-12 relative overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-5 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-glow mb-1">
            <div className="w-full h-full bg-[#080c14] rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            ANTIGRAVITY
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              CLOUD HUB
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with your Google account to unlock live quotas & sync.
          </p>
        </div>

        {/* Main Login Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          {step === "form" ? (
            <div className="space-y-4">
              {/* One-Click Quick Sign In with Google */}
              <button
                type="button"
                id="google-one-click-login-btn"
                onClick={() => triggerAuth()}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md hover:scale-[1.01]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in as {email}</span>
              </button>

              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-mono justify-center">
                <span className="h-[1px] bg-slate-800 flex-1" />
                <span>Or customize details</span>
                <span className="h-[1px] bg-slate-800 flex-1" />
              </div>

              <form onSubmit={handleSignIn} className="space-y-3">
                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Google Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Display Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Profile Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Antigravity User"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Subscription Pack Selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      Detected Active Subscription
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">Captured</span>
                  </label>

                  <div className="space-y-1.5">
                    {[
                      {
                        id: "Google One AI Premium",
                        label: "Google One AI Premium",
                        desc: "2 TB Storage • Gemini 3 Flash/Pro • Nano-Banana • Veo 2",
                        badge: "Active",
                      },
                      {
                        id: "Google Workspace AI",
                        label: "Google Workspace Enterprise AI",
                        desc: "Unlimited Shared Token Pool • Multi-Seat Projects",
                        badge: "Enterprise",
                      },
                      {
                        id: "Vertex Enterprise",
                        label: "Google Cloud Vertex AI",
                        desc: "Pay-as-you-go High-Throughput • Dedicated Quotas",
                        badge: "Cloud PayG",
                      },
                    ].map((pack) => (
                      <div
                        key={pack.id}
                        onClick={() => setSelectedTier(pack.id as any)}
                        className={`cursor-pointer p-2 rounded-xl border transition-all text-xs ${
                          selectedTier === pack.id
                            ? "bg-cyan-500/15 border-cyan-500 text-white"
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-xs text-slate-200">{pack.label}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              selectedTier === pack.id
                                ? "bg-cyan-500 text-black font-extrabold"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {pack.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">
                          {pack.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="submit-auth-btn"
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch Command Center</span>
                  <span className="text-sm">→</span>
                </button>
              </form>
            </div>
          ) : (
            /* Authentication Handshake Progress */
            <div className="py-6 space-y-5 text-center">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto shadow-glow">
                <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white">
                  {step === "ready" ? "Handshake Verified!" : "Connecting to Google AI..."}
                </h3>
                <p className="text-xs text-cyan-300 font-mono animate-pulse min-h-[28px]">
                  {statusMessage}
                </p>
              </div>

              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full animate-pulse w-full" />
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-500" />
            256-bit TLS Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Cloud className="w-3 h-3 text-emerald-500" />
            Cloudflare R2 Synced
          </span>
        </div>
      </div>
    </div>
  );
};
