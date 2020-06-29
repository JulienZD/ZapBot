require('./libs/log-timestamps.js').init();
require('dotenv').config();

const { creatorId: CREATOR_ID, prefix: PREFIX, status: STATUS, defaultCooldown: DEFAULT_COOLDOWN } = require('./config.json');
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const Discord = require('discord.js');

const CLIENT = new Discord.Client();
CLIENT.commands = new Discord.Collection();
require('./libs/load-commands.js').load('./commands', CLIENT.commands);

const COOLDOWNS = new Discord.Collection();

CLIENT.on('ready', () => {
	console.log(`Logged in as ${CLIENT.user.tag}`);

	CLIENT.user.setActivity(STATUS, { type: 'LISTENING' })
		.then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
		.catch(console.error);
	initZapBot();
});

async function initZapBot() {
	const ZapBot = require('./objects/ZapBot');
	const mgr = new Discord.UserManager(CLIENT);
	const user = await mgr.fetch(CREATOR_ID);
	ZapBot.ZapMessageEmbed.creditField.value = `_ZapBot created by ${user.toString()}_`;
	console.log('ZapBot initialized');
}

CLIENT.on('message', message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = CLIENT.commands.get(commandName)
		|| CLIENT.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

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

	const now = Date.now();
	const timestamps = COOLDOWNS.get(command.name);
	const cooldownAmount = (command.cooldown || DEFAULT_COOLDOWN) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
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

CLIENT.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

CLIENT.login(TOKEN);
