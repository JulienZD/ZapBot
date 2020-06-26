module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(message) {
		const createdAt = message.createdAt;
		const now = Date.now();
		message.channel.send(`:ping_pong: Pong! \nResponse time: _${now - createdAt}ms_`);
	},
};