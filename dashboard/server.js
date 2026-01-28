const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const login = require("../fb-chat-api"); // তোমার api

const app = express();
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  const { email, password, mode } = req.body;

  try {
    login(
      { email, password },
      (err, api) => {
        if (err) return res.json({ success: false, error: err });

        const cookies = JSON.stringify(api.getAppState(), null, 2);

        if (mode === "dev") {
          fs.writeFileSync("Shourov.dev.txt", cookies);
        } else {
          fs.writeFileSync("Shourov.txt", cookies);
        }

        res.json({ success: true });
      }
    );
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

module.exports = app;