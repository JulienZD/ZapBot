const { UserCmdCount } = require('../ZapBot/sql');

module.exports = {
	name: 'usage',
	description: 'Displays the amount of times a command has been used.',
	cooldown: 5,
	async execute(message, args) {
		let userCommandUsageEntries = await UserCmdCount.findAll({
			attributes: ['amount'],
			where: { userId: message.author.id } 
		});
		if (!userCommandUsageEntries) {
			return message.reply('You don\'t have a count!');
		}
		let totalAmount = -1; // account for this command call
		for (const entry of userCommandUsageEntries) {
			totalAmount += entry.amount;
		}

		message.reply(`you have used a total of ${totalAmount} commands.`);
	},
};