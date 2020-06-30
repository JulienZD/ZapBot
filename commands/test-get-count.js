module.exports = {
	name: 'test get count',
	description: 'Displays the value of the counter linked to your account in the database',
	aliases: ['gc'],
	cooldown: 1,
	execute(message) {
		let amount = 0;
		message.channel.send(`Your counter is at ${amount}!`);
	},
};