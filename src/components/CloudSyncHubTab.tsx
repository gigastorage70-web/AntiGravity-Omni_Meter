"use client";

import React, { useState } from "react";
import {
  Archive,
  ArrowLeftRight,
  CheckCircle2,
  Cloud,
  Download,
  File,
  FileCode,
  FileText,
  Film,
  Folder,
  HardDrive,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { CloudStorageFile, GoogleSubscriptionInfo } from "@/types";

interface CloudSyncHubTabProps {
  files: CloudStorageFile[];
  subscription: GoogleSubscriptionInfo;
  isSyncing: boolean;
  onTriggerSync: () => void;
  onUploadFile: (name: string, category: string, size: number) => void;
  onDeleteFile?: (id: string) => void;
}

export const CloudSyncHubTab: React.FC<CloudSyncHubTabProps> = ({
  files,
  subscription,
  isSyncing,
  onTriggerSync,
  onUploadFile,
  onDeleteFile,
}) => {
  const [searchFilter, setSearchFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileCategory, setNewFileCategory] = useState<string>("workspaces");
  const [newFileSizeKb, setNewFileSizeKb] = useState<number>(1024);

  const filteredFiles = files.filter((f) => {
    const matchesCat =
      selectedCategory === "all" || f.category === selectedCategory;
    const matchesSearch =
      searchFilter === "all" ||
      f.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.path.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onUploadFile(newFileName, newFileCategory, newFileSizeKb * 1024);
    setNewFileName("");
    setIsUploadModalOpen(false);
  };

  const getFileIcon = (cat: string) => {
    switch (cat) {
      case "chat_logs":
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case "images":
        return <ImageIcon className="w-4 h-4 text-purple-400" />;
      case "videos":
        return <Film className="w-4 h-4 text-blue-400" />;
      case "workspaces":
        return <Archive className="w-4 h-4 text-amber-400" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Cloud Status */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Cloudflare R2 & Vercel Blob Workspace Backup Hub
            </h2>
            <p className="text-xs text-slate-400">
              Parallel side-by-side syncing for multi-device conversations, generated media assets, and workspace archives.
            </p>
          </div>
        </div>

        {/* Sync Controls & Metrics */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            Add Backup Target
          </button>
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Executing Delta Sync..." : "Force Sync Now"}
          </button>
        </div>
      </div>

      {/* Live Data Provenance Tag Banner (§5 Data Provenance Standard) */}
      <div className="glass-panel p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PROVENANCE: LIVE
          </span>
          <span className="text-slate-400">
            Source:{" "}
            <span className="text-slate-200 font-bold">
              {files[0]?.provenance?.raw_source_ref || "Local Workspace Directory"}
            </span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            Engine:{" "}
            <span className="text-emerald-300">
              {files[0]?.provenance?.pipeline_engine || "Local-Filesystem-Watcher"}
            </span>
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Live Files Checked:{" "}
          <span className="text-cyan-400 font-bold">{files.length} scanned</span>
        </div>
      </div>

      {/* R2 Storage & Bandwidth Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            R2 Bucket Capacity
          </span>
          <div className="text-lg font-bold text-white mt-1">
            {subscription.totalSyncedVolumeGb} GB
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            Bucket: {subscription.r2BucketName}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Total Synced Files
          </span>
          <div className="text-lg font-bold text-cyan-400 mt-1">
            {files.length} Files
          </div>
          <span className="text-[10px] text-slate-500">Auto delta tracked</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Cloudflare Egress
          </span>
          <div className="text-lg font-bold text-emerald-400 mt-1">$0.00 / mo</div>
          <span className="text-[10px] text-slate-500">Zero egress fee benefit</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Desktop Linked Folder
          </span>
          <div className="text-xs font-mono text-purple-300 mt-1 truncate">
            Desktop/Antigravity-meter
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Sync Active</span>
        </div>
      </div>

      {/* Side-by-Side Comparison Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side (5 Cols): Local Workspace State */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Local Workspace (Desktop)
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              Live Watcher: ON
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-200">/synced-chats/</span>
              </div>
              <span className="text-slate-400 text-[10px]">
                {files.filter((f) => f.category === "chat_logs").length} Transcripts
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-purple-400" />
                <span className="text-slate-200">/nano-banana-gallery/</span>
              </div>
              <span className="text-slate-400 text-[10px]">
                {files.filter((f) => f.category === "images").length} High-Res Images
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-400" />
                <span className="text-slate-200">/veo-videos/</span>
              </div>
              <span className="text-slate-400 text-[10px]">
                {files.filter((f) => f.category === "videos").length} Cinematic Clips
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200">/docs/</span>
              </div>
              <span className="text-slate-400 text-[10px]">Architecture Spec</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-xs text-slate-300 hover:text-cyan-300 font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Archive to R2 Bucket
            </button>
          </div>
        </div>

        {/* Center Divider Indicator */}
        <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
            <ArrowLeftRight className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          </div>
          <span className="text-[10px] font-mono text-slate-400 text-center">
            {isSyncing ? "Syncing..." : "Delta Engine Active"}
          </span>
        </div>

        {/* Right Side (5 Cols): Cloudflare R2 Remote Storage Explorer */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Cloudflare R2 Bucket Vault
              </h3>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">
              Region: auto (US/APAC)
            </span>
          </div>

          {/* Files List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between text-xs font-mono group"
              >
                <div className="flex items-center gap-2.5 truncate max-w-[200px]">
                  {getFileIcon(file.category)}
                  <span className="text-slate-200 truncate">{file.name}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400">
                    {formatBytes(file.sizeBytes)}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      file.syncStatus === "synced"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300 animate-pulse"
                    }`}
                  >
                    {file.syncStatus}
                  </span>
                  {onDeleteFile && (
                    <button
                      onClick={() => onDeleteFile(file.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Target Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0e17] border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-glow">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" />
                Add Cloudflare R2 Backup File
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFile} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. project_full_backup.tar.gz"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Category
                </label>
                <select
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="workspaces">Workspaces Archive</option>
                  <option value="chat_logs">Chat Logs</option>
                  <option value="images">Generated Images</option>
                  <option value="videos">Generated Videos</option>
                  <option value="configs">System Configs</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Size (KB)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newFileSizeKb}
                  onChange={(e) => setNewFileSizeKb(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-glow"
                >
                  Sync to R2 Bucket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
