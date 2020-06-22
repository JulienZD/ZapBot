const dotenv = require('dotenv');
dotenv.config();
const { prefix, status } = require('./config.json');
const token = process.env.DISCORD_BOT_TOKEN;
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);

	client.user.setActivity(status, { type: 'LISTENING' })
		.then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
		.catch(console.error);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	if (command === 'ping') {
		message.channel.send('pongf');

	}
	if (command === 'rosh') {
		setTimeout(function() {
			message.channel.send('is great');
		}, 5000);
	}

	if (command === 'args-info') {
		if (!args.length) {
			return message.channel.send('yeet!');
		}
		message.channel.send(`Command name: ${command}\nArguments: ${args}`);
	}
});


client.login(token);
