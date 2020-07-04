module.exports = {
	name: 'ping',
	description: 'Pong!',
	aliases: ['p'],
	cooldown: 5,
	execute(message) {
		message.channel.send('Pong!')
			.then(msg => {
				let ping = msg.createdAt - message.createdAt;
				msg.edit(`${msg.content}\nResponse time: _${ping}ms_`);
				msg.react('🏓');
			});
	},
};