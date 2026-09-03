"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  HardDrive,
  Laptop,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

interface EnrichedUser {
  id: string;
  email: string;
  name: string;
  tier: "free" | "google_one_premium" | "workspace_enterprise" | "vertex_cloud";
  role: "user" | "admin";
  storage_limit_gb: number;
  storage_used_gb: number;
  deviceCount: number;
  devices: { id: string; name: string; type: string; ip: string }[];
  g3fmRemainingPct: number;
  tokensConsumed5h: number;
  chatSessionsCount: number;
  created_at: string;
  last_login_at: string;
}

interface PlatformMetrics {
  totalUsers: number;
  totalDevices: number;
  totalChats: number;
  totalImages: number;
  totalVideos: number;
  totalTokensConsumed: number;
  totalStorageUsedGb: number;
  activeUsers24h: number;
  systemStatus: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, metricsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/metrics"),
      ]);

      const usersData = await usersRes.json();
      const metricsData = await metricsRes.json();

      if (usersData.success) {
        setUsers(usersData.users);
      }
      if (metricsData.success) {
        setMetrics(metricsData.metrics);
        setAuditLogs(metricsData.auditLogs || []);
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error("Admin data error:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleBoostQuota = async (userId: string, email: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "replenish_g3fm",
          pctBoost: 25,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Replenished +25% capacity for ${email}`);
        fetchAdminData();
      }
    } catch (err) {
      showToast("Failed to replenish quota.");
    }
  };

  const handleUpgradeTier = async (userId: string, newTier: any) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tier: newTier }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Updated user plan to ${newTier}`);
        fetchAdminData();
      }
    } catch (err) {
      showToast("Failed to update user tier.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === "all" || u.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel px-4 py-3 rounded-xl border border-cyan-500/50 bg-slate-900/90 text-white text-xs font-semibold shadow-glow flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-purple-500/30 bg-[#070a10]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>User Dashboard</span>
          </Link>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-500 p-[1px] shadow-glow">
              <div className="w-full h-full bg-[#080c14] rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight text-white">
                  UNIVERSAL ADMIN CONSOLE
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/40">
                  MASTER CONTROLLER
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Multi-Tenant User Management • System Telemetry • Quota Intervention
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            MULTI-TENANT DB: ONLINE
          </span>
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all"
            title="Refresh All Records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6 flex-1">
        {/* Top 4 Platform KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
              <span>Registered Accounts</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{metrics?.totalUsers || users.length}</span>
              <span className="text-xs text-emerald-400 font-mono">100% active</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Free: {users.filter((u) => u.tier === "free").length} • One:{" "}
              {users.filter((u) => u.tier === "google_one_premium").length} • Enterprise:{" "}
              {users.filter((u) => u.tier === "workspace_enterprise").length}
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
              <span>Connected Fleet</span>
              <Laptop className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{metrics?.totalDevices || 3}</span>
              <span className="text-xs text-cyan-400 font-mono">Devices</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Workstations, Mobile ADB & Laptops linked
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
              <span>Platform Token Burn</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-400">
                {((metrics?.totalTokensConsumed || 942569) / 1000).toFixed(0)}k
              </span>
              <span className="text-xs text-slate-400 font-mono">Tokens (5h)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-model token throughput across all tenants
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
              <span>Total Tenant Storage</span>
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400">
                {metrics?.totalStorageUsedGb || 102.8} GB
              </span>
              <span className="text-xs text-slate-400 font-mono">Allocated</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Drive, Gmail, Photos & Antigravity R2 Vault
            </p>
          </div>
        </div>

        {/* User Directory Management Section */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Multi-Tenant User Management & Live Quota Telemetry
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect user-specific quota exhaustion, boost sliding 5-hour capacities, or upgrade plans.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user or email..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Plans</option>
                <option value="free">Free Tier (15 GB)</option>
                <option value="google_one_premium">Google One AI Premium (2 TB)</option>
                <option value="workspace_enterprise">Workspace Enterprise (5 TB)</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3 px-3">User Profile</th>
                  <th className="pb-3 px-3">Google Plan Tier</th>
                  <th className="pb-3 px-3">G3FM 5h Capacity</th>
                  <th className="pb-3 px-3">Storage Used</th>
                  <th className="pb-3 px-3">Devices</th>
                  <th className="pb-3 px-3">Last Active</th>
                  <th className="pb-3 px-3 text-right">Intervention Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => {
                  const isCritical = user.g3fmRemainingPct <= 20;

                  return (
                    <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.role === "admin" && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-300 font-mono">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <select
                          value={user.tier}
                          onChange={(e) => handleUpgradeTier(user.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500"
                        >
                          <option value="free">Google Free Tier (15 GB)</option>
                          <option value="google_one_premium">Google One AI Premium (2 TB)</option>
                          <option value="workspace_enterprise">Workspace Enterprise (5 TB)</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="space-y-1 w-32">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className={isCritical ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                              {user.g3fmRemainingPct}% left
                            </span>
                            <span className="text-slate-500">{(user.tokensConsumed5h / 1000).toFixed(0)}k burned</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isCritical ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${user.g3fmRemainingPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono">
                        <span className="text-white font-bold">{user.storage_used_gb.toFixed(1)} GB</span>
                        <span className="text-slate-500 text-[10px]"> / {user.storage_limit_gb} GB</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {user.deviceCount} connected
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 text-[11px] font-mono">
                        {user.last_login_at ? new Date(user.last_login_at).toLocaleTimeString() : "Just now"}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleBoostQuota(user.id, user.email)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3" />
                          Boost +25%
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Fleet Inspector & Audit Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Fleet */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Live Device Fleet Inspector (Across All Users)
            </h3>
            <div className="space-y-2">
              {users.flatMap((u) =>
                u.devices.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        {d.type === "mobile" ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-200">{d.name}</span>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Owner: {u.email} • IP: {d.ip}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ONLINE
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Platform Administrative Audit Trail
            </h3>
            <div className="space-y-2">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-300">{log.action}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{log.details}</div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
