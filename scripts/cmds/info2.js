const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "admin",
    version: "1.0.0",
    author: "alihsan shourov",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Show admin info" },
    longDescription: { en: "Show admin & bot information with video" },
    category: "Information",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, global }) {
    try {
      const wait = await message.reply("⏳ Loading admin info...");

      setTimeout(() => {
        message.unsend(wait.messageID);
      }, 3000);

      const botName = "𝐒𝐇𝐎𝐔𝐑𝐎𝐕_𝐁𝐎𝐓";
      const prefix = global.GoatBot.config.prefix;
      const owner = "𝐀𝐋𝐈𝐇𝐒𝐀𝐍 𝐒𝐇𝐎𝐔𝐑𝐎𝐕";
      const fb = "https://www.facebook.com/shourov.sm24";
      const whatsapp = "01709281334";
      const status = "SINGLE";

      const now = moment().tz("Asia/Dhaka");
      const date = now.format("DD/MM/YYYY");
      const time = now.format("hh:mm:ss A");

      const up = process.uptime();
      const uptime =
        Math.floor(up / 86400) + "d " +
        Math.floor((up % 86400) / 3600) + "h " +
        Math.floor((up % 3600) / 60) + "m " +
        Math.floor(up % 60) + "s";

      const res = await axios.get("https://shourov-info.vercel.app/api/info");
      let video = res.data.data;

      if (video.includes("drive.google.com")) {
        const id = video.match(/[-\w]{25,}/);
        if (id) video = `https://drive.google.com/uc?id=${id[0]}`;
      }

      await message.reply({
        body:
`╭───[ 👑 ADMIN INFO ]───╮
│
│ 👤 Owner  : ${owner}
│ 🤖 Bot    : ${botName}
│ 🔰 Prefix : ${prefix}
│ ❤️ Status : ${status}
│
│ 📆 Date   : ${date}
│ ⏰ Time   : ${time}
│ ⚙ Uptime : ${uptime}
│
│ 🌐 FB     : ${fb}
│ 📱 WhatsApp: ${whatsapp}
│
╰────────────────────╯`,
        attachment: await global.utils.getStreamFromURL(video)
      });

    } catch (e) {
      console.error(e);
      message.reply("❌ Admin info load করতে সমস্যা হয়েছে।");
    }
  }
};