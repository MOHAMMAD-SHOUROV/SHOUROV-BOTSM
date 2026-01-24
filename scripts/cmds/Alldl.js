const fs = require("fs-extra");
const axios = require("axios");


module.exports = {
  config: {
    name: "alldl",
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    shortDescription: "Auto video downloader",
    category: "media"
  },

  onStart: async function ({ api, event }) {
    return api.sendMessage("✅ AutoLink is active", event.threadID);
  },

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    const message = event.body;

    if (!message) return;

    const L = message.match(/(https?:\/\/[^\s]+)/);
    if (!L) return;

    const url = L[0];
    
    try {
    	const noobcore = "aryan";
        const nix = "autodl";
        const gok = "-";
        const ok = ".";
        const domain = "vercel.app";
        const apiUrl = `https://${noobcore}${gok}${nix}${ok}${domain}/alldl?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);
        const resData = response.data;

        if (resData.status && resData.downloadUrl) {
            api.setMessageReaction("⏳", event.messageID, () => {}, true);
            const path = __dirname + "/cache/video.mp4";
            if (!fs.existsSync(__dirname + "/cache")) fs.mkdirSync(__dirname + "/cache");

            const writer = fs.createWriteStream(path);
            const videoStream = await axios({
                method: 'get',
                url: resData.downloadUrl,
                responseType: 'stream'
            });

            videoStream.data.pipe(writer);

            writer.on("finish", () => {
                api.setMessageReaction("✅", event.messageID, () => {}, true);
                
                let platform = "Social Media";
                if (url.includes("facebook.com") || url.includes("fb.watch")) platform = "Facebook";
                else if (url.includes("tiktok.com")) platform = "TikTok";
                else if (url.includes("instagram.com")) platform = "Instagram";
                else if (url.includes("youtube.com") || url.includes("youtu.be")) platform = "YouTube";

                api.sendMessage(
                    {
                        body: `• Title: ${resData.title}\n• Platform: ${platform}`,
                        attachment: fs.createReadStream(path)
                    },
                    threadID,
                    () => {
                        if (fs.existsSync(path)) fs.unlinkSync(path);
                    }
                );
            });

            writer.on("error", () => {
                api.setMessageReaction("❌", event.messageID, () => {}, true);
            });
        }
    } catch (err) {
    	
    }
  }
};