const { exec } = require("child_process");

exports.startBot = () => exec("pm2 start pm2.config.js");
exports.stopBot = () => exec("pm2 stop shourov-bot-main");
exports.restartBot = () => exec("pm2 restart shourov-bot-main");