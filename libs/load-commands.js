const fs = require('fs');
const { Command: CommandTable } = require('../ZapBot/sql');

async function load(dir, commands) {
	let commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
	const CommandsInDB = await CommandTable.findAll({
		attributes: ['name']
	});
	
	for (let file of commandFiles) {
		delete require.cache[require.resolve(`../${dir}/${file}`)];
		let newCommand = require(`../${dir}/${file}`);
		let commandName = newCommand.name;
		if (notInDB(commandName, CommandsInDB)) {
			await CommandTable.create({ name: commandName })
			.then(() => console.log(`${commandName} was added to the Command table.`));
		}
		commands.set(commandName, newCommand);
	}
}

function notInDB(commandName, CommandsInDB) {
	return CommandsInDB.every(command => command.name != commandName);
}

module.exports.load = load;