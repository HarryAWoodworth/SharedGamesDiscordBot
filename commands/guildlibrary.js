const GameLibrary = require('../models/gameLibrary');

/**
    Display the guild's shared online library
**/
module.exports = {
    name: 'guildlibrary',
    aliases: ['libg','gamesg','listg'],
    description: 'List Guild Online Game Library',
    cooldown: 3,
    async execute(message, args, config, bot, db) {
        // Check that message is in a guild
        if(message.channel.guild === undefined) {
            message.channel.send("You must be in a guild channel to use this command.");
            return;
        }
        // Get guild name
        const guildName = message.channel.guild.name;
        // Get guild library
        var lib;
        try {
            lib = await GameLibrary.findOne({ userName: guildName }, 'gameList').exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error reading from the database.");
            return;
        }
        if(lib === undefined || lib === null) {
            message.channel.send(`Your guild does not currently have a shared multiplayer library! Try \`${config.prefix}help\' for more information.`);
            return;
        }
        var guildLib = lib.gameList;
        //console.log(`guildLib: ${guildLib}`);
        // Display games with indicies
        guildLib = guildLib.split('|').sort();
        for(i = 0; i < guildLib.length; i++) {
            guildLib[i] = `${i+1}\t${guildLib[i]}`;
        }
        guildLib = guildLib.join('\n');
        var str = `\`\`\`css\n[GUILD SHARED MULTIPLAYER GAMES:]\`\`\`\`\`\`bash\n${guildLib}\`\`\``;
        if(str.length <= 2000) {
            message.channel.send(str);
        } else {
            var cutArr = str.match(/(.|[\r\n]){1,2000}/g);
            for(var index = 0; index < cutArr.length; index++) {
                message.channel.send(cutArr[index]);
            }
        }
    },
};
