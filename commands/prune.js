module.exports = {
	name: 'prune',
	description: 'Delete an amount of messages in the current channel',
	aliases: ['del', 'delete'],
	cooldown: 10,
	args: true,
	usage: '<amount>',
	execute(message, args) {
		message.channel.send('prune');
	},
};
