module.exports = {
  config: {
    name: "hot",
    version: "7.1",
    author: "Alihsan Shourov",
    countDown: 15,
    role: 0,
    shortDescription: "all video",
    longDescription: "",
    category: "video",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const videos = [
      "https://i.imgur.com/aQVa9EL.mp4",
      "https://i.imgur.com/wzR3OP7.mp4",
      "https://i.imgur.com/AaPoSEo.mp4",
      "https://i.imgur.com/zeqzgYJ.mp4",
      "https://i.imgur.com/tfePTdM.mp4",
      "https://i.imgur.com/FVtCcS4.mp4",
      "https://i.imgur.com/MwiTEUL.mp4",
      "https://i.imgur.com/ka0pxxO.mp4",
      "https://i.imgur.com/oBcryzJ.mp4",
      "https://i.imgur.com/vfYOmHS.mp4",
      "https://i.imgur.com/HOSrfId.mp4",
      "https://i.imgur.com/xIi5ZjB.mp4",
      "https://i.imgur.com/6vGHjRM.mp4",
      "https://i.imgur.com/08yfKpb.mp4",
      "https://i.imgur.com/deSrgBg.mp4",
      "https://i.imgur.com/vLcyKJ2.mp4",
      "https://i.imgur.com/uVBK5gc.mp4",
      "https://i.imgur.com/bFd7QRW.mp4",
      "https://i.imgur.com/yIViust.mp4",
      "https://i.imgur.com/GTxZZfN.mp4",
      "https://i.imgur.com/Nu5DcgN.mp4",
      "https://i.imgur.com/zSse6lu.mp4"
    ];

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    api.sendMessage({
      body:
        " লুচ্চা নে দিলাম\n" +
        "uffs💋\n\n" +
        "uffs jal💋🥵" +
        "Video credit : Alihsan Shourov",
      attachment: await global.utils.getStreamFromURL(randomVideo)
    }, event.threadID, event.messageID);
  }
};