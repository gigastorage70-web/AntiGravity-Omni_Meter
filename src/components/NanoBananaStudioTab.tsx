"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Eye,
  Filter,
  Image as ImageIcon,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Tag,
  Trash2,
  Wand2,
  Zap,
} from "lucide-react";
import { NanoBananaImage } from "@/types";

interface NanoBananaStudioTabProps {
  images: NanoBananaImage[];
  onGenerateImage: (prompt: string, model: string, ratio: string) => void;
  onDeleteImage?: (id: string) => void;
}

export const NanoBananaStudioTab: React.FC<NanoBananaStudioTabProps> = ({
  images,
  onGenerateImage,
  onDeleteImage,
}) => {
  const [promptInput, setPromptInput] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("Nano-Banana-v2");
  const [selectedRatio, setSelectedRatio] = useState<string>("16:9");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedImageModal, setSelectedImageModal] =
    useState<NanoBananaImage | null>(null);
  const [filterTag, setFilterTag] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const presetPrompts = [
    "Futuristic glowing neural matrix floating in deep obsidian void, volumetric lighting, 8k render",
    "Cyberpunk neon street market in Neo-Tokyo with flying delivery drones and rain reflections",
    "Minimalist Scandinavian architectural studio with warm sunlight streaming through floor-to-ceiling glass",
    "Bioluminescent alien fauna deep under icy Europa ocean, National Geographic photography",
  ];

  const handleGenerate = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      onGenerateImage(promptInput, selectedModel, selectedRatio);
      setPromptInput("");
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const allTags = Array.from(new Set(images.flatMap((img) => img.tags)));

  const filteredImages =
    filterTag === "all"
      ? images
      : images.filter((img) => img.tags.includes(filterTag));

  return (
    <div className="space-y-6">
      {/* Studio Header & Credit Meter */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Nano-Banana AI Image Studio & Synced Gallery
              </h2>
              <p className="text-xs text-slate-400">
                Ultra-fast diffusion generation, cross-device prompt sync, and automatic Cloudflare R2 gallery backup.
              </p>
            </div>
          </div>
        </div>

        {/* Credit & Quota Pill */}
        <div className="flex items-center gap-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Daily Nano-Banana Credits
            </div>
            <div className="text-lg font-extrabold text-purple-400">
              {100 - images.length}{" "}
              <span className="text-xs text-slate-400 font-normal">/ 100 available</span>
            </div>
          </div>
          <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all"
              style={{ width: `${100 - images.length}%` }}
            />
          </div>
        </div>
      </div>

      {/* Prompt Creator Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-slate-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-purple-400" />
            Prompt Engine & Generation Workspace
          </span>
          <span className="text-xs text-slate-400 font-mono">1 Credit per Render</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Describe your visual concept (e.g. 'Cyberpunk neon telemetry interface in glassmorphism dark aesthetic, 8K render')..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50"
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !promptInput.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple disabled:opacity-50 transition-all flex-shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Diffusing Latents...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Now
              </>
            )}
          </button>
        </div>

        {/* Style Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-400">
          <span className="text-slate-500 flex-shrink-0">Inspiration:</span>
          {presetPrompts.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setPromptInput(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 hover:text-purple-300 truncate max-w-xs transition-colors flex-shrink-0"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Model and Aspect Ratio Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Model:</span>
            {["Nano-Banana-v2", "Imagen 3 Ultra", "Nano-Banana Fast"].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  selectedModel === m
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Aspect Ratio:</span>
            {["16:9", "1:1", "9:16", "4:3"].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRatio(r)}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  selectedRatio === r
                    ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Filter & Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter Tag:
            </span>
            <button
              onClick={() => setFilterTag("all")}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                filterTag === "all"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              All Assets ({images.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  filterTag === tag
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Synced across {images.length} assets
          </span>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 aspect-square cursor-pointer glass-panel-hover"
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                onClick={() => setSelectedImageModal(img)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Quick Actions Hover Pill */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyPrompt(img.prompt, img.id);
                  }}
                  title="Copy Prompt"
                  className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-slate-300 hover:text-white backdrop-blur-md transition-colors"
                >
                  {copiedId === img.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                {onDeleteImage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(img.id);
                    }}
                    title="Delete Asset"
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div
                onClick={() => setSelectedImageModal(img)}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-xs font-bold text-white line-clamp-1">
                  {img.title}
                </span>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                  {img.prompt}
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-purple-300 font-mono">
                  <span>{img.model}</span>
                  <span>{img.resolution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Detail Inspector Modal */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101b] border border-purple-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {selectedImageModal.title}
              </h3>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800"
              >
                Close (ESC)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
                <img
                  src={selectedImageModal.imageUrl}
                  alt={selectedImageModal.title}
                  className="w-full h-auto max-h-[450px] object-contain"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">
                      Prompt
                    </span>
                    <button
                      onClick={() =>
                        handleCopyPrompt(
                          selectedImageModal.prompt,
                          selectedImageModal.id
                        )
                      }
                      className="text-purple-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                  <p className="mt-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed font-mono">
                    {selectedImageModal.prompt}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500">Model:</span>
                    <div className="text-slate-200 font-bold">{selectedImageModal.model}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500">Aspect Ratio:</span>
                    <div className="text-slate-200 font-bold">{selectedImageModal.aspectRatio}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500">Seed:</span>
                    <div className="text-purple-400 font-bold">{selectedImageModal.seed}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500">Origin Device:</span>
                    <div className="text-slate-200 font-bold">{selectedImageModal.deviceName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={selectedImageModal.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download="nano-banana-render.jpg"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download High-Res (4K)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
