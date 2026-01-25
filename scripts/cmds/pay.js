module.exports = {
  config: {
    name: "gift",
    version: "1.1.0",
    author: "Shourov",
    role: 0,
    category: "economy",
    guide: "{pn} @user amount | reply + {pn} amount"
  },

  onStart: async function ({ message, event, args, usersData }) {
    const senderID = event.senderID;

    // amount detect
    const amount = parseInt(args[args.length - 1]);
    if (isNaN(amount) || amount <= 0) {
      return message.reply(
        "❌ Tag a user and specify a valid amount.\nExample: /gift @user 100"
      );
    }

    // receiver detect
    let receiverID;

    if (event.messageReply) {
      receiverID = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      receiverID = Object.keys(event.mentions)[0];
    } else if (args[0] && !isNaN(args[0])) {
      receiverID = args[0];
    }

    if (!receiverID) {
      return message.reply(
        "❌ Tag a user or reply to a message.\nExample: /gift @user 100"
      );
    }

    if (receiverID === senderID) {
      return message.reply("❌ You cannot gift money to yourself.");
    }

    // get sender data
    const senderData = await usersData.get(senderID);
    if (!senderData || (senderData.money || 0) < amount) {
      return message.reply("❌ You don't have enough balance.");
    }

    // get receiver data
    const receiverData = await usersData.get(receiverID) || { money: 0 };

    // update balances
    await usersData.set(senderID, {
      money: (senderData.money || 0) - amount,
      data: senderData.data
    });

    await usersData.set(receiverID, {
      money: (receiverData.money || 0) + amount,
      data: receiverData.data
    });

    return message.reply(
      `🎁 Gift Successful!\n\n` +
      `💸 Sent: ${amount}\n` +
      `👤 To: ${receiverID}\n\n` +
      `✅ Transaction completed`
    );
  }
};