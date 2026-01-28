const fs = require("fs");

app.post("/feature", (req, res) => {
  const config = JSON.parse(fs.readFileSync("config.json"));
  config.features[req.body.name] = req.body.value;
  fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
  res.json({ success: true });
});