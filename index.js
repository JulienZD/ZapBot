require('./libs/log-timestamps').init();
require('dotenv').config();

const { creatorId: CREATOR_ID, prefix: PREFIX, status: STATUS, defaultCooldown: DEFAULT_COOLDOWN } = require('./config.json');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
require('./libs/load-commands').load('./commands', client.commands);

const COOLDOWNS = new Discord.Collection();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);

	client.user.setActivity(STATUS, { type: 'LISTENING' })
		.then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
		.catch(console.error);
	initZapBot();
});

async function initZapBot() {
	const ZapBot = require('./objects/ZapBot');
	let mgr = new Discord.UserManager(client);
	let user = await mgr.fetch(CREATOR_ID);
	ZapBot.ZapMessageEmbed.creditField.value = `_ZapBot created by ${user.toString()}_`;
	console.log('ZapBot initialized');
}

client.on('message', message => {
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
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

client.login(process.env.DISCORD_BOT_TOKEN);
