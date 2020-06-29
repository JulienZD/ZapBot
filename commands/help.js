const { prefix: PREFIX, defaultCooldown: DEFAULT_COOLDOWN } = require('../config.json');
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
		let { commands } = message.client;
		let name = args[0].toLowerCase();
		let command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		sendCommandHelp(message, command);
	},
};

function sendCommandHelp(message, command) {
	if (!command) {
		return message.reply('that\'s not a valid command.');
	}
	let commandEmbed = new Discord.MessageEmbed()
		.setColor('#ffffff')
		// Bot icon
		.setThumbnail('https://i.imgur.com/beKuLLM.png')
		.setTitle(`Command: \`${command.name}\``);

	if (command.description) commandEmbed.addField('Description', command.description);
	if (command.aliases) commandEmbed.addField('Aliases', command.aliases.join(', '));

	let usageString = `\`${PREFIX}${command.name}`;
	if (command.usage) usageString += ` ${command.usage}`;
	usageString += '`';

	commandEmbed.addField('Usage', usageString);
	commandEmbed.addField('Cooldown', `${command.cooldown || DEFAULT_COOLDOWN} second(s)`);

	message.channel.send(commandEmbed);
}

function sendAllCommandsHelp(message) {
	let { commands } = message.client;
	let embed = new Discord.MessageEmbed()
		.setTitle('Commands')
		.setThumbnail('https://i.imgur.com/beKuLLM.png');

	embed.setDescription(commands.map(command => `${PREFIX}${command.name}: ${command.description || ''}`).join('\n'));
	embed.setFooter(`You can send \`${PREFIX}help [command name]\` to get info on a specific command!`);

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