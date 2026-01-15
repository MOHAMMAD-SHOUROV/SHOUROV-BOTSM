module.exports = {
 config: {
 name: "gif",
 version: "1.0",
 author: "Chitron Bhattacharjee",
 countDown: 10,
 role: 0,
 shortDescription: {
 en: "Search for GIFs"
 },
 longDescription: {
 en: "Search and send random GIFs based on keywords"
 },
 category: "fun",
 guide: {
 en: "{pn} [keyword] - Example: {pn} hugging"
 }
 },

 langs: {
 en: {
 searching: "╔═══❖•°•°•°❖═══╗\n 𝐒𝐡𝐢𝐏𝐮 𝐀𝐢 ✨\n 🔎 %1 gif\n╚═══❖•°•°•°❖═══╝"
 }
 },

 onStart: async function ({ api, event, args, message, getLang }) {
 const axios = require('axios');
 const keyword = args.join(" ");
 
 if (!keyword) {
 return message.reply("Please enter a keyword to search for GIFs. Example: +gif hugging");
 }

 try {
 // Show searching message
 message.reply(getLang("searching", keyword));
 
 // Search for GIFs using Giphy API
 const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
 params: {
 api_key: 'wBUEVK7mbqAaiCBRrYKYyEMMqZ1sPujI',
 q: keyword,
 limit: 25,
 offset: 0,
 rating: 'g',
 lang: 'en',
 bundle: 'messaging_non_clips'
 }
 });

 const gifs = response.data.data;
 
 if (gifs.length === 0) {
 return message.reply(`No GIFs found for "${keyword}"`);
 }

 // Select a random GIF from the results
 const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
 const gifUrl = randomGif.images.original.url;

 // Send the GIF as an attachment
 return message.reply({
 attachment: await global.utils.getStreamFromURL(gifUrl)
 });
 } catch (error) {
 console.error(error);
 return message.reply("Sorry, an error occurred while searching for GIFs.");
 }
 }
};    const authorName = res.data.author.name;

    const fullMessage = `❥┈•${title}\n\nAuthor: ${authorName}....`;

    const imgPath = path.join(__dirname, "cache", `gf.jpg`);
    const imgRes = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(imgRes.data, "binary"));

    api.sendMessage({
      body: fullMessage,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage("error fetching data.", event.threadID, event.messageID);
  }
}
