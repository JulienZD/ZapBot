const Sequelize = require('sequelize');

const sequelize = new Sequelize( {
	host: process.env.SQLITE_HOST,
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
	define: {
		freezeTableName: true,
	}
});

// const Count = sequelize.define('count', {
// 	userId: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	},
// 	amount: {
// 		type: Sequelize.INTEGER,
// 		defaultValue: 0,
// 		allowNull: false,
// 	},
// });

const User = sequelize.define('User', {
	discordId: {
		type: Sequelize.STRING,
		unique: true,
	},
});

const City = sequelize.define('City', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	}
});
User.belongsTo(City); // NULL allowed

const Command = sequelize.define('Command', {
	name: Sequelize.STRING,
});

const BotDMChannel = sequelize.define('Bot_DMChannel', {
	channelId: {
		type: Sequelize.STRING,
		unique: true,
	}	
});
User.belongsTo(BotDMChannel) // NULL allowed

const DMCommand = sequelize.define('DM_Command', {
	Usages: Sequelize.INTEGER,
}, { timestamps: false });
BotDMChannel.belongsToMany(Command, { through: DMCommand });
Command.belongsToMany(BotDMChannel, { through: DMCommand });

const Guild = sequelize.define('Guild', {
	guildId: {
		type: Sequelize.STRING,
		unique: true,
	}
});

const TextChannel = sequelize.define('TextChannel', {
	textChannelId: {
		type: Sequelize.STRING,
		unique: true,
	}
});
TextChannel.belongsTo(Guild);

// --- User_TextChannel ---
const UserTextChannel = sequelize.define('User_TextChannel', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	}
}, { timestamps: false });
User.belongsToMany(TextChannel, { through: UserTextChannel });
TextChannel.belongsToMany(User, { through: UserTextChannel });


const UserTextChannelCommand = sequelize.define('User_TextChannel_Command', {
	usages: Sequelize.INTEGER,
}, { timestamps: false });
UserTextChannel.belongsToMany(Command, { through: UserTextChannelCommand });
Command.belongsToMany(UserTextChannel, { through: UserTextChannelCommand });

module.exports = {
	//Count: Count,
	User: User,
	City: City,
	BotDMChannel: BotDMChannel,
	UserTextChannel: UserTextChannel,
	UserTextChannelCommand: UserTextChannelCommand,
	Guild: Guild,
	DMCommand: DMCommand,
	Command: Command,
	TextChannel: TextChannel,
	sync: () => sequelize.sync(),
	countCommand: countCommand,
}