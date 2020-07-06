const Discord = require('discord.js');
const { creatorId: CREATOR_ID, iconURL: ICON_URL } = require('../config.json');

class ZapMessageEmbed extends Discord.MessageEmbed {
	static creditField = {
		name: '\u200b',
		// Fallback to creatorId if initialization in index.js fails
		value: `_ZapBot created by @${CREATOR_ID}_`,
	}
	constructor() {
		super();
		super.setThumbnail(ICON_URL)
			.addField(ZapMessageEmbed.creditField.name, ZapMessageEmbed.creditField.value);
	}
	addField(name, value, inline) {
		return this.addFields({ name: name, value: value, inline: inline });
	}
	addFields(...embedFields) {
		// Prevent credit field from being deleted.
		if (this.fields.length === 25) return console.log('ZapBot.addFields: Field limit reached, not adding any more fields.');

		super.addFields(...embedFields);
		this.moveCreditFieldToEnd();
		return this;
	}
	moveCreditFieldToEnd() {
		let data = this.fields;
		data.push(data.splice(data.findIndex(f => f.value === ZapMessageEmbed.creditField.value), 1)[0]);
	}
}

async function init(client) {
	let mgr = new Discord.UserManager(client);
	let creator = await mgr.fetch(client.config.creatorId);
	ZapMessageEmbed.creditField.value = `_ZapBot created by ${creator}_`;
	console.log('ZapBot initalized');
}

module.exports = {
	ZapMessageEmbed: ZapMessageEmbed,
	init: init,
}
