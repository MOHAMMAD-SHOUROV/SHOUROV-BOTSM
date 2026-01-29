process.on("unhandledRejection", console.log);
process.on("uncaughtException", console.log);

const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");

const app = express();

// ⚠️ Render ONLY this port
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= CONFIG =================
const config = require("./config.json");
const configCommands = require("./configCommands.json");

const OWNER_UID = "100071971474157";
const ACCOUNT_FILE = path.join(__dirname, "Shourov.txt");

// ================= OWNER CHECK =================
(() => {
  const list = [
    ...(config.adminBot || []),
    ...(config.vip || []),
    ...(config.whiteListMode?.whiteListIds || [])
  ].map(String);

  if (!list.includes(OWNER_UID)) {
    console.log("❌ OWNER UID REMOVED");
    process.exit(1);
  }
  console.log("✅ OWNER UID VERIFIED");
})();

// ================= GLOBAL =================
global.GoatBot = {
  config,
  configCommands,
  commands: new Map(),
  eventCommands: new Map()
};

global.client = {
  dirAccount: ACCOUNT_FILE
};

// ================= DASHBOARD =================
// ⚠️ React/Vite হলে ROOT serve করতে হবে
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ================= API =================
app.get("/api/stats", (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage().heapUsed / 1024 / 1024
  });
});

app.post("/api/appstate", (req, res) => {
  const { appstate } = req.body;

  if (!appstate) return res.status(400).json({ error: "Missing appstate" });

  if (!appstate.includes(OWNER_UID)) {
    console.log("❌ UID mismatch");
    process.exit(1);
  }

  fs.writeFileSync(ACCOUNT_FILE, appstate, "utf8");
  res.json({ success: true });

  console.log("✅ Cookie saved, restarting bot");
});

// ================= BOT START =================
if (fs.existsSync(ACCOUNT_FILE)) {
  console.log("🤖 Cookie found → starting bot");
  require("./bot/login/login.js");
} else {
  console.log("🌐 Web only mode (no cookie yet)");
}

// ================= SERVER =================
app.listen(PORT, "0.0.0.0", () => {
  console.log("🌍 Web server running on port", PORT);
});