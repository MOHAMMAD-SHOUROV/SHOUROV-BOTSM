} else {
  // System stats
  const uptime = formatDuration(Date.now() - global.botStartTime);
  const cpuUsage = os.loadavg()[0].toFixed(2);
  const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
  const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
  const platform = os.platform();
  const startTime = new Date(global.botStartTime).toLocaleString();
  const hostname = os.hostname();

  const netInterfaces = os.networkInterfaces();
  let ipAddr = "N/A";
  for (const name of Object.keys(netInterfaces)) {
    for (const net of netInterfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        ipAddr = net.address;
        break;
      }
    }
  }

  const finalMsg =
`✨ ${global.GoatBot.config.nickNameBot} 𝗨𝗽𝘁𝗶𝗺𝗲 ✨
[${createProgressBar(100)}] 100% ✅

⏳ Uᴘᴛɪᴍᴇ: ${uptime}
💻 Cᴘᴜ Lᴏᴀᴅ: ${cpuUsage}
📦 Mᴇᴍᴏʀʏ: ${usedMem} / ${totalMem} MB
🖥 Pʟᴀᴛғᴏʀᴍ: ${platform}
🚀 Bᴏᴛ Aᴄᴛɪᴠᴇᴛᴇᴅ: ${startTime}

👑 Oᴡɴᴀʀ: 𝐀𝐥𝐈𝐇𝐒𝐀𝐍 𝐒𝐇𝐎𝐔𝐑𝐎𝐕
📡 ʜᴏsᴛ: ${hostname}
🌐 Iᴘ Aᴅʀᴇss: ${ipAddr}`;

  // 🔥 পুরোনো loading message remove
  await api.unsendMessage(msg.messageID);

  // 🎥 GIF সহ নতুন message পাঠাও
  await api.sendMessage(
    {
      body: finalMsg,
      attachment: await api.getStreamFromURL(
        "https://files.catbox.moe/i5iwr7.gif"
      )
    },
    event.threadID
  );
}