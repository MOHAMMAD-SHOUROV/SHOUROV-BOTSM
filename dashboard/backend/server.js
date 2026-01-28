const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* =====================
   BOT CONTROL API
===================== */

// ▶ START
app.post("/api/bot/start", (req, res) => {
  exec("docker compose up -d", (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, status: "Bot Started" });
  });
});

// ⛔ STOP
app.post("/api/bot/stop", (req, res) => {
  exec("docker compose down", (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, status: "Bot Stopped" });
  });
});

// 🔄 RESTART
app.post("/api/bot/restart", (req, res) => {
  exec("docker compose restart", (err) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, status: "Bot Restarted" });
  });
});

// 🔐 LOGIN → COOKIE SAVE
app.post("/api/login", (req, res) => {
  const { cookie } = req.body;

  if (!cookie) {
    return res.status(400).json({ error: "Cookie missing" });
  }

  fs.writeFileSync("Shourov.txt", cookie);
  res.json({ success: true, message: "Cookie saved" });
});

app.listen(5050, () =>
  console.log("🟢 Dashboard API running on 5050")
);