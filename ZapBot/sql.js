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
	DMChannelId: {
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
User.belongsTo(City); // NULL allowed

const Command = sequelize.define('Command', {
	name: Sequelize.STRING,
});

const UserDMCommand = sequelize.define('User_DM_Command', {
	Usages: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	}
}, { timestamps: false });
User.belongsToMany(Command, { through: UserDMCommand });
Command.belongsToMany(User, { through: UserDMCommand });

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
	Usages: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	}
}, { timestamps: false });
UserTextChannel.belongsToMany(Command, { through: UserTextChannelCommand });
Command.belongsToMany(UserTextChannel, { through: UserTextChannelCommand });

async function countCommand(command, message) {
	const [user,] = await User.findOrCreate({ where: { discordId: message.author.id } });
	const commandEntry = await Command.findOne({ where: { name: command.name } });
	const isDM = message.channel.type == 'dm';
	if (isDM) {
		if (!user.DMChannelId) {
			user.DMChannelId = message.channel.id;
			await user.save();
		}
		const [dmCommandEntry,] = await UserDMCommand.findOrCreate({ 
			where: {
				UserId: user.id,
				CommandId: commandEntry.id 
			}
		})
		await dmCommandEntry.increment('usages');
		return console.log(`Donezo, new usages value is ${dmCommandEntry.usages}`);
	}
	else {
		let guildId = message.guild.id;
	}
	
}

module.exports = {
	//Count: Count,
	User: User,
	Command: Command,
	sync: () => sequelize.sync(),
	countCommand: countCommand,
}