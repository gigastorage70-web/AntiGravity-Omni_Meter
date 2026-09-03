"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Cloud,
  HardDrive,
  Key,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { GoogleSubscriptionInfo } from "@/types";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: GoogleSubscriptionInfo;
  onUpdateSubscription: (updated: GoogleSubscriptionInfo) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpdateSubscription,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>(
    subscription.tierName
  );
  const [r2BucketInput, setR2BucketInput] = useState<string>(
    subscription.r2BucketName
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateSubscription({
        ...subscription,
        tierName: selectedTier,
        r2BucketName: r2BucketInput as any,
      });
      setIsSaving(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#090d16] border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-glow relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Google Account & Subscription Hub
              </h3>
              <p className="text-xs text-slate-400">
                Manage unified AI quotas and Cloudflare R2 backup credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/50 bg-slate-800 flex items-center justify-center flex-shrink-0">
            {subscription.avatarUrl ? (
              <img
                src={subscription.avatarUrl}
                alt={subscription.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-cyan-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
              {subscription.displayName}
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xs text-slate-400 font-mono truncate">
              {subscription.accountEmail}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              Google Account Connected • OAuth 2.0 Active
            </div>
          </div>
        </div>

        {/* Subscription Tier Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Google AI Subscription Tier
          </label>
          <div className="space-y-2">
            {[
              {
                id: "Google One AI Premium",
                desc: "2 TB Cloud Storage, Gemini 3 Flash / Thinking, Nano-Banana Image Studio, Veo 2 Access",
                badge: "Active",
              },
              {
                id: "Google Workspace AI",
                desc: "Enterprise shared token pool, multi-seat project quotas, domain sync",
                badge: "Enterprise",
              },
              {
                id: "Vertex Enterprise",
                desc: "Pay-as-you-go high throughput, dedicated capacity reservations, custom VPC endpoints",
                badge: "Cloud PayG",
              },
            ].map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id as any)}
                className={`cursor-pointer p-3 rounded-xl border text-xs transition-all ${
                  selectedTier === tier.id
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-200"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{tier.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {tier.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cloudflare R2 Bucket Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            Cloudflare R2 Bucket Destination
          </label>
          <input
            type="text"
            value={r2BucketInput}
            onChange={(e) => setR2BucketInput(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow flex items-center gap-1.5 transition-all"
          >
            {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            Save & Sync Credentials
          </button>
        </div>
      </div>
    </div>
  );
};
