const fs = require('fs');

module.exports = {
	name: 'reload',
	description: 'Reloads all commands',
	creatorOnly: true,
	execute(message) {
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			delete require.cache[require.resolve(`./${file}`)];
			try {
				const newCommand = require(`./${file}`);
				message.client.commands.set(newCommand.name, newCommand);
			}
			catch (error) {
				console.log(error);
				return message.channel.send('There was an error reloading the commands');
			}
		}
		console.log('Reloaded all commands');
		message.channel.send('Reloaded all commands.');
	},
};