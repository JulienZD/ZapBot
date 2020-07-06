module.exports = {
	name: 'weather',
	description: 'Displays the weather in any city',
	aliases: ['w'],
	cooldown: 5,
	execute(message) {
		let temp = 15.76;
		let city = 'The Hague';
		
		message.channel.send(`The temperature in ${city} is ${temp}.`);
	},
};