"use client";

import React, { useState, useEffect } from "react";
import {
  Clapperboard,
  Clock,
  Download,
  Film,
  Layers,
  Maximize2,
  Play,
  Plus,
  RefreshCw,
  Sparkles,
  Tv,
  Video,
} from "lucide-react";
import { VeoVideoJob } from "@/types";

interface VeoVideoStudioTabProps {
  videos: VeoVideoJob[];
  onRenderVideo: (prompt: string, engine: string, fps: number) => void;
  onUpdateVideoProgress?: (id: string, progress: number, status: "completed" | "rendering") => void;
}

export const VeoVideoStudioTab: React.FC<VeoVideoStudioTabProps> = ({
  videos,
  onRenderVideo,
  onUpdateVideoProgress,
}) => {
  const [promptInput, setPromptInput] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState<string>("Google Veo 2");
  const [selectedFps, setSelectedFps] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activePlayingVideo, setActivePlayingVideo] =
    useState<VeoVideoJob | null>(videos[0] || null);

  // Progressive rendering simulation effect for any rendering video
  useEffect(() => {
    const renderingVideos = videos.filter((v) => v.status === "rendering");
    if (renderingVideos.length === 0) return;

    const interval = setInterval(() => {
      renderingVideos.forEach((v) => {
        const nextProgress = Math.min(100, v.progressPercentage + 15);
        if (onUpdateVideoProgress) {
          onUpdateVideoProgress(
            v.id,
            nextProgress,
            nextProgress >= 100 ? "completed" : "rendering"
          );
        }
        if (nextProgress >= 100 && activePlayingVideo?.id === v.id) {
          setActivePlayingVideo({
            ...v,
            progressPercentage: 100,
            status: "completed",
            videoUrl:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          });
        }
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [videos, activePlayingVideo, onUpdateVideoProgress]);

  const handleSubmit = () => {
    if (!promptInput.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onRenderVideo(promptInput, selectedEngine, selectedFps);
      setPromptInput("");
      setIsSubmitting(false);
    }, 1000);
  };

  const presetVideoPrompts = [
    "FPV drone shot diving through illuminated rain clouds over high-tech skyscraper skyline at dusk",
    "Slow-motion macro transformation of swirling iridescent liquid crystal forming a glowing orb",
    "First-person perspective walking through holographic Tokyo lantern alleyway in 60fps",
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Quota */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Google Veo 2 & Flow Labs Video Studio
            </h2>
            <p className="text-xs text-slate-400">
              High-fidelity 60fps cinematic video generation, temporal consistency, and Cloudflare R2 video storage sync.
            </p>
          </div>
        </div>

        {/* Video Units Quota */}
        <div className="flex items-center gap-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Daily Veo Video Units
            </div>
            <div className="text-lg font-extrabold text-blue-400">
              {20 - videos.length * 2}{" "}
              <span className="text-xs text-slate-400 font-normal">/ 20 available</span>
            </div>
          </div>
          <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${((20 - videos.length * 2) / 20) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Studio View: Video Player + Prompt Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Video Preview & Player */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-blue-400" />
              Interactive Video Monitor
            </h3>
            {activePlayingVideo && (
              <span className="text-xs text-blue-400 font-mono">
                {activePlayingVideo.engine} • {activePlayingVideo.fps} FPS
              </span>
            )}
          </div>

          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
            {activePlayingVideo && activePlayingVideo.videoUrl && activePlayingVideo.status === "completed" ? (
              <video
                key={activePlayingVideo.id}
                src={activePlayingVideo.videoUrl}
                controls
                autoPlay
                loop
                muted
                className="w-full h-full object-contain"
              />
            ) : activePlayingVideo && activePlayingVideo.status === "rendering" ? (
              <div className="p-6 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                <div className="text-sm font-bold text-white">
                  Rendering Cinematic Sequence ({activePlayingVideo.progressPercentage}%)
                </div>
                <div className="w-64 bg-slate-800 rounded-full h-2 mx-auto overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activePlayingVideo.progressPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Synthesizing optical flow & temporal latents • {activePlayingVideo.fps}fps Flow Labs pipeline
                </p>
              </div>
            ) : (
              <div className="text-slate-500 text-xs">Select a video from the storyboard to preview</div>
            )}
          </div>

          {activePlayingVideo && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                Video Prompt & Metadata
              </span>
              <p className="text-slate-200 font-mono leading-relaxed">
                {activePlayingVideo.prompt}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                <span>Origin: {activePlayingVideo.deviceName}</span>
                <span>Duration: {activePlayingVideo.durationSeconds}s</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Flow Labs Generation Prompt Engine */}
        <div className="glass-panel rounded-2xl p-6 border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-slate-900/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                Render New Cinematic Shot
              </h3>
            </div>

            <textarea
              rows={4}
              placeholder="Enter cinematic motion prompt (e.g. 'Cinematic 60fps hyper-lapse of futuristic Tokyo traffic in rain with glowing headlights and neon puddles')..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none"
            />

            {/* Quick Inspiration Pills */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Preset Sequences:
              </span>
              <div className="space-y-1">
                {presetVideoPrompts.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPromptInput(preset)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-blue-300 truncate transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Engine & FPS Switcher */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Render Engine
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["Google Veo 2", "Flow Labs Cinematic"].map((engine) => (
                  <button
                    key={engine}
                    onClick={() => setSelectedEngine(engine)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      selectedEngine === engine
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {engine}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Frame Rate & Quality
              </span>
              <div className="flex items-center gap-2 text-xs">
                {[60, 30, 24].map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setSelectedFps(fps)}
                    className={`flex-1 py-1.5 rounded-lg border text-center transition-all ${
                      selectedFps === fps
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !promptInput.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow disabled:opacity-50 transition-all mt-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Submitting Render Job...
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                Queue Video Render (-2 Units)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Jobs Queue & Storyboard History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Synced Video Render Storyboard ({videos.length} Jobs)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((vid) => {
            const isPlaying = activePlayingVideo?.id === vid.id;

            return (
              <div
                key={vid.id}
                onClick={() => setActivePlayingVideo(vid)}
                className={`cursor-pointer rounded-2xl overflow-hidden border transition-all p-4 space-y-3 ${
                  isPlaying
                    ? "bg-slate-900/90 border-blue-500 shadow-glow"
                    : "glass-panel border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {vid.status === "rendering" ? (
                      <div className="flex flex-col items-center gap-1">
                        <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                        <span className="text-[10px] text-blue-300 font-mono font-bold">
                          {vid.progressPercentage}%
                        </span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600/90 flex items-center justify-center text-white">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-blue-400 uppercase">
                    <span>{vid.engine}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        vid.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300 animate-pulse"
                      }`}
                    >
                      {vid.status === "rendering"
                        ? `Rendering ${vid.progressPercentage}%`
                        : vid.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {vid.prompt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
                  <span>{vid.deviceName}</span>
                  <span>{vid.durationSeconds}s • {vid.fps}fps</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
