module.exports = {
  config: {
    name: "gf",
    aliases: ["gf de", "bot gf de", "gf dao"],
    version: "1.0",
    author: "SHOUROV",
    role: 0,
    category: "fun"
  },

  onStart: async function ({ message, event }) {
    try {
      const text = event.body?.toLowerCase() || "";

      // ✅ যেকোনো gf থাকলেই কাজ করবে
      if (!text.includes("gf")) return;

      const axios = require("axios");

      const res = await axios.get(
        "https://shourov-bot-gf-api.onrender.com/shourovGF"
      );

      const data = res.data.data;
      const images = res.data.images;

      if (!data || data.length === 0) {
        return message.reply("❌ GF পাওয়া যায়নি");
      }

      const randomData =
        data[Math.floor(Math.random() * data.length)];

      const randomImg =
        images[Math.floor(Math.random() * images.length)];

      return message.reply({
        body: `${randomData.title}\n\n${randomData.fb}`,
        attachment: await global.utils.getStreamFromURL(randomImg)
      });

    } catch (err) {
      console.log(err);
      return message.reply("⚠️ GF আনতে সমস্যা হয়েছে");
    }
  }
};