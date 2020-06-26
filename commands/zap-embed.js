const ZapEmbed = require('../objects/ZapBot');

module.exports = {
	name: 'zap-embed',
	aliases: ['zembed'],
	creatorOnly: true,
	execute(message) {
		const embed = new ZapEmbed.ZapMessageEmbed(message.client);
		for (let i = 1; i <= 10; i++) {
			embed.addField(`FieldName${i}`, `FieldValue${i}`);
		}
		embed.addFields([
			{
				name: 'addFields1',
				value: 'value1',
			},
			{
				name: 'addFields2',
				value: 'value2',
			},
		]);
		message.channel.send(embed);
	},
};