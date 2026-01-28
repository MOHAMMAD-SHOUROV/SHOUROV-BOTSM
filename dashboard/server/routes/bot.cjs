const express = require("express");
const router = express.Router();

router.post("/start", (req, res) => {
  res.json({ success: true, status: "Bot started" });
});

router.post("/stop", (req, res) => {
  res.json({ success: true, status: "Bot stopped" });
});

module.exports = router;
