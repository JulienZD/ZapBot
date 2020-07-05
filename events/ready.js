const { initZapBot } = require('../ZapBot/setup');
const db = require('../ZapBot/sql')

module.exports = (client, ready) => {
	initZapBot();
	db.sync();

	console.log(`Logged in as ${client.user.tag}`);

	client.user.setActivity(client.config.status, { type: 'LISTENING' })
		.then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
		.catch(console.error);
}