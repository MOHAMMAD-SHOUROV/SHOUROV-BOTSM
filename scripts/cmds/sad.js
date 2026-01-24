module.exports = {
  config: {
    name: "sad",
    version: "1.0",
    author: "SHOUROV",
    countDown: 5,
    role: 0,
    category: "Video"
  },

  onStart: async function ({ message }) {
    try {
      const api = "https://shourov-video-api1.onrender.com/api/sad";
      const res = await global.utils.getJSON(api);

      return message.send({
        body: res.quote,
        attachment: await global.utils.getStreamFromURL(res.video)
      });

    } catch (err) {
      return message.send("🥀 Sad video load হয়নি");
    }
  }
};