const axios = require("axios");

module.exports = {
  name: "gf",
  description: "Get a random GF",
  usage: "gf / gf de / bot gf de",

  async execute({ api, event }) {
    try {
      // 🔹 API call
      const res = await axios.get(
        "https://shourov-bot-gf-api.onrender.com/shourovGF"
      );

      const data = res.data?.data;
      const images = res.data?.images;

      if (!data || data.length === 0) {
        return api.sendMessage(
          "❌ GF পাওয়া যায়নি",
          event.threadID,
          event.messageID
        );
      }

      // 🔹 Random select
      const gf = data[Math.floor(Math.random() * data.length)];
      const img =
        images && images.length > 0
          ? images[Math.floor(Math.random() * images.length)]
          : null;

      // 🔹 Message text
      const msg = `${gf.title}\n\n🔗 ${gf.fb}\n\n🤖 Create : SHOUROV-BOT`;

      // 🔹 Send message
      if (img) {
        const stream = await global.utils.getStreamFromURL(img);
        return api.sendMessage(
          {
            body: msg,
            attachment: stream
          },
          event.threadID,
          event.messageID
        );
      } else {
        return api.sendMessage(msg, event.threadID, event.messageID);
      }

    } catch (err) {
      console.error("GF ERROR:", err);
      return api.sendMessage(
        "⚠️ GF আনতে সমস্যা হয়েছে",
        event.threadID,
        event.messageID
      );
    }
  }
};