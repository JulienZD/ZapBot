const { initZapBot } = require('../ZapBot/setup');
const sql = require('../ZapBot/sql')

module.exports = (client, ready) => {
	initZapBot();
	sql.Count.sync();
	console.log(`Logged in as ${client.user.tag}`);

	client.user.setActivity(client.config.status, { type: 'LISTENING' })
		.then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
		.catch(console.error);
}