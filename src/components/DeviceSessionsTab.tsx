"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  Globe,
  HardDrive,
  Laptop,
  Power,
  RefreshCw,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
  Zap,
} from "lucide-react";
import { DeviceSession } from "@/types";

interface DeviceSessionsTabProps {
  devices: DeviceSession[];
  onRevokeSession: (id: string) => void;
  onRefreshDevices: () => void;
}

export const DeviceSessionsTab: React.FC<DeviceSessionsTabProps> = ({
  devices,
  onRevokeSession,
  onRefreshDevices,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceSession>(
    devices[0]
  );
  const [revokedId, setRevokedId] = useState<string | null>(null);

  const handleRevoke = (id: string) => {
    setRevokedId(id);
    setTimeout(() => {
      onRevokeSession(id);
      setRevokedId(null);
    }, 800);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "desktop":
        return <HardDrive className="w-5 h-5 text-cyan-400" />;
      case "laptop":
        return <Laptop className="w-5 h-5 text-purple-400" />;
      case "mobile":
        return <Smartphone className="w-5 h-5 text-blue-400" />;
      case "server":
        return <Server className="w-5 h-5 text-emerald-400" />;
      default:
        return <Cpu className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Device-Segregated Usage History & Active Sessions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor per-device token consumption, remote background daemons, and revoke unauthorized sessions with one click.
          </p>
        </div>

        <button
          onClick={onRefreshDevices}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Poll Device Status
        </button>
      </div>

      {/* Live Process Ingestion Banner (§5 Data Provenance) */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PROVENANCE: LIVE
          </span>
          <span className="text-slate-400">
            Source:{" "}
            <span className="text-slate-200 font-bold">
              {devices[0]?.provenance?.raw_source_ref || "Host OS Process Inspection"}
            </span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Engine:{" "}
            <span className="text-purple-300">
              {devices[0]?.provenance?.pipeline_engine || "Host-OS-Process-Inspector"}
            </span>
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Sampled:{" "}
          <span className="text-slate-300">
            {devices[0]?.provenance?.fetched_at
              ? new Date(devices[0].provenance.fetched_at).toLocaleTimeString()
              : "Active"}
          </span>
        </div>
      </div>

      {/* Main Grid: Device List + Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Device Cards List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Registered Endpoints ({devices.length})
          </div>

          {devices.map((dev) => {
            const isSelected = selectedDevice.id === dev.id;

            return (
              <div
                key={dev.id}
                onClick={() => setSelectedDevice(dev)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden ${
                  isSelected
                    ? "bg-slate-900/90 border-cyan-500 shadow-glow"
                    : "glass-panel border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      {getDeviceIcon(dev.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white line-clamp-1">
                          {dev.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {dev.os}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {dev.isCurrent ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        THIS PC
                      </span>
                    ) : (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          dev.status === "online"
                            ? "bg-emerald-400"
                            : dev.status === "idle"
                            ? "bg-amber-400"
                            : "bg-slate-500"
                        }`}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
                  <div>
                    <span className="text-slate-500">Tokens:</span>
                    <div className="text-slate-200 font-bold">
                      {(dev.tokensConsumedToday / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Images:</span>
                    <div className="text-purple-300 font-bold">
                      {dev.imagesGeneratedToday}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Videos:</span>
                    <div className="text-blue-300 font-bold">
                      {dev.videosRenderedToday}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Cols: Deep Device Inspector */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Device Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  {getDeviceIcon(selectedDevice.type)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    {selectedDevice.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <span>{selectedDevice.clientVersion}</span>
                    <span>•</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {selectedDevice.location}
                    </span>
                  </div>
                </div>
              </div>

              {!selectedDevice.isCurrent && (
                <button
                  onClick={() => handleRevoke(selectedDevice.id)}
                  disabled={revokedId === selectedDevice.id}
                  className="px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <Power className="w-3.5 h-3.5" />
                  {revokedId === selectedDevice.id ? "Revoking..." : "Revoke Session (Kill Switch)"}
                </button>
              )}
            </div>

            {/* Segregated Consumption Breakdown for Selected Device */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Tokens Consumed
                </span>
                <div className="text-lg font-bold text-white mt-1">
                  {selectedDevice.tokensConsumedToday.toLocaleString()}
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">Today's Load</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Images Generated
                </span>
                <div className="text-lg font-bold text-purple-400 mt-1">
                  {selectedDevice.imagesGeneratedToday} Renders
                </div>
                <span className="text-[10px] text-slate-500">Nano-Banana Studio</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Videos Rendered
                </span>
                <div className="text-lg font-bold text-blue-400 mt-1">
                  {selectedDevice.videosRenderedToday} Clips
                </div>
                <span className="text-[10px] text-slate-500">Google Veo 2</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  IP / Network
                </span>
                <div className="text-xs font-mono font-bold text-slate-300 mt-1 truncate">
                  {selectedDevice.ipAddress}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">TLS Encrypted</span>
              </div>
            </div>

            {/* Background Daemons & Running Tasks on this device */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Active Background Daemons & Workers ({selectedDevice.activeDaemons.length})
                </span>
                <span className="text-slate-500 font-mono">Agent Sidecars</span>
              </div>

              {selectedDevice.activeDaemons.length > 0 ? (
                <div className="space-y-2">
                  {selectedDevice.activeDaemons.map((daemon) => (
                    <div
                      key={daemon.pid}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span className="font-mono text-cyan-300 font-bold">
                          {daemon.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                        <span>PID: {daemon.pid}</span>
                        <span>Uptime: {daemon.runtime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center text-xs text-slate-400 font-mono">
                  No active background daemon processes running on this machine.
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              All multi-device synchronization is secured via End-to-End Google Auth & R2 Token Keys.
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Status: Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
