const { initZapBot } = require('../ZapBot/setup');
const { status: STATUS } = require('../config.json');

module.exports = (client, ready) => {
	initZapBot();
	console.log(`Logged in as ${client.user.tag}`);

	client.user.setActivity(STATUS, { type: 'LISTENING' })
		.then(presence => console.log(`Status set to "${presence.activities[0].name}"`))
		.catch(console.error);
}