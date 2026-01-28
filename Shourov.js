const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const app = express();
const port = process.env.PORT || 7177;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== LOAD CONFIG (ONLY ONCE) =====
const config = require(dirConfig);
const configCommands = require(dirConfigCommands);

// ===== OWNER UID CHECK =====
const OWNER_UID = "100071971474157";

const adminList = (config.adminBot || []).map(String);
const vipList = (config.vip || []).map(String);
const whitelist = (config.whiteListMode?.whiteListIds || []).map(String);

if (
  !adminList.includes(OWNER_UID) &&
  !vipList.includes(OWNER_UID) &&
  !whitelist.includes(OWNER_UID)
) {
  console.log("🚫 OWNER UID REMOVED — BOT STOPPED");
  process.exit(1);
}

// ===== DASHBOARD =====
app.use("/dashboard", express.static(path.join(__dirname, "dashboard")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard/index.html"));
});

app.get("/appstate", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard/appstate.html"));
});

// ===== API =====
app.get("/api/stats", (req, res) => {
  const uptime = process.uptime();
  res.json({
    cpu: ((os.loadavg()[0] * 100) / os.cpus().length).toFixed(2),
    memoryUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
    nodeVersion: process.version
  });
});

app.post("/api/appstate", (req, res) => {
  fs.writeFile(dirAccount, req.body.appstate, "utf8", () => {
    res.json({ success: true });
    setTimeout(() => process.exit(2), 1000);
  });
});

// ===== LISTEN =====
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 SERVER LIVE ON PORT ${port}`);
});
