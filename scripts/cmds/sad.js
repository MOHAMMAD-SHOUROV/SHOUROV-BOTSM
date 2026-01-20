const axios = require("axios");

module.exports = {
  config: {
    name: "sad",
    version: "1.0",
    author: "Alihsan Shourov",
    countDown: 10,
    role: 0,
    shortDescription: "Sad quote with video",
    longDescription: "Send random sad quote with video from API",
    category: "video",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {
      // 🔗 তোমার API link
      const apiUrl = "https://shourov-api.vercel.app/api/sad";
      // যদি Render হয়:
      // const apiUrl = "https://your-render-link.onrender.com/sad";

      const res = await axios.get(apiUrl);

      if (!res.data || !res.data.media) {
        return message.send("❌ Sad data পাওয়া যায়নি");
      }

      const quote = res.data.quote;
      const videoUrl = res.data.media;
      const author = res.data.author?.tag || "SAD";

      await message.send({
        body: `${quote}\n\n— ${author}`,
        attachment: await global.utils.getStreamFromURL(videoUrl)
      });

    } catch (err) {
      console.error(err);
      message.send("⚠️ Sad video আনতে সমস্যা হয়েছে");
    }
  }
};