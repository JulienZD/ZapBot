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
	dmChannelId: {
		type: Sequelize.STRING,
		unique: true
	}
});

const City = sequelize.define('City', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	}
});
User.belongsTo(City, { foreignKey: 'cityId' }); // NULL allowed

const Command = sequelize.define('Command', {
	name: Sequelize.STRING,
});

const UserDMCommand = sequelize.define('User_DM_Command', {
	usages: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	}
}, { timestamps: false });
User.belongsToMany(Command, { through: UserDMCommand, foreignKey: 'userId', otherKey: 'commandId' });
Command.belongsToMany(User, { through: UserDMCommand, foreignKey: 'commandId', otherKey: 'userId' });

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
Guild.hasMany(TextChannel, { otherKey: 'guildId' });
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
User.belongsToMany(TextChannel, { through: UserTextChannel, foreignKey: 'userId', otherKey: 'textChannelId' });
TextChannel.belongsToMany(User, { through: UserTextChannel, foreignKey: 'textChannelId', otherKey: 'userId' });
User.hasMany(UserTextChannel, { foreignKey: 'userId' });
UserTextChannel.belongsTo(User, { foreignKey: 'userId' });
TextChannel.hasMany(UserTextChannel, { foreignKey: 'textChannelId' });
UserTextChannel.belongsTo(TextChannel, { foreignKey: 'textChannelId' });


const UserTextChannelCommand = sequelize.define('User_TextChannel_Command', {
	usages: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	}
}, { timestamps: false });
UserTextChannel.belongsToMany(Command, { through: UserTextChannelCommand, foreignKey: 'user_textChannelId', otherKey: 'commandId' });
Command.belongsToMany(UserTextChannel, { through: UserTextChannelCommand, foreignKey: 'commandId', otherKey: 'user_textChannelId' });
UserTextChannel.hasMany(UserTextChannelCommand, { foreignKey: 'user_textChannelId' });
UserTextChannelCommand.belongsTo(UserTextChannel, { foreignKey: 'user_textChannelId' });
Command.hasMany(UserTextChannelCommand, { foreignKey: 'user_textChannelId' });
UserTextChannelCommand.belongsTo(Command, { foreignKey: 'user_textChannelId' });


async function countCommand(command, message) {
	const [user,] = await User.findOrCreate({ where: { discordId: message.author.id } });
	const commandEntry = await Command.findOne({ where: { name: command.name } });

	if (message.channel.type == 'dm') {
		return countDMCommand(user, commandEntry, message.channel.id);
	}
	else {
		return countGuildCommand(user, commandEntry, message);
	}
}

async function countGuildCommand(user, command, message) {
	let guildId = message.guild.id;
	let channelId = message.channel.id;

	const [guild,] = await Guild.findOrCreate({ where: { guildId: guildId } });
	const [tc, created] = await TextChannel.findOrCreate({
		where: {
			textChannelId: channelId,
			guildId: guild.id
		},
		include: Guild
	});
	if (created) {
		await tc.setGuild(guild);
	}

	const [userTextChannel,] = await UserTextChannel.findOrCreate({
		where: { 
			userId: user.id, 
			textChannelId: tc.id
		},
		include: [User, TextChannel]
	});
	const [userTextChannelCommand,] = await UserTextChannelCommand.findOrCreate({
		include: [UserTextChannel, Command],
		where: {
			user_textChannelId: userTextChannel.id,
			commandId: command.id
		}
	});
	await userTextChannelCommand.increment('usages');
	return console.log(`User [${user.discordId}]: Incremented counter for command [${command.name}] in guild [${guild.guildId}], channel [${channelId}] to [${userTextChannelCommand.usages}]`);
}

async function countDMCommand(user, commandEntry, channelId) {
	if (!user.dmChannelId) {
		user.dmChannelId = channelId;
			await user.save();
		}
		const [dmCommandEntry,] = await UserDMCommand.findOrCreate({ 
			where: {
			userId: user.id,
			commandId: commandEntry.id 
			}
		})
		await dmCommandEntry.increment('usages');
		return console.log(`Donezo, new usages value is ${dmCommandEntry.usages}`);
	}

module.exports = {
	//Count: Count,
	User: User,
	Command: Command,
	sync: () => sequelize.sync(),
	countCommand: countCommand,
}