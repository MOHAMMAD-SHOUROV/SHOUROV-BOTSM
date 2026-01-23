const fs = require("fs-extra");
const request = require("request");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "admin",
    version: "1.1.0",
    author: "Alihsan Shourov",
    role: 0,
    shortDescription: "Admin profile",
    longDescription: "Show admin profile with picture",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY • HH:mm:ss");

      const cachePath = __dirname + "/cache/admin.png";
      const fbPicUrl =
        "https://graph.facebook.com/100071971474157/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

      // download image
      await new Promise((resolve, reject) => {
        request(fbPicUrl)
          .pipe(fs.createWriteStream(cachePath))
          .on("finish", resolve)
          .on("error", reject);
      });

      const body = `
╭───〔 👑 ADMIN INFO 👑 〕───╮

👤 Name        : Alihsan Shourov
🕌 Religion    : Islam
📍 Address     : Debiganj, Panchagarh
👨 Gender      : Male
💞 Relationship: Single
🎓 Work        : Student

📧 Gmail       : shourovislam5430@gmail.com
📘 Facebook    : facebook.com/shourov.sm24
📱 WhatsApp    : wa.me/+8801709281334
✈️ Telegram    : t.me/shourov_ss

⏰ Time        : ${time}
🤖 Bot Uptime  : ${hours}h ${minutes}m ${seconds}s

╰───────────〔 SHOUROV BOT 🤖 〕───────────╯
`;

      await api.sendMessage(
        {
          body,
          attachment: fs.createReadStream(cachePath)
        },
        event.threadID
      );

      // delete cache
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);

    } catch (err) {
      console.error("Admin command error:", err);
      api.sendMessage(
        "❌ Admin command এ সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।",
        event.threadID
      );
    }
  }
};