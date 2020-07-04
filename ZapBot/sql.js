const Sequelize = require('sequelize');

const { SQLITE_HOST: host, SQLITE_USER: user, SQLITE_PASSWORD: password } = process.env;

const sequelize = new Sequelize('database', user, password, {
	host: host,
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Count = sequelize.define('count', {
	userId: {
		type: Sequelize.STRING,
		unique: true,
	},
	amount: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

module.exports = {
	Count: Count,
}