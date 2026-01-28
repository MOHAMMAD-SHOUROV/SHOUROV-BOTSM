const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { loginFB } = require("./auth");
const pm2 = require("./pm2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔐 LOGIN API
app.post("/api/login", loginFB);

// 🤖 BOT CONTROL
app.post("/api/bot/start", (req, res) => {
  pm2.startBot();
  res.json({ success: true });
});

app.post("/api/bot/stop", (req, res) => {
  pm2.stopBot();
  res.json({ success: true });
});

app.post("/api/bot/restart", (req, res) => {
  pm2.restartBot();
  res.json({ success: true });
});

app.listen(5050, () => {
  console.log("✅ Dashboard backend running on port 5050");
});