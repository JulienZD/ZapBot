module.exports = {
	name: 'sum',
	description: 'Sums two integers and returns the result',
	execute(message, args) {
		let result = 0;
		const numbers = [];
		if (invalidArgs(args)) return this.invalid(message);
		for (const arg of args) {
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
		message.reply('Incorrect usage of command. Provide at least two numbers separated by spaces.');
	},
};

function invalidArgs(args) {
	if (args.length < 2) return true;
	for (const arg of args) {
		if (isNaN(arg)) return true;
	}
}