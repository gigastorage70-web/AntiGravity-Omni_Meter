import fs from "fs";
import path from "path";
import { calculateLiveQuotas, scanLiveProcesses, scanLiveStorage } from "../src/lib/telemetryPipeline";

function generateAllProofOfLifeArtifacts() {
  const proofDir = path.join(process.cwd(), "docs", "proof-of-life");
  if (!fs.existsSync(proofDir)) {
    fs.mkdirSync(proofDir, { recursive: true });
  }

  console.log("Generating Live-Data Standard Proof-of-Life Artifacts (§9)...");

  // 1. Quotas proof-of-life
  const quotasResult = calculateLiveQuotas();
  fs.writeFileSync(
    path.join(proofDir, "quotas-live-pipeline.json"),
    JSON.stringify(quotasResult, null, 2),
    "utf-8"
  );
  console.log("✅ Saved docs/proof-of-life/quotas-live-pipeline.json");

  // 2. Devices / Host process inspection proof-of-life
  const devicesResult = scanLiveProcesses();
  fs.writeFileSync(
    path.join(proofDir, "devices-host-inspection.json"),
    JSON.stringify(devicesResult, null, 2),
    "utf-8"
  );
  console.log("✅ Saved docs/proof-of-life/devices-host-inspection.json");

  // 3. Storage filesystem watcher proof-of-life
  const storageResult = scanLiveStorage();
  fs.writeFileSync(
    path.join(proofDir, "storage-filesystem-scan.json"),
    JSON.stringify(storageResult, null, 2),
    "utf-8"
  );
  console.log("✅ Saved docs/proof-of-life/storage-filesystem-scan.json");

  console.log("All Proof-of-Life artifacts generated successfully!");
}

generateAllProofOfLifeArtifacts();
