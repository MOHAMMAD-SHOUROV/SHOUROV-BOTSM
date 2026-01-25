module.exports = {
  config: {
    name: "gift",
    aliases: ["pay", "sendmoney"],
    version: "2.0",
    author: "Shourov",
    role: 0,
    category: "economy",
    guide: "{pn} @user amount"
  },

  onStart: async function ({ message, event, usersData, args }) {
    const senderID = event.senderID;

    let receiverID;

    // ✅ 1. Try mention
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      receiverID = Object.keys(event.mentions)[0];
    }
    // ✅ 2. Try reply fallback
    else if (event.messageReply) {
      receiverID = event.messageReply.senderID;
    }
    // ❌ No target
    else {
      return message.reply("❌ কাউকে mention করো অথবা reply দিয়ে command দাও");
    }

    // ✅ amount = LAST arg
    const amount = parseInt(args[args.length - 1]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ সঠিক amount দাও\nExample: /gift @user 100");
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

    // 💸 Update balances
    await usersData.set(senderID, {
      money: senderBalance - amount,
      data: senderData.data
    });

    await usersData.set(receiverID, {
      money: (receiverData.money || 0) + amount,
      data: receiverData.data
    });

    message.reply(
`✅ MONEY SENT
━━━━━━━━━━━━━━
👤 To: ${receiverData.name}
💰 Amount: $${amount}

💳 Your Balance: $${senderBalance - amount}`
    );
  }
};