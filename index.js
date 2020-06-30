require('./libs/log-timestamps').init();
require('dotenv').config();
const { init, initZapBot } = require('./ZapBot/setup');

const { status: STATUS } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

main();

function main() {
	init(client);

	client.on('ready', () => startClient());
	client.login(process.env.DISCORD_BOT_TOKEN);
}

function startClient() {
	initZapBot();
	console.log(`Logged in as ${client.user.tag}`);

	client.user.setActivity(STATUS, { type: 'LISTENING' })
		.then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
		.catch(console.error);
}