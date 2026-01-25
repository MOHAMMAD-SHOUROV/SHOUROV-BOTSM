module.exports = {
  config: {
    name: "pay",
    aliases: ["give", "sendmoney"],
    version: "1.0",
    author: "Alihsan Shourov",
    role: 0,
    category: "economy",
    guide: "{pn} @user <amount>"
  },

  onStart: async function ({ message, event, usersData, args }) {
    const senderID = event.senderID;

    if (!Object.keys(event.mentions).length) {
      return message.reply("❌ কাউকে mention করো");
    }

    const receiverID = Object.keys(event.mentions)[0];
    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ সঠিক amount দাও");
    }

    if (receiverID === senderID) {
      return message.reply("❌ নিজের কাছে টাকা পাঠানো যাবে না");
    }

    const senderData = await usersData.get(senderID);
    const receiverData = await usersData.get(receiverID);

    const senderBalance = senderData.money || 0;

    if (amount > senderBalance) {
      return message.reply("❌ তোমার কাছে এত টাকা নেই");
    }

    // 💸 UPDATE BALANCES
    await usersData.set(senderID, {
      money: senderBalance - amount,
      data: senderData.data
    });

    await usersData.set(receiverID, {
      money: (receiverData.money || 0) + amount,
      data: receiverData.data
    });

    message.reply(
`💸 MONEY TRANSFER SUCCESS
━━━━━━━━━━━━━━
➖ From: You
➕ To: ${receiverData.name}
💰 Amount: $${amount}

💳 Your Balance: $${senderBalance - amount}`
    );
  }
};