const axios = require("axios");

module.exports = {
  config: {
    name: "gf",
    version: "1.0",
    author: "ALIHSAN SHOUROV",
    role: 0,
    shortDescription: "Get random GF",
    longDescription: "Random GF from API",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {
      // 👉 এখানে async function এর ভিতরে await OK
      const response = await axios.get(
        "https://shourov-bot-gf-api.onrender.com/shourovGF"
      );

      const data = response.data.data;
      const images = response.data.images;

      const randomData =
        data[Math.floor(Math.random() * data.length)];
      const randomImg =
        images[Math.floor(Math.random() * images.length)];

      await message.reply({
        body: `${randomData.title}\n\n${randomData.fb}`,
        attachment: await global.utils.getStreamFromURL(randomImg)
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ GF পাওয়া যায়নি");
    }
  }
};