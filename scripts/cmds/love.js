const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "love",
    role: 0,
    category: "photo"
  },

  onStart: async function ({ api, event }) {
    const mention = Object.keys(event.mentions);

    if (mention.length === 0)
      return api.sendMessage(
        "💚 যাকে ভালোবাসো তাকে mention করো",
        event.threadID,
        event.messageID
      );

    const one = event.senderID;
    const two = mention[0];

    try {
      const imgPath = await makeLove(one, two);

      api.sendMessage(
        {
          body: "ইগো আর ভালোবাসা লড়াই হলে ভালোবাসা টাই হেরে যায় 💔🥀",
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    } catch (e) {
      console.error(e);
      api.sendMessage("❌ Image তৈরি করা যায়নি", event.threadID);
    }
  }
};

async function makeLove(one, two) {
  let av1 = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512`);
  let av2 = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512`);

  av1.circle();
  av2.circle();

  let img = await jimp.read("https://i.imgur.com/LjpG3CW.jpeg");
  img.resize(1440, 1080)
     .composite(av1.resize(470, 470), 125, 210)
     .composite(av2.resize(470, 470), 800, 200);

  const path = `love_${one}_${two}.png`;
  await img.writeAsync(path);
  return path;
}