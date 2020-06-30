require('./libs/log-timestamps').init();
require('dotenv').config();
const { init, initZapBot } = require('./ZapBot/setup');

const { status: STATUS } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

main();

function main() {
	init(client);

	client.on('ready', require('./events/ready').bind(null, client));
	client.on('message', require('./events/message').bind(null, client));
	client.login(process.env.DISCORD_BOT_TOKEN);
}

