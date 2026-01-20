const axios = require("axios");

module.exports = {
  config: {
    name: "hot",
    version: "8.0",
    author: "alihsan shourov",
    countDown: 10,
    role: 0,
    category: "Video",
    shortDescription: "Random video from API"
  },

  onStart: async function ({ message }) {
    try {
      // 🔗 তোমার API link
      const apiUrl = "https://shourov-api.vercel.app/api/hot";

      const res = await axios.get(apiUrl);
      const videoUrl = res.data.video;

      message.send({
        body: "🔥 Random video from API",
        attachment: await global.utils.getStreamFromURL(videoUrl)
      });

    } catch (err) {
      console.error(err);
      message.send("⚠️ Video আনতে সমস্যা হয়েছে");
    }
  }
};