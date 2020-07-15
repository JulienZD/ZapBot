const Discord = require('discord.js');
const db = require('../ZapBot/sql')

let client;

async function init(theClient) {
	await db.sync();
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

module.exports.init = init;
