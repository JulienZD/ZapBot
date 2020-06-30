require('./libs/log-timestamps').init();
require('dotenv').config();
const { init } = require('./ZapBot/setup');

const Discord = require('discord.js');
const client = new Discord.Client();
client.config = require('./config.json');

main();

function main() {
	init(client);

	client.on('ready', require('./events/ready').bind(null, client));
	client.on('message', require('./events/message').bind(null, client));
	client.login(process.env.DISCORD_BOT_TOKEN);
}
