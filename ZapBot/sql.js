const Sequelize = require('sequelize');

const sequelize = new Sequelize( {
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

const UserCmdCount = sequelize.define('user-command-counter', {
	userId: {
		type: Sequelize.STRING,
	},
	commandName: {
		type: Sequelize.STRING,
	},
	amount: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

async function countCommand(command, user) {
	let [userCommandUsageEntry,] = await UserCmdCount.findOrCreate({
		where: {
			userId: user.id,
					commandName: command.name,
		},
		defaults: {
			amount: 0,
		},
				});
	await userCommandUsageEntry.increment('amount');
}

module.exports = {
	Count: Count,
	UserCmdCount: UserCmdCount,
	sync: () => sequelize.sync(),
	countCommand: countCommand,
}