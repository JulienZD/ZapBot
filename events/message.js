// Thanks @AnIdiotsGuide: https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/first-bot/a-basic-command-handler.md#our-first-event-message

const Discord = require('discord.js');
const cooldowns = new Discord.Collection();
let client, config, msg, command, args;

const messageIgnored = () => !msg.content.startsWith(config.prefix) || msg.author.bot;
const isCreator = author => author.id !== config.creatorId;
function getCommand(commands) {
	let commandName = args.shift().toLowerCase();
	return commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
}

function invalidArgs() {
	if (command.args && !args.length) {
		let reply = `No arguments provided for \`${command.name}\` command.`;

		if (command.usage) {
			reply += `\nUsage: \`${config.prefix}${command.name} ${command.usage}\``;
		}

		return msg.channel.send(reply);
	}
}

function creatorOnly() {
	if (command.creatorOnly && isCreator(msg.author)) return msg.reply('This command is only available to my creator.');
}

function isOnCooldown() {
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	let now = Date.now();
	let timestamps = cooldowns.get(command.name);
	let cooldownAmount = (command.cooldown || config.defaultCooldown) * 1000;

	if (timestamps.has(msg.author.id)) {
		let expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			let timeLeft = (expirationTime - now) / 1000;
			return msg.reply(`Please wait another ${timeLeft.toFixed(1)} second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
}

function permissionsMissing() {
	if (!command.permissions || msg.channel.type === 'dm') return;

	let botGuildMember = msg.guild.member(client.user);
	if (!botGuildMember.hasPermission(command.permissions))	return msg.channel.send('I don\'t have the right permissions to execute that command!');
}

module.exports = (theClient, message) => {
	client = theClient;
	config = client.config;
	msg = message;

	if (messageIgnored()) return;
	args = msg.content.slice(config.prefix.length).split(/ +/);
	command = getCommand(client.commands);

	if (!command) return;

	if (command.guildOnly) return message.channel.send(`The \`${command.name}\` command doesn't work in DMs.`);

	if (creatorOnly()) return;

	if (invalidArgs()) return;

	if (permissionsMissing()) return;

	if (isOnCooldown()) return;

	try {
		command.execute(msg, args);
	}
	catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
};
