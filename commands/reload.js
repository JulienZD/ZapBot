const loadCommands = require('../libs/load-commands.js');

module.exports = {
	name: 'reload',
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
		console.log('Reloaded all commands');
		message.channel.send('Reloaded all commands.');
	},
};