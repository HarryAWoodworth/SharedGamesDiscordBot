const fs = require('fs');
const Discord = require('discord.js');
const DisTube = require('distube');
const mongoose = require('mongoose');
const config = require('./config.json');

// Initialize Discord Bot
const bot = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_VOICE_STATES]});
const distube = new DisTube(bot, { leaveOnFinish: true});
bot.commands = new Discord.Collection();
const dmOnlyMode = config.dmOnly;

// Initialize commands from command folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

// Connect to Mongodb
mongoose.connect(config.mongoDbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', err => console.error('MongoDb Connection Error:', err));
db.once('open', function() {
	console.log('MongoDb Database Connected!');
});

// Cooldown collection
const cooldowns = new Discord.Collection();

// Send ready to console
bot.once('ready', () => { console.log('Ready!'); } );

////////////////////////////////////////////////////////////////////////////////
//                             BOT ACTIONS                                    //
////////////////////////////////////////////////////////////////////////////////
bot.on('message', message => {
    // Check message starts with prefix
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;
    // Trim the prefix and split into args, get command
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    // Check if command is valid
	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if(!command) {
		message.reply(`That is not a command. To see commands, try \`${config.prefix}help\`.`);
		return;
	}
	// If dmOnly:true in command and enabled in config, make sure the command is in DMs
	if(command.dmOnly && message.channel.type !== "dm" && dmOnlyMode) {
		return message.author.send(`Hello ${message.author}! Please use bot commands here in DMs to avoid clogging up server channels.`);
	}
	// Check that command is not on cooldown
	if(!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;
	if(timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if(now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    // If args:true in command, check that there are args
    if(command.args && !args.length) {
        let reply = `No arguments found ${message.author}!`;
        if(command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    // Execute command
    try {
		if(command.distube) {
			command.execute(message, args, config, bot, db, distube);
		} else {
			command.execute(message, args, config, bot, db);
		}
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

// DisTube event listeners
distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\``
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue`
    ))
		.on("finish", (message, queue, song) => message.channel.send(
        `No more songs to play, bye!`
    ))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("An error encountered: " + e);
    });

// Log the bot in
bot.login(config.token);
