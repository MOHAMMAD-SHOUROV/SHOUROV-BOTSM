module.exports = {
  config: {
    name: "gift",
    version: "1.1",
    author: "Shourov",
    role: 0,
    category: "economy",
    description: "Send money to another user"
  },

  onStart: async function ({ message, event, usersData, args }) {
    const senderID = event.senderID;

    // amount
    const amount = parseInt(args[args.length - 1]);
    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ সঠিক amount দাও\nExample: /gift 100");
    }

    // receiver detect (reply > mention)
    let receiverID;

    if (event.messageReply) {
      receiverID = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      receiverID = Object.keys(event.mentions)[0];
    }

    if (!receiverID) {
      return message.reply(
        "❌ কাউকে reply করো অথবা mention করো\nExample:\n/gift 100 (reply দিয়ে)\n/gift @user 100"
      );
    }

    if (receiverID === senderID) {
      return message.reply("❌ নিজেকে gift করা যাবে না");
    }

    const senderData = await usersData.get(senderID);
    const receiverData = await usersData.get(receiverID);

    if (!senderData || !receiverData) {
      return message.reply("❌ User database এ পাওয়া যায়নি");
    }

    if ((senderData.money || 0) < amount) {
      return message.reply("❌ তোমার balance যথেষ্ট না");
    }

    // balance update
    await usersData.set(senderID, {
      money: senderData.money - amount,
      data: senderData.data
    });

    await usersData.set(receiverID, {
      money: (receiverData.money || 0) + amount,
      data: receiverData.data
    });

    return message.reply(
      `🎁 Gift Successful!\n\n➖ You sent: $${amount}\n➕ Receiver got: $${amount}`
    );
  }
};