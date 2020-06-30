module.exports = {
	name: 'reloadconfig',
	aliases: ['rlc'],
	description: 'Reloads the configuration file',
	creatorOnly: true,
	execute(message) {
		try {
			reloadConfig(message.client);
		}
		catch (error) {
			console.log(error);
			return message.channel.send('An error occurred while reloading the config file');
		}

		console.log(`Reloaded config file - ${message.author.tag}`);
		message.channel.send('Reloaded config.');
	},
};

function reloadConfig(client) {
	let configPath = '../config.json';
	delete require.cache[require.resolve(configPath)];
	client.config = require(configPath);
}