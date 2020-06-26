const math = require('mathjs');

module.exports = {
	name: 'calculate',
	description: 'Calculates the given expression(s)',
	args: true,
	execute(message, args) {
		const calculations = {};
		let msg = '';

		for (let i = 0; i < args.length; i++) {
			const expression = args[i];
			let result;
			try {
				result = math.evaluate(expression);
			}
			catch (error) {
				continue;
			}
			const calculation = { 'expression': expression, 'result': result };
			calculations[i + 1] = calculation;
		}

		for (const [num, calc] of Object.entries(calculations)) {
			const expr = calc['expression'];
			const result = calc['result'];
			msg += `Calculation ${num}: ${expr} = ${result}\n`;
		}

		if (!msg) return this.invalid(message);
		message.channel.send(msg);
	},
	invalid(message) {
		message.reply('Incorrect usage of command. Provide at least one arithmetic expression.');
	},
};
