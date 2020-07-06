const cities = require('./city.list.min.json');

module.exports.findCity = (cityToFind) => cities.find(city => cityToFind.toUpperCase() === city.name.toUpperCase());