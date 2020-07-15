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

// const User = sequelize.define('user', {
// 	id: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	}
// });

// const City = sequelize.define('city', {
// 	name: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	}
// });
// User.hasOne(City); // NULL allowed

// const Command = sequelize.define('command', {
// 	name: Sequelize.STRING,
// });


// const BotDMChannel = sequelize.define('botDMChannel', {
// 	id: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	}	
// });
// User.hasOne(BotDMChannel) // NULL allowed

const DMCommand = sequelize.define('DMCommand', {
	BotDMChannelId: {
		type: Sequelize.INTEGER,
		references: {
			model: BotDMChannel,
			key: 'id'
		}
	},
	CommandId: {
		type: Sequelize.INTEGER,
		references: {
			model: Command,
			key: 'id'
		}
	},
	Usages: Sequelize.INTEGER
});
BotDMChannel.belongsToMany(Command, { through: DMCommand });
Command.belongsToMany(BotDMChannel, { through: DMCommand });

// const Guild = sequelize.define('guild', {
// 	id: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	}
// });

// const TextChannel = sequelize.define('textchannel', {
// 	id: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	}
// });
// 	Guild.hasMany(TextChannel);

// const UserTextChannel = sequelize.define('user_channel', {
// });
// UserTextChannel.hasOne(User);
// UserTextChannel.hasOne(TextChannel);

// const UserTextChannelCommand = sequelize.define('user_textchannel_command', {
// 	usages: {
// 		type: Sequelize.INTEGER,
// 		defaultValue: 0,
// 	}
// });
// UserTextChannelCommand.hasOne(UserTextChannel);
// UserTextChannelCommand.hasOne(Command);


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