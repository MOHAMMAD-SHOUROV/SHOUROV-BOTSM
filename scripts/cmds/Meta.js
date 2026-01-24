const axios = require('axios');

const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports.config = {
  name: "meta",
  version: "0.0.1",
  role: 0,
  author: "ArYAN",
  description: "Meta AI",
  category: "general",
  cooldowns: 2,
  hasPrefix: false,
};

module.exports.onStart = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  
  let e;
  try {
    const configRes = await axios.get(nix);
    e = configRes.data && configRes.data.api;
    if (!e) throw new Error("Configuration Error: Missing API in GitHub JSON.");
  } catch (error) {
    return api.sendMessage("❌ Failed to fetch API configuration from GitHub.", threadID, messageID);
  }

  const question = args.join(' ').trim();

  if (!question) {
    return api.sendMessage("⚠️ Please provide your question.", threadID, messageID);
  }

  try {
    const response = await axios.get(`${e}/meta-ai?query=${encodeURIComponent(question)}`);

    const metaAnswer = response.data?.data; 

    if (metaAnswer) {
      return api.sendMessage(metaAnswer, threadID, messageID);
    } 
    else {
      return api.sendMessage("[⚜️]➜ Something went wrong. ", threadID, messageID);
    }
  } catch (error) {
    console.error('Meta API Error:', error.response ? error.response.data : error.message);
    return api.sendMessage("[⚜️]➜ Failed to get a response from Meta AI.", threadID, messageID);
  }
};
