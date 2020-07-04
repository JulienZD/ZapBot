const { Count } = require('../ZapBot/sql');

module.exports = {
	name: 'test count',
	description: 'Adds 1 to a counter linked to your account in the database',
	aliases: ['tc'],
	cooldown: 1,
	async execute(message) {
		let countEntry = await Count.findOne({ where: { userId: message.author.id } });
		if (!countEntry) {
			try {
				countEntry = await Count.create({
					userId: message.author.id,
				});
			}
			catch (err) {
				console.log(err);
				return message.reply('Something went horribly wrong.');
			}
		}
		countEntry.amount = countEntry.amount + 1;
		await countEntry.save();
	
		message.react('✅');
	},
};