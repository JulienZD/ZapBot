module.exports = {
	name: 'calculate',
	description: 'todo',
	execute(message, args) {
		if (this.checkInvalid(args)) return;

		let result = 0;
		let sumNumbers = '';

		for (let i = 0; i < args.length; i++) {
			const number = args[i];
			sumNumbers += number;
			if (i !== args.length - 1) {
				sumNumbers += ' + ';
			}
			result += parseInt(number);
		}

		message.channel.send(`${sumNumbers} = ${result}`);
	},
	invalid(message) {
		message.reply('Incorrect usage of command. Provide at least two numbers separated by spaces.');
	},
	checkInvalid(args) {
		if (this.insufficientArgs(args)) return true;
		if (!this.isOperator(args[0])) return true;
		if (this.isAllNumbers(args)) return true;
		return false;
	},
	insufficientArgs(args) {
		return args.length < 3;
	},
	isOperator(arg) {
		return /[*/+-]/.test(arg);
	},
	isAllNumbers(args) {
		for (const arg of args) {
			if (isNaN(arg)) return false;
		}
		return true;
	},
};
