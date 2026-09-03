import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StorageBreakdown {
  driveGb: number;
  mailGb: number;
  photosGb: number;
  vaultGb: number;
}

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  tier: "free" | "google_one_premium" | "workspace_enterprise" | "vertex_cloud";
  role: "user" | "admin";
  storage_limit_gb: number;
  storage_used_gb: number;
  storage_breakdown: StorageBreakdown;
  created_at: string;
  last_login_at: string;
}

export interface DeviceSessionRecord {
  id: string;
  user_id: string;
  name: string;
  type: "desktop" | "laptop" | "mobile" | "server";
  os: string;
  ip: string;
  last_active: string;
  tokens_consumed: number;
  is_current: boolean;
}

export interface UserQuotaRecord {
  id: string;
  user_id: string;
  model_id: string;
  model_name: string;
  category: "LLM" | "Image" | "Video";
  code: string;
  remaining_percentage: number;
  tokens_consumed_5h: number;
  token_limit_5h: number;
  total_limit: string;
  consumed: string;
  rpm_limit: number;
  current_rpm: number;
  tpm_limit: number;
  current_tpm: number;
  rolling_window_hours: number;
  next_replenish_minutes: number;
  status: "critical" | "warning" | "optimal";
  hourly_history: { hour: string; tokens: number; requests: number }[];
}

export interface ChatRecord {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  title: string;
  category: "coding" | "image-gen" | "video-gen" | "science" | "general";
  model_used: string;
  total_turns: number;
  total_tokens: number;
  messages: {
    role: "user" | "assistant" | "system";
    timestamp: string;
    content: string;
    thought?: string;
    toolCalls?: { tool: string; summary: string }[];
  }[];
  created_at: string;
  updated_at: string;
}

export interface ImageRecord {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  prompt: string;
  aspect_ratio: "1:1" | "16:9" | "9:16" | "4:3";
  model: string;
  image_url: string;
  credits_used: number;
  created_at: string;
}

export interface VideoRecord {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  prompt: string;
  engine: string;
  status: "completed" | "rendering" | "queued";
  progress: number;
  video_url: string;
  duration_seconds: number;
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  admin_id: string;
  admin_email: string;
  action: string;
  target_user_id: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  version: number;
  users: UserRecord[];
  devices: DeviceSessionRecord[];
  quotas: UserQuotaRecord[];
  chats: ChatRecord[];
  images: ImageRecord[];
  videos: VideoRecord[];
  audit_logs: AuditLogRecord[];
}

const DB_PATH = path.join(process.cwd(), "data", "omni_meter_db.json");

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(`omni_salt_2026_${password}`).digest("hex");
}

