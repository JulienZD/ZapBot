const { UserCmdCount } = require('../ZapBot/sql');

module.exports = {
	name: 'usage',
	description: 'Displays the amount of times commands have been used.',
	cooldown: 5,
	usage: '[@user] [command]',
	async execute(message, args) {
		let command;

		if (!message.mentions.users.size) {
			if (!args.length) return sendTotalUserCommandUsages(message);

			command = getCommand(message.client, args[0]);
			if (!command) return message.reply('that command doesn\'t exist!');
			
			let entries = await getUserEntries(message.author.id, command.name);

			let amount = getTotalAmount(entries);

			return message.reply(`you have used \`${command.name}\` ${amount} times.`);
		}
		else {
			let requestedUser = message.mentions.users.first();
			
			if (args.length == 1) return sendTotalCommandUsagesFor(message, requestedUser);

			// Needs more validation. '!usage help @user' results in command doesn't exist
			command = getCommand(message.client, args[1]);
			if (!command) return message.reply('that command doesn\'t exist!');

			let entries = await getUserEntries(requestedUser.id, command.name);

			let amount = getTotalAmount(entries);

			return message.channel.send(`${requestedUser} has used \`${command.name}\` ${amount} times.`)
		}
	},
};

function getCommand(client, name) {
	return client.commands.get(name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));
}

async function sendTotalCommandUsagesFor(message, user) {
	let commandUsageEntries = await getUserEntries(user.id);
			
	let amount = getTotalAmount(commandUsageEntries);
	if (!amount) return message.reply('I don\'t have any info on that user.');

	return message.channel.send(`${user} has used ${amount} commands.`);
}

async function sendTotalUserCommandUsages(message) {
	let userCommandUsageEntries = await getUserEntries(message.author.id);
	if (!userCommandUsageEntries) {
		return message.reply('You don\'t have a count!');
	}
	let amount = getTotalAmount(userCommandUsageEntries);

	return message.reply(`you have used a total of ${amount} commands.`);
}

function getTotalAmount(entries) {
	let total = 0;
	for (const entry of entries) {
		total += entry.amount;
	}
	return total;
}

async function getUserEntries(id, command) {
	let filter = {
		userId: id,
	}
	if (command) {
		filter.commandName = command;
	}

	return await UserCmdCount.findAll({
		attributes: ['amount'],
		where: filter
	});
}