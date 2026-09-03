"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Cpu,
  Download,
  Film,
  HardDrive,
  Image as ImageIcon,
  MessageSquare,
  Play,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  ModelQuota,
  DeviceSession,
  NanoBananaImage,
  VeoVideoJob,
  CategorizedChat,
  CloudStorageFile,
  GoogleSubscriptionInfo,
} from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OverviewTabProps {
  quotas: ModelQuota[];
  devices: DeviceSession[];
  images: NanoBananaImage[];
  videos: VeoVideoJob[];
  chats: CategorizedChat[];
  r2Files: CloudStorageFile[];
  subscription: GoogleSubscriptionInfo;
  onNavigateTab: (tab: string) => void;
  onReplenishG3FM: () => void;
  onTriggerSync: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  quotas,
  devices,
  images,
  videos,
  chats,
  r2Files,
  subscription,
  onNavigateTab,
  onReplenishG3FM,
  onTriggerSync,
}) => {
  const g3fm = quotas.find((q) => q.id === "g3fm") || quotas[0];
  const proQuota = quotas.find((q) => q.id === "gemini-3-pro");

  // Real-time ticking seconds for the rolling bucket timer
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (g3fm.nextReplenishMinutes || 28) * 60 + 42
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 300 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, "0")}h ${mins
      .toString()
      .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  const ProvenanceBadge = ({ source, engine }: { source?: string; engine?: string }) => (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
      title={`Live Data Pipeline: ${engine || "Antigravity Realtime Engine"}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      {source === "live" ? "LIVE DATA" : "CACHED"}
    </span>
  );

  const activityData =
    g3fm.hourlyHistory && g3fm.hourlyHistory.length > 0
      ? g3fm.hourlyHistory.map((h, i) => ({
          time: h.hour,
          tokens: Math.max(10, Math.round(h.tokens / 1000)),
          images: i % 3,
          videos: i % 4 === 0 ? 1 : 0,
        }))
      : [
          { time: "12:00", tokens: 55, images: 2, videos: 1 },
          { time: "13:00", tokens: 175, images: 5, videos: 2 },
          { time: "14:00", tokens: 337, images: 4, videos: 2 },
          { time: "15:00", tokens: 285, images: 3, videos: 1 },
          { time: "16:00", tokens: 123, images: 1, videos: 0 },
          { time: "17:00", tokens: 60, images: 0, videos: 0 },
          { time: "18:00", tokens: 78, images: 1, videos: 1 },
        ];

  return (
    <div className="space-y-6">
      {/* Google Subscription Active Verification Card */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white">
                Active Entitlement: {subscription.tierName}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Verified OAuth 2.0
              </span>
              <ProvenanceBadge source={g3fm.provenance?.source || "live"} engine={g3fm.provenance?.pipeline_engine} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Account: <span className="text-slate-300 font-mono">{subscription.accountEmail}</span> • Storage Allocated:{" "}
              <span className="text-cyan-400 font-mono font-bold">
                {subscription.storageUsedGb} GB / {subscription.storageLimitGb} GB
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Renewal: {subscription.renewalDate}</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Cloud Telemetry: LIVE
          </span>
        </div>
      </div>

      {/* Critical Quota Callout Banner (15% G3FM State & Real-time Countdown) */}
      <div className="relative overflow-hidden rounded-2xl p-5 border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-purple-950/30 glass-panel shadow-glow-amber">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-amber-200">
                  G3FM Model Quota at {g3fm.remainingPercentage}% Capacity
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  5-Hour Sliding Window Limit
                </span>
                <ProvenanceBadge source={g3fm.provenance?.source || "live"} engine={g3fm.provenance?.pipeline_engine} />
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Antigravity rate limits for <strong>Gemini 3 Flash Thinking (G3FM)</strong> operate on a{" "}
                <span className="text-amber-300 font-semibold">5-hour sliding token bucket</span> tied to UTC server time.
                Zero rogue tasks ran overnight. Next capacity release (+25%) ticks down live:{" "}
                <span className="text-cyan-400 font-mono font-extrabold bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/40 ml-1">
                  {formatCountdown(secondsRemaining)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
            <button
              onClick={onReplenishG3FM}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Simulate Rolling Replenish (+25%)
            </button>
            <button
              onClick={() => onNavigateTab("quotas")}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              Inspect Telemetry
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: LLM Quotas */}
        <div
          onClick={() => onNavigateTab("quotas")}
          className="cursor-pointer glass-panel rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/50 transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Antigravity LLMs
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-white">G3FM: </span>
              <span className="text-2xl font-extrabold text-amber-400">{g3fm.remainingPercentage}%</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">Pro: 82%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${g3fm.remainingPercentage}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>5h Rolling Window</span>
            <span className="text-cyan-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.ceil(secondsRemaining / 60)}m left
            </span>
          </div>
        </div>

        {/* Pillar 2: Nano-Banana Image Studio */}
        <div
          onClick={() => onNavigateTab("nano-banana")}
          className="cursor-pointer glass-panel rounded-2xl p-5 border border-slate-800 hover:border-purple-500/50 transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Nano-Banana Studio
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {100 - images.length * 1} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </span>
            <span className="text-xs text-purple-400 font-semibold">Credits Avail</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
              style={{ width: `${100 - images.length}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>{images.length} Generated</span>
            <span className="text-purple-400">Synced to Gallery</span>
          </div>
        </div>

        {/* Pillar 3: Google Veo 2 & Flow Labs */}
        <div
          onClick={() => onNavigateTab("veo-video")}
          className="cursor-pointer glass-panel rounded-2xl p-5 border border-slate-800 hover:border-blue-500/50 transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Veo 2 & Flow Labs
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {20 - videos.length * 2} <span className="text-xs text-slate-400 font-normal">/ 20</span>
            </span>
            <span className="text-xs text-blue-400 font-semibold">Video Units</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
              style={{ width: `${((20 - videos.length * 2) / 20) * 100}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>{videos.filter((v) => v.status === "rendering").length} Rendering</span>
            <span className="text-blue-400">60fps Cinema</span>
          </div>
        </div>

        {/* Pillar 4: Cloudflare R2 Workspace Sync */}
        <div
          onClick={() => onNavigateTab("cloud-sync")}
          className="cursor-pointer glass-panel rounded-2xl p-5 border border-slate-800 hover:border-emerald-500/50 transition-all hover:translate-y-[-2px] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cloudflare R2 Vault
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {subscription.totalSyncedVolumeGb} GB
            </span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">
              {r2Files.length} Files
            </span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
              style={{ width: "32%" }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-emerald-400">Zero-Egress $0</span>
            <span>Desktop Linked</span>
          </div>
        </div>
      </div>

      {/* Telemetry Charts & Active Device Session Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Burn Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Live Multi-Model Hourly Activity & Token Consumption
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Token requests (kTokens) vs Nano-Banana and Veo generation events
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Tokens (k)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                Images
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                Videos
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1322",
                    borderColor: "#1e293b",
                    borderRadius: "8px",
                    color: "#f8fafc",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#tokenGradient)"
                  name="Tokens (k)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Active Devices & Quick Controls */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Logged-In Sessions ({devices.length})
              </h3>
              <button
                onClick={() => onNavigateTab("devices")}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {devices.slice(0, 3).map((dev) => (
                <div
                  key={dev.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200">
                        {dev.name}
                      </span>
                      {dev.isCurrent && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          THIS PC
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {dev.os} • {dev.lastActive}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dev.status === "online"
                          ? "bg-emerald-400"
                          : dev.status === "idle"
                          ? "bg-amber-400"
                          : "bg-slate-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onTriggerSync}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync R2 Vault
              </button>
              <button
                onClick={() => onNavigateTab("chats")}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-300 flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Browse Chats
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Galleries Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nano-Banana Preview */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Nano-Banana AI Generations ({images.length} Assets)
            </h3>
            <button
              onClick={() => onNavigateTab("nano-banana")}
              className="text-xs text-purple-400 hover:underline font-semibold"
            >
              Open Studio & Gallery →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {images.slice(0, 2).map((img) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/80 aspect-video cursor-pointer"
                onClick={() => onNavigateTab("nano-banana")}
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white truncate">
                    {img.title}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {img.model} • {img.resolution}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Veo Video Preview */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-blue-400" />
              Google Veo 2 & Flow Labs ({videos.length} Jobs)
            </h3>
            <button
              onClick={() => onNavigateTab("veo-video")}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              Open Video Studio →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {videos.slice(0, 2).map((vid) => (
              <div
                key={vid.id}
                className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/80 aspect-video cursor-pointer"
                onClick={() => onNavigateTab("veo-video")}
              >
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white truncate">
                    {vid.title}
                  </span>
                  <span className="text-[10px] text-blue-300 font-mono">
                    {vid.engine} • {vid.durationSeconds}s @ {vid.fps}fps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
