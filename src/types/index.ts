export type ProvenanceTag = {
  source: "live" | "cached" | "mock";
  fetched_at: string;
  stale_after: string;
  pipeline_engine: string;
  raw_source_ref?: string;
  data_hash?: string;
};

export type LiveApiResponse<T> = {
  success: boolean;
  data: T;
  provenance: ProvenanceTag;
  error?: {
    code: string;
    message: string;
    recoverable: boolean;
  };
};

export type ModelQuota = {
  id: string;
  name: string;
  category: "LLM" | "Image" | "Video" | "Audio";
  code: string;
  remainingPercentage: number; // e.g. 15 for G3FM
  totalLimit: string;
  consumed: string;
  unit: string;
  rpmLimit: number;
  currentRpm: number;
  tpmLimit: number;
  currentTpm: number;
  rollingWindowHours: number;
  nextReplenishMinutes: number;
  resetMode: "rolling" | "daily_utc" | "monthly";
  status: "critical" | "warning" | "optimal";
  hourlyHistory: { hour: string; tokens: number; requests: number }[];
  provenance?: ProvenanceTag;
};

export type DeviceSession = {
  id: string;
  name: string;
  type: "desktop" | "laptop" | "mobile" | "server";
  os: string;
  clientVersion: string;
  location: string;
  ipAddress: string;
  isCurrent: boolean;
  status: "online" | "idle" | "offline";
  lastActive: string;
  tokensConsumedToday: number;
  imagesGeneratedToday: number;
  videosRenderedToday: number;
  activeDaemons: { name: string; pid: number; runtime: string }[];
  provenance?: ProvenanceTag;
};

export type NanoBananaImage = {
  id: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  model: "Nano-Banana-v2" | "Imagen 3 Ultra" | "Nano-Banana Fast";
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3";
  resolution: string;
  seed: number;
  createdAt: string;
  deviceId: string;
  deviceName: string;
  imageUrl: string;
  creditsUsed: number;
  tags: string[];
  provenance?: ProvenanceTag;
};

export type VeoVideoJob = {
  id: string;
  title: string;
  prompt: string;
  engine: "Google Veo 2" | "Flow Labs Cinematic" | "Veo Fast 60fps";
  status: "completed" | "rendering" | "queued";
  progressPercentage: number;
  durationSeconds: number;
  fps: number;
  aspectRatio: "16:9" | "9:16" | "21:9";
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  deviceId: string;
  deviceName: string;
  creditsCost: number;
  provenance?: ProvenanceTag;
};

export type CategorizedChat = {
  id: string;
  title: string;
  category: "coding" | "image-gen" | "video-gen" | "science" | "general";
  modelUsed: string;
  deviceId: string;
  deviceName: string;
  createdAt: string;
  updatedAt: string;
  totalTurns: number;
  totalTokens: number;
  previewMessage: string;
  isSyncedToR2: boolean;
  messages: {
    role: "user" | "assistant" | "system";
    timestamp: string;
    content: string;
    thought?: string;
    toolCalls?: { tool: string; summary: string; output?: string }[];
    artifacts?: { name: string; type: string; url?: string }[];
  }[];
  provenance?: ProvenanceTag;
};

export type CloudStorageFile = {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  category: "chat_logs" | "images" | "videos" | "workspaces" | "configs";
  sizeBytes: number;
  lastModified: string;
  syncStatus: "synced" | "syncing" | "pending_delta" | "error";
  r2Etag: string;
  downloadUrl?: string;
  deviceId: string;
  provenance?: ProvenanceTag;
};

export type GoogleSubscriptionInfo = {
  accountEmail: string;
  displayName: string;
  avatarUrl: string;
  tierName: "Google One AI Premium" | "Google Workspace AI" | "Vertex Enterprise";
  renewalDate: string;
  storageUsedGb: number;
  storageLimitGb: number;
  cloudFlareR2Status: "connected" | "syncing" | "paused";
  r2BucketName: "antigravity-vault-us-east";
  totalSyncedFiles: number;
  totalSyncedVolumeGb: number;
  provenance?: ProvenanceTag;
};
