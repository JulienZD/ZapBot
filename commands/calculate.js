const math = require('mathjs');

module.exports = {
	name: 'calculate',
	aliases: ['calc'],
	description: 'Calculates the given expression(s)',
	args: true,
	usage: '<expression1> [expression2] [expression3] ...',
	execute(message, args) {
		let calculations = {};
		let msg = '';

		for (let i = 0; i < args.length; i++) {
			let expression = args[i];
			let result;
			try {
				result = math.evaluate(expression);
			}
			catch (error) {
				continue;
			}
			let calculation = { 'expression': expression, 'result': result };
			calculations[i + 1] = calculation;
		}

		for (const [num, calc] of Object.entries(calculations)) {
			let expr = calc['expression'];
			let result = calc['result'];
			msg += `Calculation ${num}: ${expr} = ${result}\n`;
		}

		if (!msg) return this.invalid(message);
		message.channel.send(msg);
	},
	invalid(message) {
		message.reply('Incorrect usage of command. Provide at least one arithmetic expression.');
	},
};
