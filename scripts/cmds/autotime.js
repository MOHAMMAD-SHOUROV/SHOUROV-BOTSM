const axios = require("axios");

module.exports.config = {
  name: "autotime",
  version: "1.0.0",
  role: 0,
  author: "Alihsan Shourov",
  description: "Auto time message on/off (API based)",
  category: "AutoTime",
  countDown: 3
};

const API_URL = "https://YOUR-API-URL.onrender.com"; 
// 🔴 এখানে তোমার API link বসাও

module.exports.onStart = async function ({ api, event, args }) {
  const threadID = event.threadID;

  // ❌ OFF
  if (args[0] === "off") {
    try {
      await axios.post(`${API_URL}/autotime/control`, {
        threadID,
        status: false
      });

      return api.sendMessage("❌ AutoTime এই group এ OFF করা হয়েছে", threadID);
    } catch (e) {
      return api.sendMessage("⚠️ API error (OFF)", threadID);
    }
  }

  // ✅ ON
  if (args[0] === "on") {
    try {
      await axios.post(`${API_URL}/autotime/control`, {
        threadID,
        status: true
      });

      return api.sendMessage("✅ AutoTime এই group এ ON করা হয়েছে", threadID);
    } catch (e) {
      return api.sendMessage("⚠️ API error (ON)", threadID);
    }
  }

  // ℹ️ HELP
  return api.sendMessage(
    "ব্যবহার:\n• autotime on\n• autotime off",
    threadID
  );
};