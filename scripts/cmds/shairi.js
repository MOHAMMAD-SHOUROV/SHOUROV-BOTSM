const axios = require("axios");

module.exports = {
  config: {
    name: "shairi",
    version: "1.0",
    author: "Shourov",
    role: 0,
    category: "video"
  },

  onStart: async function ({ message }) {
    try {
      const res = await axios.get(
        "https://shourov-api.vercel.app/api/shairi"
      );

      const { shairi, video } = res.data.data;

      message.send({
        body: `${shairi}\n\n— SHOUROV-BOT —`,
        attachment: await global.utils.getStreamFromURL(video)
      });

    } catch (err) {
      message.send("❌ Shairi আনতে সমস্যা হয়েছে");
    }
  }
};