const { Count } = require('../ZapBot/sql');

module.exports = {
	name: 'test get count',
	description: 'Displays the value of the counter linked to your account in the database',
	aliases: ['gc'],
	cooldown: 1,
	async execute(message) {
		let countEntry = await Count.findOne({ where: { userId: message.author.id } });
		if (!countEntry) {
			return message.reply('You don\'t have a count!');
		}
		
		message.channel.send(`Your count is at ${countEntry.amount}`);
	},
};