module.exports = {
  config: {
    name: "hot",
    version: "1.0",
    author: "SHOUROV",
    countDown: 5,
    role: 0,
    category: "Video"
  },

  onStart: async function ({ message }) {
    try {
      const api = "https://shourov-video-api1.onrender.com/api/hot";
      const res = await global.utils.getJSON(api);

      const video = res.video;
      const quote = res.quote;

      return message.send({
        body: quote,
        attachment: await global.utils.getStreamFromURL(video)
      });

    } catch (e) {
      return message.send("❌ Video load করতে সমস্যা হচ্ছে, পরে চেষ্টা করো");
    }
  }
};