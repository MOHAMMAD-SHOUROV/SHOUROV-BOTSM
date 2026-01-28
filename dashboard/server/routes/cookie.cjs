const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const COOKIE_FILE = path.join(__dirname, "../Shourov.txt");

router.post("/save", (req, res) => {
  const { cookie } = req.body;

  if (!cookie) {
    return res.status(400).json({
      success: false,
      message: "Cookie missing",
    });
  }

  fs.writeFileSync(COOKIE_FILE, cookie);
  res.json({
    success: true,
    message: "Cookie saved to Shourov.txt",
  });
});

module.exports = router;
