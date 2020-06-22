module.exports = {
	name: 'sum',
	description: 'Sums two integers and returns the result',
	execute(message, args) {
		let result = 0;
		const numbers = [];
		if (!args.length) return this.invalid(message);
		for (const arg of args) {
			if (isNaN(arg)) return this.invalid(message);
			numbers.push(arg);
			result += parseInt(arg);
		}
		let msg = '';
		for (let i = 0; i < numbers.length; i++) {
			msg += numbers[i];
			if (i !== numbers.length - 1) {
				msg += ' + ';
			}
		}
		msg += ` = ${result}`;
		message.channel.send(msg);
	},
	invalid(message) {
		message.reply('Invalid arguments');
	},
};