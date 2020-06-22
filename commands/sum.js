module.exports = {
	name: 'sum',
	description: 'Sums two integers and returns the result',
	execute(message, args) {
		if (invalidArgs(args)) return this.invalid(message);

		let result = 0;
		let sumNumbers = '';

		for (let i = 0; i < args.length; i++) {
			sumNumbers += args[i];
			if (i !== args.length - 1) {
				sumNumbers += ' + ';
			}
			result += parseInt(args[i]);
		}

		message.channel.send(`${sumNumbers} = ${result}`);
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