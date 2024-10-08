const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "fbcoverv5",
    version: "1.0.0",
    role: 0,
    credits: "churchillitos",
    description: "Generate Facebook cover photo v2",
    hasPrefix: false,
    aliases: ["fbcoverv5"],
    usage: "[fbcoverv5 name | birthday | love | location | hometown | follow | gender]",
    cooldown: 5
};

module.exports.run = async function({ api, event, args }) {
    try {
        const input = args.join(" ");
        const [name, birthday, love, location, hometown, follow, gender] = input.split(" | ");

        if (!name || !birthday || !love || !location || !hometown || !follow || !gender) {
            return api.sendMessage(" usage: fbcoverv5 name | birthday | love | location | hometown | follow | gender",event.threadID);
        }

        const userProfileUrl = `https://graph.facebook.com/${event.senderID}/picture?type=large`;
        const profilePicPath = path.join(__dirname, "profilePic.jpg");

        const profilePicResponse = await axios({
            url: userProfileUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(profilePicPath);
        profilePicResponse.data.pipe(writer);

        writer.on('finish', async () => {
            const apiUrl = `https://ggwp-yyxy.onrender.com/canvas/fbcoverv3?name=${encodeURIComponent(name)}&birthday=${encodeURIComponent(birthday)}&love=${encodeURIComponent(love)}&location=${encodeURIComponent(hometown)}&hometown=${encodeURIComponent(location)}&follow=${encodeURIComponent(follow)}&gender=${encodeURIComponent(gender)}&uid=${event.senderID}`;

            api.sendMessage("Generating Facebook cover photo, please wait...", event.threadID);

            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
            const coverPhotoPath = path.join(__dirname, "fbCover.jpg");

            fs.writeFileSync(coverPhotoPath, response.data);

            api.sendMessage({
                body: "Here is your customized Facebook cover photo:",
                attachment: fs.createReadStream(coverPhotoPath)
            }, event.threadID, () => {
                fs.unlinkSync(profilePicPath);
                fs.unlinkSync(coverPhotoPath);
            });
        });

        writer.on('error', (err) => {
            console.error('Stream writer error:', err);
            api.sendMessage("An error occurred while processing the request.", event.threadID);
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
