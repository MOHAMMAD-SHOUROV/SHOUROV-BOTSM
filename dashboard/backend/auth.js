const fs = require("fs");
const login = require("../../fb-chat-api");

module.exports.loginFB = async (req, res) => {
  const { email, password, mode } = req.body;

  login({ email, password }, (err, api) => {
    if (err) {
      return res.status(401).json({ success: false, error: err });
    }

    const appState = JSON.stringify(api.getAppState(), null, 2);

    if (mode === "dev") {
      fs.writeFileSync("Shourov.dev.txt", appState);
    } else {
      fs.writeFileSync("Shourov.txt", appState);
    }

    res.json({ success: true });
  });
};