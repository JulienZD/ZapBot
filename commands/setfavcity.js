const { WeatherFavourite } = require('../ZapBot/sql');
const cities = require('./weather/city.list.min.json');

module.exports = {
	name: 'setfavcity',
	description: 'Set the city used in the `weather` command',
	cooldown: 5,
	args: true,
	execute(message, args) {
		let argCity = args.join(' ');
	
		let city = findCity(argCity);
		if (!city) return message.reply('that\'s not a valid city.\nFor a list of valid cities, see http://bulk.openweathermap.org/sample/city.list.json.gz (downloads automatically)');

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

function findCity(cityToFind) {
	return cities.find(city => cityToFind.toUpperCase() === city.name.toUpperCase());
}