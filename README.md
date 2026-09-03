# Antigravity Omniverse | Cloud Command Center & AI Studio Hub

A production-grade, deployment-ready dashboard built with Next.js 14, Tailwind CSS, Lucide icons, and Recharts. Strictly compliant with the **[Live-Data Standard](production-grade-dashboard-standard.md)**.

---

## ⚡ Key Capabilities
1. **Google Identity Authentication Portal (`/`)**:
   - OAuth 2.0 login gate capturing account profile and active subscription entitlement (**Google One AI Premium**, **Google Workspace Enterprise AI**, or **Vertex AI Enterprise**).
   - Real-time OAuth verification handshake and persistent session storage.
2. **Live AGQ Model Quotas & Telemetry**:
   - Real-time tracking of Gemini 3 Flash (Thinking), Gemini 3.0 Pro, and Claude 3.7 Sonnet token quotas.
   - **5-Hour Rolling Token Bucket Countdown** tracking second-by-second capacity replenishment (+25%).
   - Interactive prompt burn and replenish load simulator.
3. **Nano-Banana AI Image Studio**:
   - Multi-aspect ratio engine (`16:9`, `1:1`, `9:16`, `4:3`) with daily credit tracking and 4K synced gallery.
4. **Google Veo 2 & Flow Labs Video Studio**:
   - Interactive cinematic video monitor with 60fps streaming player and progressive render pipeline simulator.
5. **Cross-Device Omni-Chat Vault**:
   - Ingests real local JSONL conversation trajectories (including Samsung Galaxy S21+ ADB sessions and Windows workstation transcripts).
   - Deep inspection of thought chains, tool executions, and artifact diffs. One-click JSON export.
6. **Cloudflare R2 & Vercel Blob Workspace Backup**:
   - Side-by-side local workspace directory vs Cloudflare R2 bucket explorer with zero-egress cost tracking.

---

## 🛡️ Live-Data Standard Compliance (§5 & §6)
- **Data Provenance**: Every metric carries `{ source: "live", fetched_at, pipeline_engine, data_hash }`.
- **Differential Smoke Test**: `npm run test:differential-smoke` asserts that distinct inputs produce distinct, directionally correct metric outputs.
- **Proof-of-Life Artifacts**: Persisted in [`docs/proof-of-life/`](docs/proof-of-life/).

---

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Open in browser
http://localhost:3000
```

### Quick Desktop Launcher (Windows)
Double-click `Launch_Antigravity_Meter.bat` on the Desktop.

### Deploying to Vercel
1. Push this repository to your GitHub account (`git push -u origin main`).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your `Antigravity-meter` repository.
4. Framework preset: **Next.js**.
5. Click **Deploy**.
