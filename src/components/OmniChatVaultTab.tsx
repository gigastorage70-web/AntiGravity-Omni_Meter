"use client";

import React, { useState } from "react";
import {
  Archive,
  ArrowRight,
  Bot,
  ChevronDown,
  ChevronRight,
  Cloud,
  Code2,
  Copy,
  Download,
  Eye,
  FileCode,
  Film,
  Filter,
  Flame,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Microscope,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Terminal,
  User,
  Zap,
} from "lucide-react";
import { CategorizedChat } from "@/types";

interface OmniChatVaultTabProps {
  chats: CategorizedChat[];
  onSyncChatToR2: (chatId: string) => void;
  onExportAllChats: () => void;
  onSendMessage?: (chatId: string, message: string) => void;
}

export const OmniChatVaultTab: React.FC<OmniChatVaultTabProps> = ({
  chats,
  onSyncChatToR2,
  onExportAllChats,
  onSendMessage,
}) => {
  const [selectedChatId, setSelectedChatId] = useState<string>(
    chats[0]?.id || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedThoughtIndex, setExpandedThoughtIndex] = useState<number | null>(
    null
  );
  const [newMessage, setNewMessage] = useState<string>("");
  const [isReplying, setIsReplying] = useState<boolean>(false);

  const selectedChat =
    chats.find((c) => c.id === selectedChatId) || chats[0];

  const filteredChats = chats.filter((chat) => {
    const matchesCategory =
      selectedCategory === "all" || chat.category === selectedCategory;
    const matchesSearch =
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.previewMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.modelUsed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    if (onSendMessage) {
      setIsReplying(true);
      onSendMessage(selectedChat.id, newMessage);
      setNewMessage("");
      setTimeout(() => {
        setIsReplying(false);
      }, 1000);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "coding":
        return {
          label: "Coding & IDE",
          icon: <Code2 className="w-3 h-3 text-cyan-400" />,
          color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        };
      case "image-gen":
        return {
          label: "Nano-Banana Image",
          icon: <ImageIcon className="w-3 h-3 text-purple-400" />,
          color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        };
      case "video-gen":
        return {
          label: "Veo Video",
          icon: <Film className="w-3 h-3 text-blue-400" />,
          color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        };
      case "science":
        return {
          label: "Science & Bio",
          icon: <Microscope className="w-3 h-3 text-emerald-400" />,
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        };
      default:
        return {
          label: "General",
          icon: <MessageSquare className="w-3 h-3 text-slate-400" />,
          color: "bg-slate-800 text-slate-300 border-slate-700",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-cyan-400" />
            Categorized Cross-Device Omni-Chat Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full synchronization of conversations, thought chains, terminal tool calls, and artifacts across all logged-in machines.
          </p>
        </div>

        <button
          onClick={onExportAllChats}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Export All Transcripts (.JSON)
        </button>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: "all", label: "All Categories", count: chats.length },
          { id: "coding", label: "💻 Coding & IDE", count: chats.filter(c => c.category === "coding").length },
          { id: "image-gen", label: "🎨 Nano-Banana Images", count: chats.filter(c => c.category === "image-gen").length },
          { id: "video-gen", label: "🎬 Veo & Flow Videos", count: chats.filter(c => c.category === "video-gen").length },
          { id: "science", label: "🔬 Research & Science", count: chats.filter(c => c.category === "science").length },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 flex-shrink-0 transition-all ${
              selectedCategory === cat.id
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <span>{cat.label}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Split Layout: Chats List + Active Conversation Replayer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Chat Sessions List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chat topics or models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredChats.map((chat) => {
              const isSelected = selectedChat?.id === chat.id;
              const badge = getCategoryBadge(chat.category);

              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                    isSelected
                      ? "bg-slate-900/90 border-cyan-500 shadow-glow"
                      : "glass-panel border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${badge.color}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {chat.updatedAt}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                    {chat.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {chat.previewMessage}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
                    <span className="text-cyan-400 truncate max-w-[150px]">{chat.deviceName}</span>
                    <span>{(chat.totalTokens / 1000).toFixed(0)}k Tokens</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Transcript Inspector & Interactive Chat */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Active Chat Header */}
            {selectedChat && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {selectedChat.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                    <span className="text-cyan-400 font-bold">{selectedChat.modelUsed}</span>
                    <span>•</span>
                    <span>Origin: {selectedChat.deviceName}</span>
                    <span>•</span>
                    <span>{selectedChat.totalTurns} Turns</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSyncChatToR2(selectedChat.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedChat.isSyncedToR2 ? "R2 Synced" : "Sync to R2"}
                  </button>
                </div>
              </div>
            )}

            {/* Conversation Messages Thread */}
            <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2">
              {selectedChat?.messages.map((msg, idx) => {
                const isUser = msg.role === "user";

                return (
                  <div key={idx} className="space-y-2">
                    <div
                      className={`flex gap-3 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                          isUser
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium"
                            : "bg-slate-900/90 border border-slate-800 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-300/80 mb-1 font-mono">
                          <span>{isUser ? "You (User Prompt)" : "Antigravity Model"}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>

                        {/* Collapsible Agent Thought Chain */}
                        {msg.thought && (
                          <div className="mt-3 pt-2 border-t border-slate-800">
                            <button
                              onClick={() =>
                                setExpandedThoughtIndex(
                                  expandedThoughtIndex === idx ? null : idx
                                )
                              }
                              className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 hover:underline"
                            >
                              <Sparkles className="w-3 h-3" />
                              {expandedThoughtIndex === idx
                                ? "Hide Model Reasoning"
                                : "Inspect Thought Chain"}
                              {expandedThoughtIndex === idx ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </button>

                            {expandedThoughtIndex === idx && (
                              <div className="mt-2 p-3 rounded-lg bg-slate-950/80 border border-cyan-500/30 font-mono text-[11px] text-cyan-200/90 leading-normal">
                                {msg.thought}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tool Calls Inspector */}
                        {msg.toolCalls && msg.toolCalls.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Terminal className="w-3 h-3 text-cyan-400" />
                              Tool Executions
                            </span>
                            {msg.toolCalls.map((tc, tcIdx) => (
                              <div
                                key={tcIdx}
                                className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 flex items-center justify-between"
                              >
                                <span className="text-cyan-400 font-bold">
                                  {tc.tool}
                                </span>
                                <span className="text-slate-400 truncate max-w-xs">
                                  {tc.summary}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 flex-shrink-0 mt-1">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isReplying && (
                <div className="flex gap-3 justify-start items-center text-xs text-cyan-400 font-mono animate-pulse pl-10">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating model response and synchronizing turns to R2...
                </div>
              )}
            </div>
          </div>

          {/* Interactive Chat Input Box */}
          <form
            onSubmit={handleSendPrompt}
            className="pt-3 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask ${selectedChat?.modelUsed || "Antigravity Model"} to run tests, write code, or explain quota...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isReplying || !newMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-glow disabled:opacity-50 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
