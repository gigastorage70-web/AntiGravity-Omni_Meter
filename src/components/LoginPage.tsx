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
  Lock,
  Mail,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Zap,
} from "lucide-react";
import { GoogleSubscriptionInfo } from "@/types";

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState<string>("developer.admin@gmail.com");
  const [name, setName] = useState<string>("Antigravity Power User");
  const [password, setPassword] = useState<string>("DeveloperPassword2026!");
  const [selectedTier, setSelectedTier] = useState<
    "free" | "google_one_premium" | "workspace_enterprise" | "vertex_cloud"
  >("google_one_premium");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const executeAuth = async (customEmail?: string, customPassword?: string, customTier?: any) => {
    const finalEmail = customEmail || email;
    const finalPassword = customPassword || password || "DemoPassword2026!";
    const finalTier = customTier || selectedTier;

    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage("Connecting to Multi-Tenant Authentication Gateway...");

    try {
      const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        authMode === "register"
          ? { email: finalEmail, password: finalPassword, name, tier: finalTier }
          : { email: finalEmail, password: finalPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      setStatusMessage("OAuth handshake verified. Loading isolated user telemetry...");

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(data.user);
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || "Failed to authenticate.");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeAuth();
  };

  const handleQuickDemoUser = (type: "admin" | "premium" | "free") => {
    if (type === "admin") {
      setEmail("admin@antigravity.internal");
      setName("System Super Admin");
      setPassword("AdminPassword2026!");
      setSelectedTier("workspace_enterprise");
      executeAuth("admin@antigravity.internal", "AdminPassword2026!", "workspace_enterprise");
    } else if (type === "premium") {
      setEmail("developer.admin@gmail.com");
      setName("Antigravity Power User");
      setPassword("DeveloperPassword2026!");
      setSelectedTier("google_one_premium");
      executeAuth("developer.admin@gmail.com", "DeveloperPassword2026!", "google_one_premium");
    } else {
      setEmail("free.user@gmail.com");
      setName("Google Free Tier User");
      setPassword("FreePassword2026!");
      setSelectedTier("free");
      executeAuth("free.user@gmail.com", "FreePassword2026!", "free");
    }
  };

  return (
    <div className="min-h-screen bg-[#070a10] flex flex-col items-center justify-center p-4 py-10 relative overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-4 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-glow mb-1">
            <div className="w-full h-full bg-[#080c14] rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            ANTIGRAVITY
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              MULTI-TENANT PAAS
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Sign in or register any Google Account (Free or Premium) for isolated monitoring.
          </p>
        </div>

        {/* Quick Multi-Tenant Demo Switcher */}
        <div className="glass-panel p-2.5 rounded-2xl border border-slate-800 space-y-1.5 bg-slate-900/40">
          <span className="text-[10px] font-mono text-slate-400 uppercase block text-center font-bold">
            1-Click Multi-Tenant Accounts
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoUser("admin")}
              className="px-2 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-[10px] font-bold transition-all flex flex-col items-center"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400 mb-0.5" />
              <span>Admin Console</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoUser("premium")}
              className="px-2 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 text-[10px] font-bold transition-all flex flex-col items-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
              <span>Google One (2 TB)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoUser("free")}
              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-bold transition-all flex flex-col items-center"
            >
              <User className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
              <span>Free Tier (15 GB)</span>
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          {/* Mode Tabs: Login vs Register */}
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === "login"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Existing Account Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                authMode === "register"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              New User Register
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 mb-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isLoading ? (
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {authMode === "register" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Full Name / Profile
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Google Account Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {authMode === "register" && (
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                    <span>Select Active Google Plan</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Isolated Limits</span>
                  </label>

                  <div className="space-y-1.5">
                    {[
                      {
                        id: "free",
                        label: "Google Free Tier",
                        storage: "15 GB Storage",
                        desc: "Standard Gemini rate limits • 15 Banana Credits",
                        badge: "Free",
                      },
                      {
                        id: "google_one_premium",
                        label: "Google One AI Premium",
                        storage: "2 TB (2,048 GB)",
                        desc: "G3FM 1M Rolling Bucket • 100 Credits • 20 Veo Units",
                        badge: "Active Premium",
                      },
                      {
                        id: "workspace_enterprise",
                        label: "Google Workspace Enterprise",
                        storage: "5 TB Pooled",
                        desc: "Unlimited Multi-Seat • Priority Throughput",
                        badge: "Enterprise",
                      },
                    ].map((pack) => (
                      <div
                        key={pack.id}
                        onClick={() => setSelectedTier(pack.id as any)}
                        className={`cursor-pointer p-2.5 rounded-xl border transition-all text-xs ${
                          selectedTier === pack.id
                            ? "bg-cyan-500/15 border-cyan-500 text-white"
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-200">{pack.label}</span>
                          <span className="text-[10px] font-mono text-cyan-400">{pack.storage}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{pack.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <span>{authMode === "register" ? "Create Account & Start Isolated Session" : "Launch Omniverse Session"}</span>
                <span>→</span>
              </button>
            </form>
          ) : (
            <div className="py-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-glow">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Authenticating Multi-Tenant Session</h3>
                <p className="text-xs text-cyan-300 font-mono mt-1">{statusMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-3 font-mono">
          <span>Persistent Database Enabled</span>
          <span>•</span>
          <span>Role-Based Access Control</span>
        </div>
      </div>
    </div>
  );
};
