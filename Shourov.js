process.on("unhandledRejection", err => console.log(err));
process.on("uncaughtException", err => console.log(err));

const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 7177;

// ================== BASIC SETUP ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== PATHS ==================
const { NODE_ENV } = process.env;

const dirConfig = path.join(
  __dirname,
  `config${["production", "development"].includes(NODE_ENV) ? ".dev" : ""}.json`
);

const dirConfigCommands = path.join(
  __dirname,
  `configCommands${["production", "development"].includes(NODE_ENV) ? ".dev" : ""}.json`
);

const ACCOUNT_FILE = path.join(
  __dirname,
  `Shourov${["production", "development"].includes(NODE_ENV) ? ".dev" : ""}.txt`
);

// ================== LOAD CONFIG ==================
const config = require(dirConfig);
const configCommands = require(dirConfigCommands);

// ================== 🔐 OWNER UID PROTECTION ==================
const OWNER_UID = "100071971474157";

function checkOwnerUID() {
  const adminList = (config.adminBot || []).map(String);
  const vipList = (config.vip || []).map(String);
  const whitelist = (config.whiteListMode?.whiteListIds || []).map(String);

  const ok =
    adminList.includes(OWNER_UID) ||
    vipList.includes(OWNER_UID) ||
    whitelist.includes(OWNER_UID);

  if (!ok) {
    console.log("🚫 OWNER UID REMOVED — BOT STOPPED");
    process.exit(1);
  }

  console.log("✅ OWNER UID VERIFIED");
}

checkOwnerUID();

// ================== GLOBAL BOT SETUP ==================
global.GoatBot = {
  startTime: Date.now(),
  commands: new Map(),
  eventCommands: new Map(),
  aliases: new Map(),
  onChat: [],
  onEvent: [],
  onReply: new Map(),
  onReaction: new Map(),
  config,
  configCommands,
  fcaApi: null,
  botID: null
};

global.client = {
  dirConfig,
  dirConfigCommands,
  dirAccount: ACCOUNT_FILE,
  cache: {},
  commandBanned: configCommands.commandBanned
};

// ================== DASHBOARD (STATIC) ==================
app.use("/dashboard", express.static(path.join(__dirname, "dashboard")));

// Home → dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard/index.html"));
});

// Appstate page
app.get("/appstate", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard/appstate.html"));
});

// ================== API: SYSTEM STATS ==================
app.get("/api/stats", (req, res) => {
  const uptime = process.uptime();
  res.json({
    cpu: ((os.loadavg()[0] * 100) / os.cpus().length).toFixed(2),
    memoryUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    memoryTotal: Math.round(os.totalmem() / 1024 / 1024),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor(
      (uptime % 3600) / 60
    )}m`,
    platform: os.platform(),
    arch: os.arch(),
    cpuCores: os.cpus().length,
    nodeVersion: process.version
  });
});

// ================== API: SAVE COOKIE / APPSTATE ==================
app.post("/api/appstate", async (req, res) => {
  const { appstate } = req.body;

  if (!appstate)
    return res.status(400).json({ error: "Appstate missing" });

  // extra protection: UID must exist in cookie
  if (!appstate.includes(OWNER_UID)) {
    console.log("🚫 COOKIE UID MISMATCH — BOT STOPPED");
    return process.exit(1);
  }

  await fs.writeFile(ACCOUNT_FILE, appstate, "utf8");

  res.json({ success: true });

  console.log("✅ Cookie saved — restarting bot");

  // Restart bot after save
  setTimeout(() => process.exit(2), 1000);
});

// ================== LOAD UTILS (REQUIRED FOR LOGIN) ==================
const utils = require("./utils.js");
global.utils = utils;

// ================== BOT START (COOKIE থাকলে) ==================
(async () => {
  if (!fs.existsSync(ACCOUNT_FILE)) {
    console.log("ℹ️ No cookie yet — dashboard only mode");
    return;
  }

  console.log("🤖 Cookie found — starting bot...");
  require(`./bot/login/login${NODE_ENV === "development" ? ".dev.js" : ".js"}`);
})();

// ================== SERVER START (ALWAYS LAST) ==================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Dashboard running on http://localhost:${PORT}`);
});