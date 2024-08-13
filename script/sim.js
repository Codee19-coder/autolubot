module.exports.config = {
		name: "ken",
		version: "1.0.0",
		role: 0,
		aliases: ["kenneth"],
		credits: "jerome",
		description: "Talk to Ken",
		cooldown: 0,
		hasPrefix: false
};

module.exports.run = async function({ api, event, args }) {
		const axios = require("axios");
		let { messageID, threadID, senderID, body } = event;
		let tid = threadID,
				mid = messageID;
		const content = encodeURIComponent(args.join(" "));
		if (!args[0]) return api.sendMessage("Tanungin Mo si Ken...", tid, mid);
		try {
				const res = await axios.get(`https://simsimi-api-pro.onrender.com/sim?query=${content}`);
				const respond = res.data.respond;
				if (res.data.error) {
						api.sendMessage(`Error: ${res.data.error}`, tid, (error, info) => {
								if (error) {
										console.error(error);
								}
						}, mid);
				} else {
						api.sendMessage(respond, tid, (error, info) => {
								if (error) {
										console.error(error);
								}
						}, mid);
				}
		} catch (error) {
				console.error(error);
				api.sendMessage("An error occurred while fetching the data.", tid, mid);
		}
};
