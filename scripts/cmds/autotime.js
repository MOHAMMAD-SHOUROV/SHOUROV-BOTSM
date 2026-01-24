const axios = require("axios");

module.exports.config = {
  name: "autotime",
  version: "1.0.0",
  role: 0,
  author: "Alihsan Shourov",
  description: "Auto time on/off system (group wise)",
  category: "Auto",
  usages: "autotime on | autotime off",
  cooldowns: 3
};

// ======================
// ON / OFF COMMAND
// ======================
module.exports.onStart = async function ({ api, event, args }) {
  const threadID = event.threadID;

  if (!global.autotimeStatus) global.autotimeStatus = {};

  if (args[0] === "off") {
    global.autotimeStatus[threadID] = false;
    return api.sendMessage(
      "❌ AutoTime এই group এ OFF করা হয়েছে",
      threadID
    );
  }

  if (args[0] === "on") {
    global.autotimeStatus[threadID] = true;
    return api.sendMessage(
      "✅ AutoTime এই group এ ON করা হয়েছে",
      threadID
    );
  }

  return api.sendMessage(
    "ব্যবহার করুন:\n• autotime on\n• autotime off",
    threadID
  );
};

// ======================
// AUTO TIME SYSTEM
// ======================
module.exports.onLoad = async function ({ api }) {

  if (!global.autotimeStatus) global.autotimeStatus = {};

  const runAutoTime = async () => {
    try {
      // 🔗 তোমার API link এখানে বসাও
      const res = await axios.get("https://shourov-video-api1.onrender.com/api/autotime");

      if (!res.data || !res.data.message) return nextTick();

      const message = res.data.message;

      const threads = global.db.allThreadData.map(t => t.threadID);

      for (const tid of threads) {
        // ❌ যদি এই group OFF থাকে
        if (global.autotimeStatus[tid] === false) continue;

        api.sendMessage(
          `⏰ ${res.data.time}\n\n${message}\n\n— SHOUROV BOT 🤖`,
          tid
        );
      }

    } catch (e) {
      console.log("AutoTime API error:", e.message);
    }

    nextTick();
  };

  const nextTick = () => {
    const now = new Date();
    const delay =
      60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    setTimeout(runAutoTime, delay);
  };

  runAutoTime();
};