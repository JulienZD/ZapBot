const fs = require('fs');

function load(dir, commands) {
	const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		delete require.cache[require.resolve(`../${dir}/${file}`)];
		const newCommand = require(`../${dir}/${file}`);
		commands.set(newCommand.name, newCommand);
	}
}

module.exports.load = load;