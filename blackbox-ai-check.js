/**
 * 🧠 Project BlackBox AI – Automated Health Checker
 * Scans backend config, environment, and API routes for issues.
 * Author: Krushnrajsinh Jadeja
 */

const fs = require("fs");
const path = require("path");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { execSync } = require("child_process");

// ===========================
//  1. BASIC CONFIG
// ===========================
const BACKEND_URL =
  process.env.API_URL || "https://blog-cms-fullstack-production.up.railway.app";
const CHECK_ENDPOINTS = [
  "/api/posts/public",
  "/api/auth/login",
  "/api/contact",
];
const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET", "PORT"];

(async () => {
  console.log("\n🧠 Starting BlackBox AI Diagnostic...\n");

  // ===========================
  // 2. Check Environment File
  // ===========================
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.warn("⚠️  Missing .env file at project root!");
  } else {
    const envContent = fs.readFileSync(envPath, "utf-8");
    console.log("📄  .env file found.");

    REQUIRED_ENV.forEach((key) => {
      if (!envContent.includes(`${key}=`)) {
        console.error(`❌ Missing environment variable: ${key}`);
      } else {
        console.log(`✅ ${key} found`);
      }
    });
  }

  // ===========================
  // 3. Check Dependencies
  // ===========================
  console.log("\n📦 Checking dependencies in package.json...");
  const pkg = require("./package.json");
  const deps = Object.keys(pkg.dependencies || {});
  const importantDeps = [
    "express",
    "mongoose",
    "jsonwebtoken",
    "cors",
    "multer",
    "bcryptjs",
  ];
  importantDeps.forEach((dep) => {
    if (!deps.includes(dep)) {
      console.error(`❌ Missing dependency: ${dep}`);
    } else {
      console.log(`✅ Dependency ${dep} installed`);
    }
  });

  // ===========================
  // 4. Ping API Endpoints
  // ===========================
  console.log("\n🌐 Checking API routes health...");
  for (const route of CHECK_ENDPOINTS) {
    const url = `${BACKEND_URL}${route}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`❌ ${url} responded with ${res.status}`);
        const text = await res.text();
        console.log(`🔍 Response:`, text.slice(0, 200));
      } else {
        console.log(`✅ ${url} OK (${res.status})`);
      }
    } catch (err) {
      console.error(`🚫 ${url} failed to load:`, err.message);
    }
  }

  // ===========================
  // 5. Check Local File Structure
  // ===========================
  console.log("\n🧩 Checking backend structure...");
  const requiredDirs = ["models", "routes", "middleware"];
  requiredDirs.forEach((dir) => {
    if (!fs.existsSync(path.join(process.cwd(), dir))) {
      console.error(`❌ Missing directory: ${dir}`);
    } else {
      console.log(`✅ Directory ${dir} found`);
    }
  });

  // ===========================
  // 6. Security Scan (Quick)
  // ===========================
  console.log("\n🔒 Quick Security Check...");
  const authFile = fs.readFileSync("./routes/auth.js", "utf-8");
  if (authFile.includes("process.env.JWT_SECRET") === false) {
    console.warn(
      "⚠️ JWT_SECRET not referenced in auth route – using fallback key?"
    );
  }
  if (authFile.includes("rateLimit") === false) {
    console.warn(
      "⚠️ No rate limiting found – consider adding rateLimit middleware."
    );
  }

  // ===========================
  // 7. Final Report
  // ===========================
  console.log("\n🧾 BlackBox AI Diagnostic Completed.");
  console.log(
    "👉 Review the logs above for ❌ warnings and ✅ confirmations.\n"
  );
})();
