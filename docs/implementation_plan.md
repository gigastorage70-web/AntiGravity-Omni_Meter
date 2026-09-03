# Antigravity Omniverse Cloud Command Center & Unified AI Studio Hub

A next-generation, high-performance web application built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**. It serves as an all-in-one central command center for monitoring Google AI subscriptions, tracking model quotas (G3FM, Gemini Pro, Claude), managing **Nano-Banana Image Generation** and **Google Veo / Flow Labs Video Generation** jobs, and synchronizing device-segregated chat histories and workspace storage with **Cloudflare R2** and **Google One / Vertex AI** accounts.

---

## Key Modules & Capabilities

```
+----------------------------------------------------------------------------------------------------+
|  ANTIGRAVITY OMNIVERSE COMMAND CENTER                                          [ Google Account ]  |
+----------------------------------------------------------------------------------------------------+
| [Overview] [LLM Quotas] [Nano-Banana Images] [Veo & Flow Videos] [Chat Vault] [Devices] [R2 Sync]  |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  +--------------------------------+  +--------------------------------+  +-----------------------+ |
|  | LLM Quota & Rolling Window     |  | Nano-Banana Image Studio       |  | Veo 2 & Flow Video    | |
|  | - G3FM (Gemini 3 Flash: 15%)   |  | - 85/100 Daily Credits         |  | - 12/20 Video Credits | |
|  | - Gemini 3.0 Pro (82%)         |  | - Ultra-fast Generation Logs   |  | - Render Pipeline     | |
|  | - Claude 3.7 Sonnet (64%)      |  | - Synced Asset Gallery         |  | - 4K/60fps Previews   | |
|  +--------------------------------+  +--------------------------------+  +-----------------------+ |
|                                                                                                    |
|  +-----------------------------------------------------------------------------------------------+ |
|  | Device-Segregated Usage History & Active Sessions (Desktop, MacBook, Galaxy S21+, Linux)      | |
|  +-----------------------------------------------------------------------------------------------+ |
|  | Categorized Cross-Device Omni-Chat Vault (Coding, Image Gen, Video Studio, Science, General)    | |
|  +-----------------------------------------------------------------------------------------------+ |
|  | Cloud Storage Hub: Side-by-Side Local Workspace <--> Cloudflare R2 / Google Cloud Storage     | |
|  +-----------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

### 1. Unified Google AI Subscription & LLM Quota Monitor
* **Model Quotas Monitored**:
  * **Gemini 3 Flash Thinking (G3FM)**: Real-time capacity gauge (reflecting current 15% state), 5-hour rolling replenishment countdown timer, and hourly consumption curves.
  * **Gemini 3.0 Pro & Gemini 2.5 Flash**: RPM/TPM monitors, prompt cache efficiency, and token usage meters.
  * **Claude 3.7 Sonnet & Custom Multi-Model Endpoints**: Multi-provider toggle with token cost calculations.
* **Subscription Tier Tracker**: Overview of active plan (Google One AI Premium / Vertex AI Enterprise), renewal countdown, and multi-tier usage allocation.

### 2. Nano-Banana Image Generation Studio & Synced Gallery
* **Image Generation Tracking**: Real-time credit meter for Nano-Banana / Imagen 3 generation and editing tasks.
* **Prompt & Asset History**: Visual gallery with aspect ratios (1:1, 16:9, 9:16), seed, prompt history, generation metadata, and resolution tags.
* **Cross-Device Image Chat Sync**: Full synchronization of all image prompt conversations across logged-in machines.

### 3. Google Veo 2 & Flow Labs Video Generation Studio
* **Video Generation Telemetry**: Active render queue, generation credits remaining, duration, and frame rate metrics.
* **Flow Labs Cinematic Workspace**: Storyboard view, text-to-video / image-to-video generation logs, and built-in interactive video player.
* **Synced Video Output Vault**: Real-time backup to Cloudflare R2 with instant streaming previews.

### 4. Device-Segregated Usage History & Session Management
* **Multi-Device Live Grid**: Windows Workstation (Active Now), MacBook Pro M3 Max, Samsung Galaxy S21+ 5G, Linux Server.
* **Per-Device Analytics**: Breakdown of tokens consumed, image renders, video jobs, IP address, geolocation, and active background daemons.
* **Remote Session Controls**: Instant session revocation (Kill Switch), task pauses, and security audit log.

### 5. Categorized Cross-Device Omni-Chat Vault
* **Categorized Storage**:
  * 💻 **Coding & Antigravity IDE**
  * 🎨 **Nano-Banana Image Studio**
  * 🎬 **Veo Video & Flow Labs**
  * 🔬 **Research & Science Workflows**
  * 💬 **General & Planning**
* **Deep Transcript Inspector**: Inspect user prompts, agent thoughts, tool calls, and visual diffs.
* **Local Data Ingestion**: Seamlessly reads local conversation archives (`brain` logs) alongside cloud-synced sessions.

### 6. Cloudflare R2 / Vercel Cloud Storage Side-by-Side Sync Hub
* **Side-by-Side Explorer**: Compare local workspace directories directly against the Cloudflare R2 bucket.
* **Real-time Delta Sync**: Real-time status indicators (Synced, Syncing, Pending Delta), auto-sync toggle, and instant backup triggers.
* **Storage Analytics**: Total storage volume, file count, bandwidth, and zero-egress cost savings.

### 7. Google Sign-In & Settings Center
* One-click Google account authentication, linked profile details, cloud sync controls, and complete data export (ZIP/JSON).

---

## Proposed Project Structure

Path: `C:\Users\Admin\.gemini\antigravity-ide\scratch\antigravity-dashboard`

### Files to Create

#### [NEW] [package.json](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/package.json)
Next.js 14/15, React 19/18, Tailwind CSS, Lucide React, Recharts, Video/Image viewers.

#### [NEW] [tailwind.config.ts](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/tailwind.config.ts) & [src/app/globals.css](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/app/globals.css)
Obsidian dark-theme styling, glassmorphism filters, glowing neon tokens (`cyan-400`, `violet-500`, `emerald-400`, `amber-400`), and smooth transitions.

#### [NEW] [src/types/index.ts](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/types/index.ts)
TypeScript interfaces for Quotas, Nano-Banana Image Jobs, Veo Video Generations, Devices, Categorized Chats, and Cloudflare R2 Objects.

#### [NEW] [src/lib/mockData.ts](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/lib/mockData.ts)
Comprehensive dataset with real-world Antigravity state (15% G3FM quota, device logs, Nano-Banana images, Veo video renders, categorized chat transcripts).

#### [NEW] [src/components/Navbar.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/Navbar.tsx)
Navigation bar with active subscription tier badge, Google Account avatar, global search, and real-time sync status.

#### [NEW] [src/components/OverviewTab.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/OverviewTab.tsx)
High-level command center with service quota widgets, live activity feed, and usage trends across Text, Vision, and Video.

#### [NEW] [src/components/QuotaTelemetryTab.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/QuotaTelemetryTab.tsx)
Detailed AGQ model tracker for G3FM, Gemini Pro, Claude 3.7 with rolling replenishment countdown, token burn rate, and consumption graphs.

#### [NEW] [src/components/NanoBananaStudioTab.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/NanoBananaStudioTab.tsx)
Nano-Banana image generation studio, credit meter, prompt history, gallery grid, and image metadata inspector.

#### [NEW] [src/components/VeoVideoStudioTab.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/VeoVideoStudioTab.tsx)
Google Veo 2 / Flow Labs video studio, render status, video player with playback speed/resolution switcher, and prompt timeline.

#### [NEW] [src/components/DeviceSessionsTab.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/DeviceSessionsTab.tsx)
Per-device segregated usage history (tokens, images, videos), active daemon monitor, IP/geolocation cards, and remote kill switch.

#### [NEW] [src/components/OmniChatVaultTab.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/OmniChatVaultTab.tsx)
Categorized chat database with deep search, model/device filtering, thought-process breakdown, tool logs, and artifact visualizer.

#### [NEW] [src/components/CloudSyncHubTab.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/CloudSyncHubTab.tsx)
Side-by-side local workspace vs Cloudflare R2 cloud storage manager with real-time delta sync, storage meters, and backup/restore controls.

#### [NEW] [src/components/GoogleAuthModal.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/components/GoogleAuthModal.tsx)
Interactive Google OAuth dialog with subscription status, storage tier, and device authorization.

#### [NEW] [src/app/page.tsx](file:///C:/Users/Admin/.gemini/antigravity-ide/scratch/antigravity-dashboard/src/app/page.tsx)
Main dashboard orchestrator integrating all tabs with live state and real-time simulations.

---

## Verification Plan

### Automated / Build Verification
1. Bootstrap project in `C:\Users\Admin\.gemini\antigravity-ide\scratch\antigravity-dashboard`.
2. Install dependencies (`lucide-react`, `recharts`, `clsx`, `tailwind-merge`).
3. Run `npm run build` to verify type safety and bundle generation.

### Manual & Interactive Testing
1. Start dev server (`npm run dev`) on `http://localhost:3000`.
2. Test every tab:
   - **Overview**: Check quick summary stats and real-time sync pulse.
   - **LLM Quotas**: Verify 15% G3FM meter, countdown replenishment timer, and model selector.
   - **Nano-Banana**: Verify prompt gallery, image viewer modal, and credit tracker.
   - **Veo Video Studio**: Test video player simulation, render queue, and Flow Labs history.
   - **Device Sessions**: Test per-device history and remote session kill switch.
   - **Chat Vault**: Filter chats by Category (Coding, Image, Video, Science) and Device.
   - **Cloudflare R2 Sync**: Test side-by-side comparison, sync trigger, and backup download.
   - **Google Sign-In**: Test Google Auth modal and account switching.