function getInitialDatabase(): DatabaseSchema {
  const adminId = "user_admin_master";
  const now = new Date().toISOString();

  const adminUser: UserRecord = {
    id: adminId,
    email: "admin@antigravity.internal",
    password_hash: hashPassword("AdminPassword2026!"),
    name: "System Super Admin",
    tier: "workspace_enterprise",
    role: "admin",
    storage_limit_gb: 5120,
    storage_used_gb: 42.8,
    storage_breakdown: { driveGb: 28.4, mailGb: 8.2, photosGb: 4.2, vaultGb: 2.0 },
    created_at: now,
    last_login_at: now,
  };

  const defaultUser: UserRecord = {
    id: "user_developer_power",
    email: "developer.admin@gmail.com",
    password_hash: hashPassword("DeveloperPassword2026!"),
    name: "Antigravity Power User",
    tier: "google_one_premium",
    role: "user",
    storage_limit_gb: 2048,
    storage_used_gb: 48.6,
    storage_breakdown: { driveGb: 32.1, mailGb: 9.5, photosGb: 5.0, vaultGb: 2.0 },
    created_at: now,
    last_login_at: now,
  };

  const freeUser: UserRecord = {
    id: "user_free_tester",
    email: "free.user@gmail.com",
    password_hash: hashPassword("FreePassword2026!"),
    name: "Google Free Tier User",
    tier: "free",
    role: "user",
    storage_limit_gb: 15,
    storage_used_gb: 11.4,
    storage_breakdown: { driveGb: 7.2, mailGb: 2.8, photosGb: 1.0, vaultGb: 0.4 },
    created_at: now,
    last_login_at: now,
  };

  return {
    version: 1,
    users: [adminUser, defaultUser, freeUser],
    devices: [
      {
        id: "dev_win_workstation",
        user_id: defaultUser.id,
        name: "Windows Studio Workstation",
        type: "desktop",
        os: "Windows 11 Pro",
        ip: "127.0.0.1 (Localhost)",
        last_active: "Active Now",
        tokens_consumed: 68420,
        is_current: true,
      },
      {
        id: "dev_s21_phone",
        user_id: defaultUser.id,
        name: "Samsung Galaxy S21+ 5G",
        type: "mobile",
        os: "Android 14 (OneUI 6.1)",
        ip: "192.168.1.144",
        last_active: "12m ago",
        tokens_consumed: 24149,
        is_current: false,
      },
      {
        id: "dev_free_laptop",
        user_id: freeUser.id,
        name: "Acer Chromebook / ChromeOS",
        type: "laptop",
        os: "ChromeOS 124",
        ip: "192.168.1.199",
        last_active: "1 hour ago",
        tokens_consumed: 8400,
        is_current: true,
      },
    ],
    quotas: [
      // Quotas for Developer User (Google One Premium)
      {
        id: "quota_dev_g3fm",
        user_id: defaultUser.id,
        model_id: "g3fm",
        model_name: "Gemini 3 Flash (Thinking) - AGQ",
        category: "LLM",
        code: "G3FM-2026-PREVIEW",
        remaining_percentage: 15,
        tokens_consumed_5h: 850000,
        token_limit_5h: 1000000,
        total_limit: "1,000,000 tokens",
        consumed: "850k tokens",
        rpm_limit: 60,
        current_rpm: 24,
        tpm_limit: 1000000,
        current_tpm: 850000,
        rolling_window_hours: 5,
        next_replenish_minutes: 28,
        status: "critical",
        hourly_history: [
          { hour: "14:00", tokens: 180000, requests: 25 },
          { hour: "15:00", tokens: 240000, requests: 38 },
          { hour: "16:00", tokens: 210000, requests: 32 },
          { hour: "17:00", tokens: 120000, requests: 18 },
          { hour: "18:00", tokens: 100000, requests: 14 },
        ],
      },
      {
        id: "quota_dev_pro",
        user_id: defaultUser.id,
        model_id: "gemini-pro",
        model_name: "Gemini 3.0 Pro Enterprise",
        category: "LLM",
        code: "GEMINI-3.0-PRO-EXP",
        remaining_percentage: 82,
        tokens_consumed_5h: 360000,
        token_limit_5h: 2000000,
        total_limit: "2,000,000 tokens",
        consumed: "360k tokens",
        rpm_limit: 120,
        current_rpm: 18,
        tpm_limit: 2000000,
        current_tpm: 360000,
        rolling_window_hours: 24,
        next_replenish_minutes: 240,
        status: "optimal",
        hourly_history: [],
      },
      // Quotas for Free User (Standard Google Free Tier)
      {
        id: "quota_free_g3fm",
        user_id: freeUser.id,
        model_id: "g3fm",
        model_name: "Gemini 3 Flash (Thinking) - Standard",
        category: "LLM",
        code: "G3FM-FREE-TIER",
        remaining_percentage: 60,
        tokens_consumed_5h: 40000,
        token_limit_5h: 100000,
        total_limit: "100,000 tokens",
        consumed: "40k tokens",
        rpm_limit: 15,
        current_rpm: 4,
        tpm_limit: 100000,
        current_tpm: 40000,
        rolling_window_hours: 5,
        next_replenish_minutes: 85,
        status: "optimal",
        hourly_history: [
          { hour: "16:00", tokens: 20000, requests: 6 },
          { hour: "17:00", tokens: 20000, requests: 5 },
        ],
      },
    ],
    chats: [
      {
        id: "chat_adb_s21_session",
        user_id: defaultUser.id,
        device_id: "dev_s21_phone",
        device_name: "Samsung Galaxy S21+ 5G",
        title: "Samsung Galaxy S21+ ADB Session & Mirror Trajectory",
        category: "coding",
        model_used: "Gemini 3 Flash Thinking",
        total_turns: 141,
        total_tokens: 24149,
        messages: [
          {
            role: "user",
            timestamp: "17:05",
            content: "Setup ADB connection with Galaxy S21+ and mirror screen.",
          },
          {
            role: "assistant",
            timestamp: "17:06",
            content: "ADB device detected (ID: R5CR90...); started scrcpy mirror pipeline with 60fps streaming.",
            thought: "Checking USB debugging authorization and TCP connection.",
          },
        ],
        created_at: now,
        updated_at: now,
      },
      {
        id: "chat_free_user_intro",
        user_id: freeUser.id,
        device_id: "dev_free_laptop",
        device_name: "Acer Chromebook",
        title: "Introduction to Google Gemini 3 Flash Features",
        category: "general",
        model_used: "Gemini 3 Flash (Thinking)",
        total_turns: 4,
        total_tokens: 2400,
        messages: [
          {
            role: "user",
            timestamp: "16:30",
            content: "What are the features included in the Google Free tier?",
          },
          {
            role: "assistant",
            timestamp: "16:31",
            content: "The Google Free tier includes 15 GB of pooled Google Cloud Storage, standard Gemini rate limits, and 15 daily Nano-Banana image credits.",
          },
        ],
        created_at: now,
        updated_at: now,
      },
    ],
    images: [
      {
        id: "img_cyberpunk_city",
        user_id: defaultUser.id,
        device_id: "dev_win_workstation",
        device_name: "Windows Studio Workstation",
        prompt: "Neon-lit cyberpunk server matrix with floating holographic data cubes in 8k octane render",
        aspect_ratio: "16:9",
        model: "Nano-Banana-v2",
        image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        credits_used: 1,
        created_at: now,
      },
    ],
    videos: [
      {
        id: "vid_quantum_space",
        user_id: defaultUser.id,
        device_id: "dev_win_workstation",
        device_name: "Windows Studio Workstation",
        prompt: "Hyper-speed dive into a crystalline nebula with glowing plasma streams, cinematic 60fps",
        engine: "Google Veo 2",
        status: "completed",
        progress: 100,
        video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration_seconds: 5,
        created_at: now,
      },
    ],
    audit_logs: [
      {
        id: "audit_init",
        admin_id: adminId,
        admin_email: "admin@antigravity.internal",
        action: "PLATFORM_INITIALIZATION",
        target_user_id: "SYSTEM",
        details: "Initialized Multi-Tenant Antigravity Omni-Meter PaaS Database Engine v1.0",
        timestamp: now,
      },
    ],
  };
}

