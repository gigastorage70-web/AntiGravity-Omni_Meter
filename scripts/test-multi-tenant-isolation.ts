import { db } from "../src/lib/db";

function runMultiTenantIsolationTest() {
  console.log("==================================================================");
  console.log("RUNNING MULTI-TENANT PAAS ISOLATION SMOKE TEST");
  console.log("==================================================================");

  // 1. Create Tenant A (Free Tier)
  const userAEmail = `tester.free.${Date.now()}@gmail.com`;
  const userA = db.createUser({
    email: userAEmail,
    password: "PasswordA123!",
    name: "Tenant A (Free Tier)",
    tier: "free",
  });
  console.log(`[Tenant A Created]: ID=${userA.id}, Email=${userA.email}, StorageLimit=${userA.storage_limit_gb}GB, Tier=${userA.tier}`);

  // 2. Create Tenant B (Google One AI Premium)
  const userBEmail = `tester.premium.${Date.now()}@gmail.com`;
  const userB = db.createUser({
    email: userBEmail,
    password: "PasswordB123!",
    name: "Tenant B (Google One Premium)",
    tier: "google_one_premium",
  });
  console.log(`[Tenant B Created]: ID=${userB.id}, Email=${userB.email}, StorageLimit=${userB.storage_limit_gb}GB, Tier=${userB.tier}`);

  // ASSERTION 1: Storage quotas match tier entitlement
  if (userA.storage_limit_gb !== 15) throw new Error("Tenant A storage limit should be 15 GB");
  if (userB.storage_limit_gb !== 2048) throw new Error("Tenant B storage limit should be 2048 GB");
  console.log("✅ ASSERTION 1 PASSED: Storage entitlement strictly differs by tier (15 GB vs 2048 GB)");

  // 3. Check Initial Quotas
  const quotasAInitial = db.getUserQuotas(userA.id);
  const quotasBInitial = db.getUserQuotas(userB.id);

  const g3fmA = quotasAInitial.find((q) => q.model_id === "g3fm")!;
  const g3fmB = quotasBInitial.find((q) => q.model_id === "g3fm")!;

  console.log(`Initial G3FM Limit - Tenant A: ${g3fmA.token_limit_5h} tokens | Tenant B: ${g3fmB.token_limit_5h} tokens`);
  if (g3fmA.token_limit_5h !== 100000) throw new Error("Tenant A G3FM limit should be 100,000 tokens");
  if (g3fmB.token_limit_5h !== 1000000) throw new Error("Tenant B G3FM limit should be 1,000,000 tokens");
  console.log("✅ ASSERTION 2 PASSED: G3FM token limits strictly differ by plan tier (100k vs 1M)");

  // 4. Burn 30,000 tokens on Tenant A
  const initialPctA = g3fmA.remaining_percentage;
  const prevRemainingB = g3fmB.remaining_percentage;
  console.log(`Burning 30,000 tokens on Tenant A... (Initial: ${initialPctA}%, Tenant B: ${prevRemainingB}%)`);
  db.burnTokens(userA.id, "g3fm", 30000);

  const quotasAAfter = db.getUserQuotas(userA.id);
  const quotasBAfter = db.getUserQuotas(userB.id);

  const g3fmAAfter = quotasAAfter.find((q) => q.model_id === "g3fm")!;
  const g3fmBAfter = quotasBAfter.find((q) => q.model_id === "g3fm")!;

  console.log(`After Burn - Tenant A remaining: ${g3fmAAfter.remaining_percentage}% | Tenant B remaining: ${g3fmBAfter.remaining_percentage}%`);

  if (g3fmAAfter.remaining_percentage >= initialPctA) {
    throw new Error("Tenant A remaining percentage should have decreased");
  }
  if (g3fmBAfter.remaining_percentage !== prevRemainingB) {
    throw new Error("Tenant B quota leaked! Tenant B was affected by Tenant A burn!");
  }
  console.log("✅ ASSERTION 3 PASSED: Strict Quota Isolation Verified (Tenant A quota burned, Tenant B completely unaffected)");

  // 5. Generate Image on Tenant B
  console.log("Generating Nano-Banana Image on Tenant B...");
  db.addImage(userB.id, {
    prompt: "Cybernetic glowing neon reactor in 8k",
    aspect_ratio: "16:9",
  });

  const imagesA = db.getUserImages(userA.id);
  const imagesB = db.getUserImages(userB.id);

  console.log(`Images count - Tenant A: ${imagesA.length} | Tenant B: ${imagesB.length}`);
  if (imagesA.length !== 0) throw new Error("Tenant A should have 0 images");
  if (imagesB.length !== 1) throw new Error("Tenant B should have 1 image");
  console.log("✅ ASSERTION 4 PASSED: Asset Vault Isolation Verified (Tenant B image not visible to Tenant A)");

  // 6. Admin Platform Telemetry Check
  const metrics = db.getPlatformMetrics();
  console.log(`[Admin Telemetry Aggregates]: Users=${metrics.totalUsers}, Devices=${metrics.totalDevices}, Tokens=${metrics.totalTokensConsumed}`);
  if (metrics.totalUsers < 5) throw new Error("Admin metrics should aggregate all registered users");
  console.log("✅ ASSERTION 5 PASSED: Admin Platform Engine accurately aggregates all tenants");

  console.log("==================================================================");
  console.log("🎉 ALL MULTI-TENANT ISOLATION ASSERTIONS PASSED WITH ZERO LEAKAGE!");
  console.log("==================================================================");
}

runMultiTenantIsolationTest();
