const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: process.env.SQLITE_HOST,
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
	sync: () => sequelize.sync(),
}