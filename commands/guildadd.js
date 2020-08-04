const GameLibrary = require('../models/gameLibrary');

/**
    Add games to the guild's shared library
**/
module.exports = {
    name: 'guildadd',
    aliases: ['+g','addg'],
    description: 'Add Online Games Shared By Everyone',
    args: true,
    cooldown: 2,
    usage: '<game name> | ... | <game name>',
    async execute(message, args, config, bot, db) {
        // Split args, remove duplicates
        const fullGameStr = args.join(' ').toLowerCase();
        const uniqueSet = new Set(fullGameStr.split(" | "));
        const games = [...uniqueSet];
        const gamesStr = games.join(",").toLowerCase();
        // Check that message is in a guild
        if(message.channel.guild === undefined) {
            message.channel.send("You must be in a guild channel to use this command.");
            return;
        }
        // Get guild name
        const guildName = message.channel.guild.name;
        console.log(`Adding ${gamesStr} to guild shared multiplayer library...`);
        // Get guild library
        var lib;
        try {
            lib = await GameLibrary.findOne({ userName: guildName }, 'gameList').exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error reading from the database.");
            return;
        }
        var guildLib;
        // If library is empty, make a new one with the games
        if(lib === undefined || lib === null) {
            console.log("No library yet, making new library...");
            guildLib = games.join('|');
            const newEntry = new GameLibrary({userName: guildName, gameList: guildLib});
            try {
                await newEntry.save();
            } catch(err) {
                console.log(err);
                message.channel.send("There was an error creating a new database entry.");
                return;
            }
        } else {
        // If not empty, add games to the library
            guildLib = lib.gameList;
            const checkList = guildLib.split('|');
            // Prevent duplicates
            for(let i = 0; i < games.length; i++) {
                if(!checkList.includes(games[i])) {
                    guildLib = guildLib.concat(`|${games[i]}`);
                }
            }
            // console.log(`New guildLib: ${guildLib}`);
            try {
                await GameLibrary.findOneAndUpdate({ userName: guildName }, { gameList: guildLib }).exec();
            } catch(err) {
                console.log(err);
                message.channel.send("There was an error updating the database.");
                return;
            }
        }
        var str = `Added \`${gamesStr}\` to ${guildName}\'s shared multiplayer library.`;
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
