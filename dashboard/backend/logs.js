const { exec } = require("child_process");

module.exports.logs = (req, res) => {
  exec("pm2 logs shourov-bot-main --lines 50", (err, stdout) => {
    if (err) return res.send(err.message);
    res.send(stdout);
  });
};