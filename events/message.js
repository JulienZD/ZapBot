// Thanks @AnIdiotsGuide: https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/first-bot/a-basic-command-handler.md#our-first-event-message

const Discord = require('discord.js');
const { prefix: PREFIX, creatorId: CREATOR_ID, defaultCooldown: DEFAULT_COOLDOWN } = require('../config.json');
const COOLDOWNS = new Discord.Collection();

module.exports = (client, message) => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;
	let args = message.content.slice(PREFIX.length).split(/ +/);
	let commandName = args.shift().toLowerCase();

	let command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.creatorOnly && message.author.id !== CREATOR_ID) return message.reply('This command is not available to you.');

	if (command.args && !args.length) {
		let reply = `No arguments provided for \`${command.name}\` command.`;

		if (command.usage) {
			reply += `\nUsage: \`${PREFIX}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!COOLDOWNS.has(command.name)) {
		COOLDOWNS.set(command.name, new Discord.Collection());
	}

	let now = Date.now();
	let timestamps = COOLDOWNS.get(command.name);
	let cooldownAmount = (command.cooldown || DEFAULT_COOLDOWN) * 1000;

	if (timestamps.has(message.author.id)) {
		let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			let timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait another ${timeLeft.toFixed(1)} second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
};