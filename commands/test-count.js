module.exports = {
	name: 'test count',
	description: 'Adds 1 to a counter linked to your account in the database',
	aliases: ['tc'],
	cooldown: 1,
	execute(message) {
		message.channel.send('Done!')
			.then(msg => msg.react('✅'));
	},
};