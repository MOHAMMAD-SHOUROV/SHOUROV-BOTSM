const axios = require("axios");

const SLOT_GIF = "https://files.catbox.moe/c2t4m0.gif";

module.exports = {
  config: {
    name: "slot",
    version: "3.0",
    author: "Shourov",
    role: 0,
    category: "game",
    description: "Animated slot with auto unsent GIF"
  },

  onStart: async function ({ message }) {
    try {
      // 1️⃣ Send spinning GIF
      const spinMsg = await message.send({
        body: "🎰 Slot spinning...",
        attachment: await global.utils.getStreamFromURL(SLOT_GIF)
      });

      // 2️⃣ Wait for spin effect
      await new Promise(resolve => setTimeout(resolve, 2500));

      // 3️⃣ Slot logic
      const slots = ["🍒", "🍋", "🍉", "⭐", "💎"];
      const s1 = slots[Math.floor(Math.random() * slots.length)];
      const s2 = slots[Math.floor(Math.random() * slots.length)];
      const s3 = slots[Math.floor(Math.random() * slots.length)];

      let resultText = "";
      let win = false;

      if (s1 === s2 && s2 === s3) {
        win = true;
        resultText = `🎉 JACKPOT!\n[ ${s1} | ${s2} | ${s3} ]\n🔥 You WIN!`;
      } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        win = true;
        resultText = `✨ Nice!\n[ ${s1} | ${s2} | ${s3} ]\n✅ Small Win`;
      } else {
        resultText = `💔 Try Again!\n[ ${s1} | ${s2} | ${s3} ]\n❌ You Lost`;
      }

      // 4️⃣ Send result
      await message.send(resultText);

      // 5️⃣ Auto unsent spinning GIF
      if (spinMsg?.messageID) {
        await message.unsend(spinMsg.messageID);
      }

    } catch (err) {
      console.error(err);
      message.send("❌ Slot system error");
    }
  }
};