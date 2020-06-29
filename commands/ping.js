module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(message) {
		let createdAt = message.createdAt;
		let now = Date.now();
		message.channel.send(`:ping_pong: Pong! \nResponse time: _${now - createdAt}ms_`);
	},
};