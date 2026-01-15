const { getTime } = global.utils;
const { createCanvas, loadImage, registerFont } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

// 🔹 Preload font once
(async () => {
  try {
    const fontPath = path.join(__dirname, "cache", "tt-modernoir-trial.bold.ttf");
    if (!fs.existsSync(fontPath)) {
      console.log("⏬ Downloading welcome font...");
      const fontUrl = "https://github.com/MR-MAHABUB-004/MAHABUB-BOT-STORAGE/raw/main/fronts/tt-modernoir-trial.bold.ttf";
      const { data } = await axios.get(fontUrl, { responseType: "arraybuffer" });
      await fs.outputFile(fontPath, data);
      console.log("✅ Font downloaded");
    }
    registerFont(fontPath, { family: "ModernoirBold" });
    console.log("✅ Font registered: ModernoirBold");
  } catch (err) {
    console.error("❌ Font preload error:", err);
  }
})();

module.exports = {
  config: {
    name: "welcome",
    version: "4.1",
    author: "MR᭄﹅ MAHABUB﹅ メꪜ",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    try {
      const { threadID, logMessageType, logMessageData } = event;

      const botID = api.getCurrentUserID();
      const addedParticipants = logMessageData.addedParticipants || [];

      // 🔹 Case 1: Bot added to a new group
      if (logMessageType === "log:subscribe" && addedParticipants.some(p => p.userFbId === botID)) {
        // Get nickname from config
        const nickname = global.GoatBot?.config?.nickNameBot || "Bot";
        await api.changeNickname(nickname, threadID, botID);

        // Send connected message
        const msg = `
━━━━━━━━━━━━━━━━━━━━━━━━━━
${nickname}☔︎𝐒𝐇𝐎𝐔𝐑𝐎𝐕-𝐁𝐎𝐓 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟
━━━━━━━━━━━━━━━━━━━━━━━━━━
𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡: 𝐀𝐥𝐈𝐇𝐒𝐀𝐍 𝐒𝐇𝐎𝐔𝐑𝐎𝐕
━━━━━━━━━━━━━━━━━━━━━━━━━━
𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: https://www.facebook.com/shourov.sm24
━━━━━━━━━━━━━━━━━━━━━━━━━━
𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣: wa.me/+8801709281334
━━━━━━━━━━━━━━━━━━━━━━━━━━
𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠: t.me/
━━━━━━━━━━━━━━━━━━━━━━━━━━
        `;
        await api.sendMessage(msg, threadID);
        return; // Stop further execution
      }

      // 🔹 Case 2: Normal user added (welcome canvas)
      if (logMessageType !== "log:subscribe") return;

      const threadData = await threadsData.get(threadID);
      const threadName = threadData.threadName || "Group Chat";
      const memberCount = (await api.getThreadInfo(threadID)).participantIDs.length;

      const user = addedParticipants[0];
      const userName = user.fullName;
      const userID = user.userFbId;

      // Avatar URL
      const avatarUrl = `https://graph.facebook.com/${userID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // Random backgrounds
      const backgrounds = [
        "https://files.catbox.moe/cj68oa.jpg",
        "https://files.catbox.moe/0n8mmb.jpg",
        "https://files.catbox.moe/hvynlb.jpg",
        "https://files.catbox.moe/leyeuq.jpg",
        "https://files.catbox.moe/7ufcfb.jpg",
        "https://files.catbox.moe/y78bmv.jpg"
      ];
      const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      // Canvas
      const canvas = createCanvas(1000, 500);
      const ctx = canvas.getContext("2d");

      // Background
      const bg = await loadImage((await axios.get(randomBg, { responseType: "arraybuffer" })).data);
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // Avatar circle
      let avatar;
      try {
        const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        avatar = await loadImage(response.data);
      } catch {
        avatar = await loadImage("https://i.ibb.co/2kR9xgQ/default-avatar.png");
      }

      const avatarSize = 200;
      const avatarX = canvas.width / 2 - avatarSize / 2;
      const avatarY = 40;

      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      // Text
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 6;

      ctx.font = "bold 55px ModernoirBold";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(userName, canvas.width / 2, 310);

      ctx.font = "bold 35px ModernoirBold";
      ctx.fillStyle = "#ffea00";
      ctx.fillText(threadName.toUpperCase(), canvas.width / 2, 370);

      ctx.font = "bold 30px ModernoirBold";
      ctx.fillStyle = "#00ffcc";
      ctx.fillText(`You're the ${memberCount}th member on this group`, canvas.width / 2, 420);

      // Save image
      const imgPath = path.join(__dirname, "cache", `welcome_${userID}.png`);
      await fs.ensureDir(path.dirname(imgPath));
      const out = fs.createWriteStream(imgPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      await new Promise(resolve => out.on("finish", resolve));

      // Send welcome
      message.send(
        {
          body: `Hello ${userName}, welcome to ${threadName} 🎉\nYou're the ${memberCount} member 🎊`,
          attachment: fs.createReadStream(imgPath)
        },
        () => fs.unlinkSync(imgPath)
      );

    } catch (err) {
      console.error("❌ Welcome event error:", err);
    }
  }
};registerFont(path.join(fontDir, "BeVietnamPro-Regular.ttf"), {
    family: 'BeVietnamPro',
    weight: 'normal'
});

registerFont(path.join(fontDir, "Kanit-SemiBoldItalic.ttf"), {
    family: 'Kanit',
    weight: '600',
    style: 'italic'
});

registerFont(path.join(canvasFontDir, "Rounded.otf"), {
    family: 'Rounded'
});

async function createWelcomeCanvas(gcImg, img1, img2, userName, userNumber, threadName, potato) {
    const width = 1200;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    for (let i = -height; i < width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
    }
    const lightGradient = ctx.createLinearGradient(0, 0, width, height);
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
    lightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height);
    const squares = [{
        x: 50,
        y: 50,
        size: 80,
        rotation: 15
    },
        {
            x: 1100,
            y: 80,
            size: 60,
            rotation: -20
        },
        {
            x: 150,
            y: 500,
            size: 50,
            rotation: 30
        },
        {
            x: 1050,
            y: 480,
            size: 70,
            rotation: -15
        },
        {
            x: 900,
            y: 30,
            size: 40,
            rotation: 45
        },
        {
            x: 200,
            y: 150,
            size: 35,
            rotation: -30
        },
        {
            x: 400,
            y: 80,
            size: 45,
            rotation: 60
        },
        {
            x: 700,
            y: 520,
            size: 55,
            rotation: -40
        },
        {
            x: 950,
            y: 250,
            size: 38,
            rotation: 25
        },
        {
            x: 300,
            y: 350,
            size: 42,
            rotation: -50
        }];

    squares.forEach(sq => {
        ctx.save();
        ctx.translate(sq.x + sq.size / 2, sq.y + sq.size / 2);
        ctx.rotate((sq.rotation * Math.PI) / 180);

        const sqGradient = ctx.createLinearGradient(-sq.size / 2, -sq.size / 2, sq.size / 2, sq.size / 2);
        sqGradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
        sqGradient.addColorStop(1, 'rgba(22, 163, 74, 0.1)');

        ctx.fillStyle = sqGradient;
        ctx.fillRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);

        ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);

        ctx.restore();
    });
    const circles = [{
        x: 250,
        y: 250,
        radius: 30,
        alpha: 0.15
    },
        {
            x: 850,
            y: 150,
            radius: 25,
            alpha: 0.12
        },
        {
            x: 600,
            y: 50,
            radius: 20,
            alpha: 0.1
        },
        {
            x: 100,
            y: 350,
            radius: 35,
            alpha: 0.18
        },
        {
            x: 1000,
            y: 380,
            radius: 28,
            alpha: 0.14
        },
        {
            x: 450,
            y: 480,
            radius: 22,
            alpha: 0.11
        }];

    circles.forEach(circ => {
        ctx.beginPath();
        ctx.arc(circ.x, circ.y, circ.radius, 0, Math.PI * 2);
        const circGradient = ctx.createRadialGradient(circ.x, circ.y, 0, circ.x, circ.y, circ.radius);
        circGradient.addColorStop(0, `rgba(34, 197, 94, ${circ.alpha})`);
        circGradient.addColorStop(1, 'rgba(22, 163, 74, 0)');
        ctx.fillStyle = circGradient;
        ctx.fill();

        ctx.strokeStyle = `rgba(34, 197, 94, ${circ.alpha * 2})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    });
    const triangles = [{
        x: 550,
        y: 150,
        size: 40,
        rotation: 0
    },
        {
            x: 180,
            y: 420,
            size: 35,
            rotation: 180
        },
        {
            x: 1080,
            y: 320,
            size: 38,
            rotation: 90
        },
        {
            x: 380,
            y: 200,
            size: 32,
            rotation: -45
        }];

    triangles.forEach(tri => {
        ctx.save();
        ctx.translate(tri.x, tri.y);
        ctx.rotate((tri.rotation * Math.PI) / 180);

        ctx.beginPath();
        ctx.moveTo(0, -tri.size / 2);
        ctx.lineTo(-tri.size / 2, tri.size / 2);
        ctx.lineTo(tri.size / 2, tri.size / 2);
        ctx.closePath();

        const triGradient = ctx.createLinearGradient(-tri.size / 2, 0, tri.size / 2, 0);
        triGradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
        triGradient.addColorStop(1, 'rgba(22, 163, 74, 0.1)');
        ctx.fillStyle = triGradient;
        ctx.fill();

        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    });

    async function drawCircularImage(imageSrc, x, y, radius, borderColor, borderWidth = 5) {
        try {
            const image = await loadImage(imageSrc);
            ctx.shadowColor = borderColor;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(x, y, radius + borderWidth, 0, Math.PI * 2);
            ctx.fillStyle = borderColor;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(x, y, radius + borderWidth, 0, Math.PI * 2);
            ctx.fillStyle = borderColor;
            ctx.fill();
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(image, x - radius, y - radius, radius * 2, radius * 2);
            ctx.restore();
        } catch (err) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#1f1f1f';
            ctx.fill();
        }
    }
    
    await drawCircularImage(img2, width - 120, 100, 55, '#22c55e');
    ctx.font = 'bold 20px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'right';
    ctx.fillText('Added by ' + potato, width - 190, 105);
    await drawCircularImage(img1, 120, height - 100, 55, '#16a34a');
    ctx.font = 'bold 24px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(userName, 190, height - 95);
    await drawCircularImage(gcImg, width / 2, 200, 90, '#22c55e', 6);
    ctx.font = '600 42px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(threadName, width / 2, 335);
    ctx.font = 'italic 600 56px "Kanit", "NotoSans", sans-serif';
    const nameGradient = ctx.createLinearGradient(width / 2 - 200, 0, width / 2 + 200, 0);
    nameGradient.addColorStop(0, '#4ade80');
    nameGradient.addColorStop(1, '#22c55e');
    ctx.fillStyle = nameGradient;
    ctx.fillText('WELCOME', width / 2, 410);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, 430);
    ctx.lineTo(width / 2 + 180, 430);
    ctx.stroke();
    ctx.font = '600 26px "NotoSans", "BeVietnamPro", sans-serif';
    ctx.fillStyle = '#a0a0a0';
    ctx.textAlign = 'center';
    ctx.fillText(`You are the ${userNumber}th member`, width / 2, 480);

    return canvas.createPNGStream();
}

module.exports = {
    config: {
        name: "welcome",
        version: "1.3",
        author: "Neoaz ゐ",//Adapted from @procoder Allou Mohammed
        category: "events"
    },

    onStart: async ({
        threadsData, event, message, usersData
    }) => {
        const type = "log:subscribe";
        if (event.logMessageType != type) return;
        
        try {
            await threadsData.refreshInfo(event.threadID);
            const threadsInfo = await threadsData.get(event.threadID);
            const gcImg = threadsInfo.imageSrc;
            const threadName = threadsInfo.threadName;
            const joined = event.logMessageData.addedParticipants[0].userFbId;
            const by = event.author;
            const img1 = await usersData.getAvatarUrl(joined);
            const img2 = await usersData.getAvatarUrl(by);
            const usernumber = threadsInfo.members?.length || 1;
            const userName = event.logMessageData.addedParticipants[0].fullName;
            const authorN = await usersData.getName(by);
            
            const welcomeImage = await createWelcomeCanvas(gcImg, img1, img2, userName, usernumber, threadName, authorN);
            
            const imagePath = path.join(__dirname, '../cmds/', global.utils.randomString(4) + ".png");
            const writeStream = fs.createWriteStream(imagePath);
            welcomeImage.pipe(writeStream);
            
            await new Promise((resolve) => {
                writeStream.on('finish', resolve);
            });

            await message.send({
                attachment: fs.createReadStream(imagePath)
            });
            
            fs.unlinkSync(imagePath);
        } catch (error) {
            console.error("[WELCOME] Error:", error.message);
            console.error(error.stack);
        }
    }
};
