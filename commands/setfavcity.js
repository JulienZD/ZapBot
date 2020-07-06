const { WeatherFavourite } = require('../ZapBot/sql');
const cities = require('./weather/current.city.list.min.json');

module.exports = {
	name: 'setfavcity',
	description: 'Set the city used in the `weather` command',
	cooldown: 5,
	args: true,
	execute(message, args) {
		if (findCity(args[0])) return message.reply('found it!');
		else return message.reply('nah');

		if (args[0]) {
			setFavourite(message.author.id, city);
			return message.reply('hey');
		}
	},
};


async function setFavourite(userId, city) {
	// if city in valid city ids... 
	let entry = await WeatherFavourite.findOne({ where: { userId: userId } });
	entry.favouriteCity = city;
	await entry.save();
}

function findCity(city) {
	console.log(cities);
}