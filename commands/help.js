const { prefix, defaultCooldown } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all commands or info about a specific command.',
	aliases: ['commands', '?'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		if(!args.length) {
			sendAllCommandsHelp(message);
			return;
		}
		const { commands } = message.client;
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		sendCommandHelp(message, command);
	},
};

function sendCommandHelp(message, command) {
	if (!command) {
		return message.reply('that\'s not a valid command.');
	}
	const commandEmbed = new Discord.MessageEmbed()
		.setColor('#ffffff')
		// Bot icon
		.setThumbnail('https://i.imgur.com/beKuLLM.png')
		.setTitle(`Command: \`${command.name}\``);

	if (command.description) commandEmbed.addField('Description', command.description);
	if (command.aliases) commandEmbed.addField('Aliases', command.aliases.join(', '));

	let usageString = `\`${prefix}${command.name}`;
	if (command.usage) usageString += ` ${command.usage}`;
	usageString += '`';

	commandEmbed.addField('Usage', usageString);
	commandEmbed.addField('Cooldown', `${command.cooldown || defaultCooldown} second(s)`);

	message.channel.send(commandEmbed);
}

function sendAllCommandsHelp(message) {
	const { commands } = message.client;
	const embed = new Discord.MessageEmbed()
		.setTitle('Commands')
		.setThumbnail('https://i.imgur.com/beKuLLM.png');

	embed.setDescription(commands.map(command => command.name).join('\n'));
	embed.setFooter(`You can send \`${prefix}help [command name]\` to get info on a specific command!`);

	return message.author.send(embed)
		.then(() => {
			if (message.channel.type === 'dm') return;
			message.reply('I\'ve sent you a DM with a list of commands.');
		})
		.catch(error => {
			console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
			message.reply('unable to send a DM. Are your DMs disabled?');
		});
}