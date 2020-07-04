module.exports = {
	name: 'prune',
	description: 'Delete an amount of messages in the current channel',
	aliases: ['del', 'delete'],
	cooldown: 10,
	args: true,
	usage: '<amount>',
	execute(message, args) {
		const amount = parseInt(args[0] + 1); // Avoid pruning the sent message
		if (isNaN(amount)) return message.reply('please enter a number.');

		if (amount < 2 || amount > 100) {
			return message.reply('add a loop here');
		}

		message.channel.bulkDelete(amount);
	},
};
