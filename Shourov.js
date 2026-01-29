process.on("unhandledRejection", err => console.log(err));
process.on("uncaughtException", err => console.log(err));

const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 7177;

// ================= BASIC =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= PATH =================
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

// ================= LOAD CONFIG =================
const config = require(dirConfig);
const configCommands = require(dirConfigCommands);

// ================= LOAD UTILS =================
const utils = require("./utils.js");
global.utils = utils;

utils.log("SYSTEM", "Utils loaded");

// ================= OWNER PROTECTION =================
const OWNER_UID = "100071971474157";

(function checkOwnerUID() {
  const admin = (config.adminBot || []).map(String);
  const vip = (config.vip || []).map(String);
  const white = (config.whiteListMode?.whiteListIds || []).map(String);

  if (![...admin, ...vip, ...white].includes(OWNER_UID)) {
    console.log("🚫 OWNER UID REMOVED — BOT STOPPED");
    process.exit(1);
  }

  utils.log("SECURITY", "OWNER UID VERIFIED");
})();

// ================= GLOBAL BOT =================
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

// ================= DASHBOARD =================
// ⚠️ dashboard ফোল্ডার থাকতে হবে
app.use(express.static(path.join(__dirname, "dashboard")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard/index.html"));
});

// ================= SYSTEM STATS =================
app.get("/api/stats", (req, res) => {
  const uptime = process.uptime();
  res.json({
    cpu: ((os.loadavg()[0] * 100) / os.cpus().length).toFixed(2),
    memoryUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    memoryTotal: Math.round(os.totalmem() / 1024 / 1024),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
    platform: os.platform(),
    arch: os.arch(),
    cpuCores: os.cpus().length,
    nodeVersion: process.version
  });
});

// ================= SAVE COOKIE =================
app.post("/api/appstate", async (req, res) => {
  const { appstate } = req.body;

  if (!appstate)
    return res.status(400).json({ error: "Appstate missing" });

  if (!appstate.includes(OWNER_UID)) {
    console.log("🚫 COOKIE UID MISMATCH — BOT STOPPED");
    process.exit(1);
  }

  await fs.writeFile(ACCOUNT_FILE, appstate, "utf8");

  res.json({ success: true });
  utils.log("LOGIN", "Cookie saved, bot will start");

  setTimeout(() => process.exit(2), 1000);
});

// ================= BOT START (AFTER COOKIE) =================
(async () => {
  if (!fs.existsSync(ACCOUNT_FILE)) {
    utils.log("BOT", "No cookie yet — dashboard only");
    return;
  }

  utils.log("BOT", "Cookie found — starting bot...");
  require(`./bot/login/login${NODE_ENV === "development" ? ".dev.js" : ".js"}`);
})();

// ================= START SERVER =================
app.listen(PORT, "0.0.0.0", () => {
  utils.log("WEB", `Dashboard running on http://localhost:${PORT}`);
});