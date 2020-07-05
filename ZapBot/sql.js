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
		unique: true,
	},
	commandName: {
		type: Sequelize.STRING,
		unique: true,
	},
	amount: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

function countCommand(command, user) {
	let userCommandUsageEntry = await UserCmdCount.findOne({ where: { userId: user.id, commandName: command.name } });
		if (!userCommandUsageEntry) {
			try {
				userCommandUsageEntry = await UserCmdCount.create({
					userId: message.author.id,
					commandName: command.name,
				});
			}
			catch (err) {
				console.log(err);
				return message.reply('Something went horribly wrong.');
			}
		}
		userCommandUsageEntry.amount = userCommandUsageEntry.amount + 1;
		await countEntry.save();
}

module.exports = {
	Count: Count,
	UserCmdCount: UserCmdCount,
	sync: () => sequelize.sync(),
	countCommand: countCommand,
}