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

module.exports.init = init;