export class Database {
  private static instance: Database;
  private memoryDb: DatabaseSchema;
  private isLoaded: boolean = false;

  private constructor() {
    this.memoryDb = getInitialDatabase();
    this.loadFromDisk();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private loadFromDisk() {
    try {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version) {
          this.memoryDb = parsed;
          this.isLoaded = true;
          return;
        }
      }

      // Initialize default
      this.saveToDisk();
      this.isLoaded = true;
    } catch (err) {
      console.error("[Database] Error loading database from disk:", err);
      this.isLoaded = true;
    }
  }

  private saveToDisk() {
    try {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const tmpFile = `${DB_PATH}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.memoryDb, null, 2), "utf-8");
      fs.renameSync(tmpFile, DB_PATH);
    } catch (err) {
      console.error("[Database] Error writing database to disk:", err);
    }
  }

  // --- Users Operations ---
  public getUsers(): UserRecord[] {
    return this.memoryDb.users;
  }

  public getUserById(id: string): UserRecord | undefined {
    return this.memoryDb.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): UserRecord | undefined {
    return this.memoryDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(params: {
    email: string;
    password: string;
    name: string;
    tier: "free" | "google_one_premium" | "workspace_enterprise" | "vertex_cloud";
    role?: "user" | "admin";
  }): UserRecord {
    const existing = this.getUserByEmail(params.email);
    if (existing) {
      throw new Error(`User with email ${params.email} already exists.`);
    }

    const id = `user_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const now = new Date().toISOString();

    const storageLimits: Record<string, number> = {
      free: 15,
      google_one_premium: 2048,
      workspace_enterprise: 5120,
      vertex_cloud: 10240,
    };

    const storageLimit = storageLimits[params.tier] || 15;
    const initialUsed = params.tier === "free" ? 4.2 : 12.8;

    const newUser: UserRecord = {
      id,
      email: params.email,
      password_hash: hashPassword(params.password),
      name: params.name || params.email.split("@")[0],
      tier: params.tier,
      role: params.role || "user",
      storage_limit_gb: storageLimit,
      storage_used_gb: initialUsed,
      storage_breakdown: {
        driveGb: initialUsed * 0.6,
        mailGb: initialUsed * 0.25,
        photosGb: initialUsed * 0.1,
        vaultGb: initialUsed * 0.05,
      },
      created_at: now,
      last_login_at: now,
    };

    this.memoryDb.users.push(newUser);

    // Initialize Quotas for this user based on their tier
    this.seedUserQuotas(newUser);

    // Create primary device session
    this.createDeviceSession({
      user_id: newUser.id,
      name: "Primary Web Console",
      type: "desktop",
      os: "Windows / Browser",
      ip: "127.0.0.1",
    });

    this.saveToDisk();
    return newUser;
  }

  public updateUserTier(userId: string, tier: UserRecord["tier"], adminId: string): UserRecord {
    const user = this.getUserById(userId);
    if (!user) throw new Error("User not found");

    const oldTier = user.tier;
    user.tier = tier;

    if (tier === "free") user.storage_limit_gb = 15;
    if (tier === "google_one_premium") user.storage_limit_gb = 2048;
    if (tier === "workspace_enterprise") user.storage_limit_gb = 5120;
    if (tier === "vertex_cloud") user.storage_limit_gb = 10240;

    this.seedUserQuotas(user);

    this.logAudit({
      admin_id: adminId,
      admin_email: this.getUserById(adminId)?.email || "admin",
      action: "UPDATE_USER_TIER",
      target_user_id: userId,
      details: `Changed tier from ${oldTier} to ${tier}`,
    });

    this.saveToDisk();
    return user;
  }

  // --- Quota Operations ---
  public getUserQuotas(userId: string): UserQuotaRecord[] {
    return this.memoryDb.quotas.filter((q) => q.user_id === userId);
  }

  public seedUserQuotas(user: UserRecord) {
    // Remove existing quotas for user
    this.memoryDb.quotas = this.memoryDb.quotas.filter((q) => q.user_id !== user.id);

    const isPremium = user.tier === "google_one_premium" || user.tier === "workspace_enterprise";
    const isEnterprise = user.tier === "workspace_enterprise" || user.tier === "vertex_cloud";

    const g3fmLimit = isEnterprise ? 2500000 : isPremium ? 1000000 : 100000;
    const g3fmRemaining = isPremium ? 15 : 75; // Simulate realistic initial capacity
    const consumed = Math.round(g3fmLimit * ((100 - g3fmRemaining) / 100));

    const g3fmQuota: UserQuotaRecord = {
      id: `quota_${user.id}_g3fm`,
      user_id: user.id,
      model_id: "g3fm",
      model_name: `Gemini 3 Flash (Thinking) - ${user.tier === "free" ? "Standard" : "AGQ"}`,
      category: "LLM",
      code: user.tier === "free" ? "G3FM-FREE-TIER" : "G3FM-2026-PREVIEW",
      remaining_percentage: g3fmRemaining,
      tokens_consumed_5h: consumed,
      token_limit_5h: g3fmLimit,
      total_limit: `${(g3fmLimit / 1000).toLocaleString()}k tokens`,
      consumed: `${(consumed / 1000).toFixed(0)}k tokens`,
      rpm_limit: isEnterprise ? 120 : isPremium ? 60 : 15,
      current_rpm: isPremium ? 24 : 4,
      tpm_limit: g3fmLimit,
      current_tpm: consumed,
      rolling_window_hours: 5,
      next_replenish_minutes: isPremium ? 28 : 95,
      status: g3fmRemaining <= 20 ? "critical" : "optimal",
      hourly_history: [
        { hour: "14:00", tokens: Math.round(consumed * 0.2), requests: 12 },
        { hour: "15:00", tokens: Math.round(consumed * 0.3), requests: 18 },
        { hour: "16:00", tokens: Math.round(consumed * 0.25), requests: 15 },
        { hour: "17:00", tokens: Math.round(consumed * 0.15), requests: 9 },
        { hour: "18:00", tokens: Math.round(consumed * 0.1), requests: 6 },
      ],
    };

    const proQuota: UserQuotaRecord = {
      id: `quota_${user.id}_pro`,
      user_id: user.id,
      model_id: "gemini-pro",
      model_name: "Gemini 3.0 Pro",
      category: "LLM",
      code: "GEMINI-3.0-PRO",
      remaining_percentage: isPremium ? 82 : 45,
      tokens_consumed_5h: 120000,
      token_limit_5h: isEnterprise ? 5000000 : 2000000,
      total_limit: "2,000,000 tokens",
      consumed: "120k tokens",
      rpm_limit: 120,
      current_rpm: 12,
      tpm_limit: 2000000,
      current_tpm: 120000,
      rolling_window_hours: 24,
      next_replenish_minutes: 180,
      status: "optimal",
      hourly_history: [],
    };

    const claudeQuota: UserQuotaRecord = {
      id: `quota_${user.id}_claude`,
      user_id: user.id,
      model_id: "claude-sonnet",
      model_name: "Claude 3.7 Sonnet (Thinking)",
      category: "LLM",
      code: "CLAUDE-3-7-SONNET",
      remaining_percentage: isPremium ? 64 : 20,
      tokens_consumed_5h: 180000,
      token_limit_5h: 500000,
      total_limit: "500,000 tokens",
      consumed: "180k tokens",
      rpm_limit: 50,
      current_rpm: 8,
      tpm_limit: 500000,
      current_tpm: 180000,
      rolling_window_hours: 5,
      next_replenish_minutes: 110,
      status: isPremium ? "optimal" : "warning",
      hourly_history: [],
    };

    const bananaQuota: UserQuotaRecord = {
      id: `quota_${user.id}_banana`,
      user_id: user.id,
      model_id: "nano-banana",
      model_name: "Nano-Banana Image Diffusion",
      category: "Image",
      code: "NANO-BANANA-v2",
      remaining_percentage: isPremium ? 85 : 50,
      tokens_consumed_5h: isPremium ? 15 : 7,
      token_limit_5h: isPremium ? 100 : 15,
      total_limit: `${isPremium ? 100 : 15} credits`,
      consumed: `${isPremium ? 15 : 7} credits`,
      rpm_limit: 10,
      current_rpm: 1,
      tpm_limit: 100,
      current_tpm: 15,
      rolling_window_hours: 24,
      next_replenish_minutes: 360,
      status: "optimal",
      hourly_history: [],
    };

    const veoQuota: UserQuotaRecord = {
      id: `quota_${user.id}_veo`,
      user_id: user.id,
      model_id: "veo-video",
      model_name: "Google Veo 2 / Flow Labs",
      category: "Video",
      code: "VEO-2-CINEMA",
      remaining_percentage: isPremium ? 70 : 33,
      tokens_consumed_5h: isPremium ? 6 : 2,
      token_limit_5h: isPremium ? 20 : 3,
      total_limit: `${isPremium ? 20 : 3} renders`,
      consumed: `${isPremium ? 6 : 2} renders`,
      rpm_limit: 2,
      current_rpm: 0,
      tpm_limit: 20,
      current_tpm: 6,
      rolling_window_hours: 24,
      next_replenish_minutes: 500,
      status: "optimal",
      hourly_history: [],
    };

    this.memoryDb.quotas.push(g3fmQuota, proQuota, claudeQuota, bananaQuota, veoQuota);
  }

  public burnTokens(userId: string, modelId: string, tokens: number) {
    const quota = this.memoryDb.quotas.find(
      (q) => q.user_id === userId && q.model_id === modelId
    );
    if (quota) {
      quota.tokens_consumed_5h = Math.min(quota.token_limit_5h, quota.tokens_consumed_5h + tokens);
      quota.remaining_percentage = Math.max(
        0,
        Math.round(((quota.token_limit_5h - quota.tokens_consumed_5h) / quota.token_limit_5h) * 100)
      );
      quota.consumed = `${(quota.tokens_consumed_5h / 1000).toFixed(0)}k tokens`;
      quota.status = quota.remaining_percentage <= 20 ? "critical" : quota.remaining_percentage <= 50 ? "warning" : "optimal";
      this.saveToDisk();
    }
  }

  public replenishQuota(userId: string, modelId: string, pctBoost: number = 25) {
    const quota = this.memoryDb.quotas.find(
      (q) => q.user_id === userId && q.model_id === modelId
    );
    if (quota) {
      quota.remaining_percentage = Math.min(100, quota.remaining_percentage + pctBoost);
      quota.tokens_consumed_5h = Math.round(
        quota.token_limit_5h * ((100 - quota.remaining_percentage) / 100)
      );
      quota.consumed = `${(quota.tokens_consumed_5h / 1000).toFixed(0)}k tokens`;
      quota.status = quota.remaining_percentage <= 20 ? "critical" : "optimal";
      this.saveToDisk();
    }
  }

  // --- Device Sessions Operations ---
  public getUserDevices(userId: string): DeviceSessionRecord[] {
    return this.memoryDb.devices.filter((d) => d.user_id === userId);
  }

  public createDeviceSession(params: {
    user_id: string;
    name: string;
    type: DeviceSessionRecord["type"];
    os: string;
    ip: string;
  }): DeviceSessionRecord {
    const id = `dev_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const newDevice: DeviceSessionRecord = {
      id,
      user_id: params.user_id,
      name: params.name,
      type: params.type,
      os: params.os,
      ip: params.ip,
      last_active: "Active Now",
      tokens_consumed: 0,
      is_current: true,
    };

    // Mark previous devices for this user as not current
    this.memoryDb.devices
      .filter((d) => d.user_id === params.user_id)
      .forEach((d) => {
        d.is_current = false;
      });

    this.memoryDb.devices.push(newDevice);
    this.saveToDisk();
    return newDevice;
  }

  public revokeDeviceSession(userId: string, deviceId: string): boolean {
    const initialLen = this.memoryDb.devices.length;
    this.memoryDb.devices = this.memoryDb.devices.filter(
      (d) => !(d.user_id === userId && d.id === deviceId)
    );
    const removed = this.memoryDb.devices.length < initialLen;
    if (removed) this.saveToDisk();
    return removed;
  }

  // --- Chats Operations ---
  public getUserChats(userId: string): ChatRecord[] {
    return this.memoryDb.chats.filter((c) => c.user_id === userId);
  }

  public addChatMessage(userId: string, chatId: string, message: { role: "user" | "assistant"; content: string; thought?: string }) {
    let chat = this.memoryDb.chats.find((c) => c.user_id === userId && c.id === chatId);
    const now = new Date().toISOString();

    if (!chat) {
      chat = {
        id: chatId,
        user_id: userId,
        device_id: this.getUserDevices(userId)[0]?.id || "dev_default",
        device_name: this.getUserDevices(userId)[0]?.name || "Web Console",
        title: message.content.slice(0, 50) + "...",
        category: "coding",
        model_used: "Gemini 3 Flash Thinking",
        total_turns: 0,
        total_tokens: 0,
        messages: [],
        created_at: now,
        updated_at: now,
      };
      this.memoryDb.chats.push(chat);
    }

    chat.messages.push({
      role: message.role,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: message.content,
      thought: message.thought,
    });
    chat.total_turns += 1;
    const tokensEstimate = Math.round(message.content.length / 3.8);
    chat.total_tokens += tokensEstimate;
    chat.updated_at = now;

    // Burn tokens for this user
    this.burnTokens(userId, "g3fm", tokensEstimate + 120);

    this.saveToDisk();
    return chat;
  }

  // --- Images Operations ---
  public getUserImages(userId: string): ImageRecord[] {
    return this.memoryDb.images.filter((img) => img.user_id === userId);
  }

  public addImage(userId: string, params: { prompt: string; aspect_ratio: ImageRecord["aspect_ratio"]; model?: string }) {
    const id = `img_${Date.now()}`;
    const device = this.getUserDevices(userId)[0];

    // Curated high-res imagery matching prompt keywords
    const isSciFi = params.prompt.toLowerCase().includes("space") || params.prompt.toLowerCase().includes("cyber");
    const isNature = params.prompt.toLowerCase().includes("nature") || params.prompt.toLowerCase().includes("mountain");
    const url = isSciFi
      ? "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80"
      : isNature
      ? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
      : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

    const newImg: ImageRecord = {
      id,
      user_id: userId,
      device_id: device?.id || "dev_default",
      device_name: device?.name || "Web Console",
      prompt: params.prompt,
      aspect_ratio: params.aspect_ratio,
      model: params.model || "Nano-Banana-v2",
      image_url: url,
      credits_used: 1,
      created_at: new Date().toISOString(),
    };

    this.memoryDb.images.unshift(newImg);

    // Decrement banana quota
    const banana = this.memoryDb.quotas.find((q) => q.user_id === userId && q.model_id === "nano-banana");
    if (banana && banana.tokens_consumed_5h < banana.token_limit_5h) {
      banana.tokens_consumed_5h += 1;
      banana.remaining_percentage = Math.max(0, Math.round(((banana.token_limit_5h - banana.tokens_consumed_5h) / banana.token_limit_5h) * 100));
      banana.consumed = `${banana.tokens_consumed_5h} credits`;
    }

    this.saveToDisk();
    return newImg;
  }

  // --- Videos Operations ---
  public getUserVideos(userId: string): VideoRecord[] {
    return this.memoryDb.videos.filter((v) => v.user_id === userId);
  }

  public addVideo(userId: string, params: { prompt: string; engine?: string }) {
    const id = `vid_${Date.now()}`;
    const device = this.getUserDevices(userId)[0];

    const newVid: VideoRecord = {
      id,
      user_id: userId,
      device_id: device?.id || "dev_default",
      device_name: device?.name || "Web Console",
      prompt: params.prompt,
      engine: params.engine || "Google Veo 2",
      status: "completed",
      progress: 100,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      duration_seconds: 5,
      created_at: new Date().toISOString(),
    };

    this.memoryDb.videos.unshift(newVid);

    // Decrement Veo quota
    const veo = this.memoryDb.quotas.find((q) => q.user_id === userId && q.model_id === "veo-video");
    if (veo && veo.tokens_consumed_5h < veo.token_limit_5h) {
      veo.tokens_consumed_5h += 1;
      veo.remaining_percentage = Math.max(0, Math.round(((veo.token_limit_5h - veo.tokens_consumed_5h) / veo.token_limit_5h) * 100));
      veo.consumed = `${veo.tokens_consumed_5h} renders`;
    }

    this.saveToDisk();
    return newVid;
  }

  // --- Admin Platform Metrics ---
  public getPlatformMetrics() {
    const totalUsers = this.memoryDb.users.length;
    const totalDevices = this.memoryDb.devices.length;
    const totalChats = this.memoryDb.chats.length;
    const totalImages = this.memoryDb.images.length;
    const totalVideos = this.memoryDb.videos.length;

    let totalTokensConsumed = 0;
    let totalStorageUsedGb = 0;

    this.memoryDb.users.forEach((u) => {
      totalStorageUsedGb += u.storage_used_gb;
    });

    this.memoryDb.quotas.forEach((q) => {
      if (q.category === "LLM") {
        totalTokensConsumed += q.tokens_consumed_5h;
      }
    });

    return {
      totalUsers,
      totalDevices,
      totalChats,
      totalImages,
      totalVideos,
      totalTokensConsumed,
      totalStorageUsedGb: Number(totalStorageUsedGb.toFixed(2)),
      activeUsers24h: totalUsers,
      systemStatus: "OPTIMAL",
    };
  }

  // --- Audit Logs ---
  public logAudit(entry: Omit<AuditLogRecord, "id" | "timestamp">) {
    const id = `audit_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    const log: AuditLogRecord = {
      ...entry,
      id,
      timestamp: new Date().toISOString(),
    };
    this.memoryDb.audit_logs.unshift(log);
    if (this.memoryDb.audit_logs.length > 200) {
      this.memoryDb.audit_logs.pop();
    }
    this.saveToDisk();
  }

  public getAuditLogs(): AuditLogRecord[] {
    return this.memoryDb.audit_logs;
  }
}

export const db = Database.getInstance();
