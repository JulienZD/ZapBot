const { WeatherFavourite } = require('../ZapBot/sql');
const { findCity, getFavCity } = require('./weather/util');
const Discord = require('discord.js');

module.exports = {
	name: 'weather',
	description: 'Displays the weather in any city',
	aliases: ['w'],
	cooldown: 5,
	async execute(message, args) {
		let city = await getFavCity(message.author.id);;

		if (args.length) {
			let cityToFind = args.join(' ');
			city = findCity(cityToFind);
		}
		
		if (!city) {
			// Invalid city or user doesn't have a favourite city set
			return message.reply(`please provide a valid city or set your favourite city by using \`${message.client.config.prefix}setfavcity\``);
		}
		let embed = new Discord.MessageEmbed()
			.setTitle(`${city.name} weather:`);

		embed.addField('\u200b', '_Weather information provided by [OpenWeather](https://www.openweather.com/)._');
		message.channel.send(embed);
	},
};
