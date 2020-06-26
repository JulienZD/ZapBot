const Discord = require('discord.js');
const { creatorId, iconURL } = require('../config.json');

class ZapMessageEmbed extends Discord.MessageEmbed {
	static creditField = {
		name: '\u200b',
		// Fallback to creatorId if initialization in index.js fails
		value: `_ZapBot created by @${creatorId}_`,
	}
	constructor() {
		super();
		super.setThumbnail(iconURL)
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
		const data = this.fields;
		data.push(data.splice(data.findIndex(f => f.value === ZapMessageEmbed.creditField.value), 1)[0]);
	}
}

module.exports.ZapMessageEmbed = ZapMessageEmbed;