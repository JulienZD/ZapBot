require('./libs/log-timestamps.js').init();
require('dotenv').config();

const { creatorId, prefix, status, defaultCooldown } = require('./config.json');
const token = process.env.DISCORD_BOT_TOKEN;
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
require('./libs/load-commands.js').load('./commands', client.commands);

const cooldowns = new Discord.Collection();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);

	client.user.setActivity(status, { type: 'LISTENING' })
		.then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
		.catch(console.error);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.creatorOnly && message.author.id !== creatorId) return message.reply('This command is not available to you.');

	if (command.args && !args.length) {
		let reply = `No arguments provided for \`${command.name}\` command.`;

		if (command.usage) {
			reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || defaultCooldown) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
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
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

client.login(token);
