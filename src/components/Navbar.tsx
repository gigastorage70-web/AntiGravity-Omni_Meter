"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Cloud,
  Layers,
  LogOut,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  User,
  Zap,
} from "lucide-react";
import { GoogleSubscriptionInfo } from "@/types";

interface NavbarProps {
  subscription: GoogleSubscriptionInfo;
  isSyncing: boolean;
  onTriggerSync: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeDeviceCount: number;
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  subscription,
  isSyncing,
  onTriggerSync,
  onOpenAuthModal,
  onSignOut,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  activeDeviceCount,
  isAdmin = false,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080c14]/85 backdrop-blur-xl px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Title */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveTab("overview")}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-glow">
            <div className="w-full h-full bg-[#090d16] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                ANTIGRAVITY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                OMNI-METER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multi-Tenant Cloud Command Center • Isolated User Telemetry
            </p>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search chats, prompts, model logs, R2 files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>

        {/* Right: Cloud Sync, Admin Console Link, Tier Status, Google Auth & Sign Out */}
        <div className="flex items-center gap-3">
          {/* Universal Admin Console Quick Access */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all shadow-glow"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Console</span>
            </Link>
          )}

          {/* Cloudflare R2 Sync Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="relative flex items-center justify-center">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
              <span className={`w-2 h-2 rounded-full absolute ${isSyncing ? "bg-amber-400" : "bg-emerald-400"}`} />
            </div>
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-medium hidden lg:inline">
              R2 Vault:
            </span>
            <span className="text-cyan-400 font-semibold">
              {isSyncing ? "Syncing..." : "Synchronized"}
            </span>
            <button
              onClick={onTriggerSync}
              title="Manual Trigger Sync"
              className="ml-1 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-sync-spin text-cyan-400" : ""}`} />
            </button>
          </div>

          {/* Connected Devices Badge */}
          <div
            onClick={() => setActiveTab("devices")}
            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold text-purple-400">{activeDeviceCount}</span>
            <span className="hidden sm:inline">Devices</span>
          </div>

          {/* Google Account Profile Chip */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 transition-all shadow-sm group"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-500/50 bg-slate-800 flex items-center justify-center">
              {subscription.avatarUrl ? (
                <img
                  src={subscription.avatarUrl}
                  alt={subscription.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                {subscription.displayName}
                <ShieldCheck className="w-3 h-3 text-cyan-400 inline" />
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">
                {subscription.tierName}
              </div>
            </div>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            title="Sign Out to Login Screen"
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all flex items-center gap-1 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
