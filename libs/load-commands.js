const fs = require('fs');

function load(dir, commands) {
	let commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
	for (let file of commandFiles) {
		delete require.cache[require.resolve(`../${dir}/${file}`)];
		let newCommand = require(`../${dir}/${file}`);
		commands.set(newCommand.name, newCommand);
	}
}

module.exports.load = load;