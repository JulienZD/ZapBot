const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all commands or info about a specific command.',
	aliases: ['commands', '?'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if(!args.length) {
			data.push('Here\'s a list of all commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with a list of commands.');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('unable to send a DM. Are your DMs disabled?');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command.');
		}

		const commandEmbed = new Discord.MessageEmbed()
			.setColor('#ffffff')
			.setThumbnail('https://i.imgur.com/beKuLLM.png')
			.setTitle(`Command: \`${prefix}${command.name}\``);

		if (command.description) commandEmbed.addField('Description', command.description);
		if (command.aliases) commandEmbed.addField('Aliases', command.aliases.join(', '));
		if (command.usage) commandEmbed.addField('Usage', `\`${prefix}${command.name} ${command.usage}\``);

		commandEmbed.addField('Cooldown', `${command.cooldown || 3} second(s)`);

		message.channel.send(commandEmbed);
	},
};