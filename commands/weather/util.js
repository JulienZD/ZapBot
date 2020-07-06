const cities = require('./city.list.min.json');
const { WeatherFavourite } = require('../../ZapBot/sql');
const axios = require('axios');

const findCity = (cityToFind) => cities.find(city => cityToFind.toUpperCase() === city.name.toUpperCase());

async function getFavCity(userId) {
	let entry = await WeatherFavourite.findOne({
		where: { 
			userId: userId 
		} 
	});

	return findCity(entry.favouriteCity);
}

function getWeatherForecast(city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
	return new Promise((resolve, reject) => {
		resolve(axios.get(url)
			.then(res => {
			return res.data;
			})
			.catch(err => console.log(err)));
	});
}

module.exports.getFavCity = getFavCity;
module.exports.findCity = findCity;
module.exports.getWeatherForecast = getWeatherForecast;