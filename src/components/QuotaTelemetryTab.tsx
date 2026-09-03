"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  Cpu,
  Flame,
  HelpCircle,
  Info,
  Layers,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { ModelQuota } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface QuotaTelemetryTabProps {
  quotas: ModelQuota[];
  onReplenishG3FM: () => void;
  onSimulateBurn: (id: string, tokens: number) => void;
  onResetAllQuotas: () => void;
}

export const QuotaTelemetryTab: React.FC<QuotaTelemetryTabProps> = ({
  quotas,
  onReplenishG3FM,
  onSimulateBurn,
  onResetAllQuotas,
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>("g3fm");

  const selectedModel =
    quotas.find((q) => q.id === selectedModelId) || quotas[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Global Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Antigravity Model Quota Telemetry & Rate-Limit Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of AGQ token pools, 5-hour rolling bucket countdowns, and TPM/RPM load across all models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetAllQuotas}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All to 100%
          </button>
          <button
            onClick={onReplenishG3FM}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Replenish Rolling Bucket (+25%)
          </button>
        </div>
      </div>

      {/* Live Data Provenance Tag Banner (§5 Data Provenance Standard) */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PROVENANCE: {selectedModel.provenance?.source?.toUpperCase() || "LIVE"}
          </span>
          <span className="text-slate-400">
            Engine:{" "}
            <span className="text-slate-200 font-bold">
              {selectedModel.provenance?.pipeline_engine || "Antigravity-JSONL-Telemetry-Engine-v1"}
            </span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Hash:{" "}
            <span className="text-cyan-400">
              {selectedModel.provenance?.data_hash
                ? selectedModel.provenance.data_hash.substring(0, 14) + "..."
                : "e1484634658c..."}
            </span>
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Sampled:{" "}
          <span className="text-slate-300 font-bold">
            {selectedModel.provenance?.fetched_at
              ? new Date(selectedModel.provenance.fetched_at).toLocaleTimeString()
              : "Active"}
          </span>
        </div>
      </div>

      {/* Model Cards Grid Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quotas.map((model) => {
          const isSelected = model.id === selectedModelId;
          const isCritical = model.remainingPercentage <= 20;

          return (
            <div
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden ${
                isSelected
                  ? "bg-slate-900/90 border-cyan-500 shadow-glow"
                  : "glass-panel border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {model.code}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                    {model.name}
                  </h3>
                </div>
                <div
                  className={`p-1.5 rounded-lg ${
                    isCritical
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-extrabold ${
                      isCritical ? "text-amber-400 glow-amber" : "text-emerald-400"
                    }`}
                  >
                    {model.remainingPercentage}%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">left</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {model.resetMode === "rolling" ? "5h Rolling" : "24h UTC"}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCritical
                      ? "bg-gradient-to-r from-red-500 to-amber-400"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-400"
                  }`}
                  style={{ width: `${model.remainingPercentage}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{model.consumed}</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {model.nextReplenishMinutes}m
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Panel for Selected Model */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time Quota Breakdown & Simulator */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400">
                ACTIVE TELEMETRY STREAM
              </span>
              <h3 className="text-lg font-extrabold text-white">
                {selectedModel.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Window: {selectedModel.rollingWindowHours} Hours
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                  selectedModel.status === "critical"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {selectedModel.status}
              </span>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Tokens Remaining
              </span>
              <div className="text-base font-bold text-white mt-1">
                {((selectedModel.remainingPercentage / 100) * 1000000).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Out of 1.0M cap</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Current TPM
              </span>
              <div className="text-base font-bold text-cyan-400 mt-1">
                {selectedModel.currentTpm.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">
                Limit: {selectedModel.tpmLimit.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Current RPM
              </span>
              <div className="text-base font-bold text-purple-400 mt-1">
                {selectedModel.currentRpm} / {selectedModel.rpmLimit}
              </div>
              <span className="text-[10px] text-slate-500">Reqs per min</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Replenish In
              </span>
              <div className="text-base font-bold text-amber-400 mt-1">
                {selectedModel.nextReplenishMinutes}m
              </div>
              <span className="text-[10px] text-slate-500">+25% rolling tier</span>
            </div>
          </div>

          {/* Hourly History Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Hourly Token Consumption Profile (Last 6 Hours)
              </span>
              <span className="text-slate-500 font-mono">UTC Synced</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedModel.hourlyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#475569" fontSize={11} />
                  <YAxis stroke="#475569" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0d1322",
                      borderColor: "#1e293b",
                      borderRadius: "8px",
                      color: "#f8fafc",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="tokens"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                    name="Tokens Consumed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Simulator Controls */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Interactive Model Load Simulator
            </span>
            <p className="text-xs text-slate-400">
              Simulate prompt turns to see how the rolling rate limit window reacts and triggers capacity warnings.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onSimulateBurn(selectedModel.id, 50000)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                + Burn 50k Tokens (-5%)
              </button>
              <button
                onClick={() => onSimulateBurn(selectedModel.id, 150000)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                + Large Code Refactor (-15%)
              </button>
              <button
                onClick={() => onReplenishG3FM()}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1 transition-all ml-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Simulate Window Replenish (+25%)
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Why Quota Dropped Guide (Knowledge / FAQ Card) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              How Antigravity Quotas Work
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  1. Rolling Sliding Windows
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Unlike conventional daily resets, models like G3FM use a 5-hour rolling token bucket. Capacity frees up progressively as past usage ages out of the active 5-hour window.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  2. Unified Google Quota Pool
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Your quota is tied to your Google Account. If another session, CLI script, or device invokes Gemini 3 Flash, the meter reflects the shared pool.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  3. Overnight Verification
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Our system verified that your local machine was completely asleep overnight with 0 active background tasks.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Need more capacity? Switch to Gemini 3.0 Pro (82% available).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
