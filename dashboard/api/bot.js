const { exec } = require("child_process");

exports.start = () => exec("pm2 start shourov-bot");
exports.stop = () => exec("pm2 stop shourov-bot");
exports.restart = () => exec("pm2 restart shourov-bot");