const cities = require('./city.list.min.json');
const { WeatherFavourite } = require('../../ZapBot/sql');

async function getFavCity(userId) {
	let entry = await WeatherFavourite.findOne({ where: { userId: userId } });
	return entry.favouriteCity; //{ name: 'The Hague' }
}

module.exports.getFavCity = getFavCity;
module.exports.findCity = (cityToFind) => cities.find(city => cityToFind.toUpperCase() === city.name.toUpperCase());