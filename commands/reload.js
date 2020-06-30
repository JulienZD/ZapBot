const loadCommands = require('../libs/load-commands');

module.exports = {
	name: 'reload',
	aliases: ['rl'],
	description: 'Reloads all commands',
	creatorOnly: true,
	execute(message) {
		try {
			loadCommands.load('./commands', message.client.commands);
		}
		catch (error) {
			console.log(error);
			return message.channel.send('An error occurred while reloading all the commands.');
		}
		console.log(`Reloaded all commands - ${message.author.tag}`);
		message.channel.send('Reloaded all commands.');
	},
};