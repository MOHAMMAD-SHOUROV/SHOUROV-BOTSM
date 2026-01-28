const express = require("express");
const router = express.Router();

router.get("/connect", (req, res) => {
  res.json({
    success: true,
    message: "Facebook connect API ready",
  });
});

module.exports = router;
