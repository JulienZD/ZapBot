const Discord = require('discord.js');

let client;

function init(theClient) {
	client = theClient;
	handleErrors();
	loadCommands();
}

function handleErrors() {
	process.on('unhandledRejection', error => console.error('Unhandled promise rejection:', error));
	client.on('shardError', error => console.error('A websocket connection encountered an error:', error));
}

function loadCommands() {
	let commandLoader = require('../libs/load-commands');
	client.commands = new Discord.Collection();
	commandLoader.load('./commands', client.commands);
}

async function initZapBot() {
	const ZapMessageEmbed = require('./ZapMessageEmbed').ZapMessageEmbed;
	let mgr = new Discord.UserManager(client);
	let user = await mgr.fetch(client.config.creatorId);
	ZapMessageEmbed.creditField.value = `_ZapBot created by ${user.toString()}_`;
	console.log('ZapBot initialized');
}

module.exports.init = init;
module.exports.initZapBot = initZapBot;