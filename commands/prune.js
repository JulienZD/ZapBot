module.exports = {
	name: 'prune',
	description: 'Delete the given amount of messages in the current channel',
	aliases: ['del', 'delete'],
	cooldown: 10,
	args: true,
	usage: '<amount>',
	permissions: ['MANAGE_MESSAGES'],
	guildOnly: true,
	execute(message, args) {
		const amount = parseInt(args[0]) + 1; // Avoid pruning the sent message
		if (isNaN(amount)) return message.reply('please enter a number.');

		if (amount <= 1 || amount > 100) {
			return message.reply('I can only prune one to 99 messages at once');
		}
		
		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('there was an error trying to prune messages in this channel.');
		});
	},
};
