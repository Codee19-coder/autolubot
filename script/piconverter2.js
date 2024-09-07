const axios = require('axios');
const fs = require('fs');
const path = require('path');
 
module.exports.config = {
    name: "gen2",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Juno Delos Santos",
    description: "Generate Human Image",
    commandCategory: "AI",
    cooldowns: 5
};
 
module.exports.run = async function({ api, event, args }) {
    if (args.length === 0) {
        return api.sendMessage("Usage: /gen2 <prompt>", event.threadID, event.messageID);
    }
 
    const prompt = args.join(" ");
    const loadingMsg = `⟳ | Generating Image For "${prompt}" ...`;
    api.sendMessage(loadingMsg, event.threadID, event.messageID);
 
    try {
        const response = await axios.get(`https://hiroshi-rest-api.replit.app/image/human?prompt=${encodeURIComponent(prompt)}`);
        const imageUrl = response.data.image_url;
 
        const imageResponse = await axios({
            url: imageUrl,
            responseType: 'arraybuffer'
        });
 
        const imagePath = path.resolve(__dirname, 'temp', 'generated_image.png');
        fs.writeFileSync(imagePath, imageResponse.data);
 
        api.sendMessage({
            attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => {
            fs.unlinkSync(imagePath);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("Error generating image.", event.threadID, event.messageID);
    }
};
