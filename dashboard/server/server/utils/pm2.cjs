// ❌ Render environment does NOT support pm2
// This file is kept for future VPS usage

module.exports = {
  startBot: () => {
    return { success: false, message: "PM2 not supported on Render" };
  },
  stopBot: () => {
    return { success: false, message: "PM2 not supported on Render" };
  },
  restartBot: () => {
    return { success: false, message: "PM2 not supported on Render" };
  }
};
