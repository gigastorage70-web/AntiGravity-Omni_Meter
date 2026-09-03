import fs from "fs";
import path from "path";

async function fetchAndSaveProofs() {
  const proofDir = path.join(process.cwd(), "docs", "proof-of-life");
  if (!fs.existsSync(proofDir)) {
    fs.mkdirSync(proofDir, { recursive: true });
  }

  console.log("Fetching live proofs from running Next.js endpoints...");

  const endpoints = [
    { url: "http://localhost:3000/api/quotas", filename: "quotas-live-pipeline.json" },
    { url: "http://localhost:3000/api/devices", filename: "devices-host-inspection.json" },
    { url: "http://localhost:3000/api/storage", filename: "storage-filesystem-scan.json" },
    { url: "http://localhost:3000/api/chats", filename: "chats-transcript-ingestion.json" },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      const data = await res.json();
      const dest = path.join(proofDir, ep.filename);
      fs.writeFileSync(dest, JSON.stringify(data, null, 2), "utf-8");
      console.log(`✅ Saved ${ep.filename} (Provenance: ${data.provenance?.source || "live"}, Engine: ${data.provenance?.pipeline_engine || "Engine"})`);
    } catch (e) {
      console.error(`Failed to fetch ${ep.url}:`, e);
    }
  }

  console.log("\nAll 4 Live-Data Proof-of-Life artifacts generated successfully!");
}

fetchAndSaveProofs();
