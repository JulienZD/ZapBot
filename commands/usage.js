const { UserCmdCount } = require('../ZapBot/sql');

module.exports = {
	name: 'usage',
	description: 'Displays the amount of times a command has been used.',
	cooldown: 5,
	async execute(message) {
		if (!message.mentions.users.size) {
			let userCommandUsageEntries = await getUserEntries(message.author.id);
			if (!userCommandUsageEntries) {
				return message.reply('You don\'t have a count!');
			}
			let amount = getTotalAmount(userCommandUsageEntries);
			return message.reply(`you have used a total of ${amount} commands.`);
		}
		else {
			let requestedUser = message.mentions.users.first();
			let commandUsageEntries = await getUserEntries(requestedUser.id);
			
			let amount = getTotalAmount(commandUsageEntries);
			if (!amount) return message.reply('I don\'t have any info on that user.');
			
			return message.channel.send(`${requestedUser} has used ${amount} commands.`);
		}
	},
};

function getTotalAmount(entries) {
	let total = 0;
	for (const entry of entries) {
		total += entry.amount;
	}
	return total;
}

async function getUserEntries(id) {
	return await UserCmdCount.findAll({
		attributes: ['amount'],
		where: { userId: id } 
	});
}