const GameLibrary = require('../models/gameLibrary');

/**
    Remove a game at an index from a user's library
**/
module.exports = {
    name: 'guildremove',
    aliases: ['-g','deleteg'],
    description: 'Remove Game From Guild Shared Games',
    args: true,
    cooldown: 3,
    usage: '<index>,...,<index>',
    async execute(message, args, config, bot, db) {
        // Check that message is in a guild
        if(message.channel.guild === undefined) {
            message.channel.send("You must be in a guild channel to use this command.");
            return;
        }
        // Get guild name
        const guildName = message.channel.guild.name;
        // Get the index and parse
        const indiciesSet = new Set(args[0].split(','));
        const indiciesStr = [...indiciesSet];
        indiciesStr.forEach(index => {
            if(isNaN(index)) {
                message.channel.send(`Index needs to be a number: ${index}`);
                return;
            }
        });
        const indicies = indiciesStr.map(index => parseInt(index,10) );
        // Get the library
        var lib;
        try {
            lib = await GameLibrary.findOne({ userName: guildName }, 'gameList').exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error reading from the database.");
            return;
        }
        var userLib = lib.gameList;
        //console.log(`Userlib: ${userLib}`);
        if(userLib === undefined) {
            message.channel.send(`${guildName}'s shared multiplayer library is empty.`);
            return;
        }
        let games = userLib.split('|').sort();
        var removedGameNames = [];
        // Check validity of indicies
        indicies.forEach(index => {
            if(index > games.length || index < 0) {
                message.channel.send(`Index is not valid: ${index}`);
                return;
            } else {
                removedGameNames.push(games[index-1]);
            }
        });
        // Create a new array with games that are not removed
        var newLib = [];
        for(index = 0; index < games.length; index++) {
            if(!indicies.includes(index+1)) {
                newLib.push(games[index]);
            }
        }
        var newLibStr = newLib.join('|');
        var removedStr = removedGameNames.join(',');
        try {
            await GameLibrary.findOneAndUpdate({ userName: guildName }, { gameList: newLibStr }).exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error updating the database.");
            return;
        }
        var str = `Removed ${removedStr} from your guild's shared multiplayer library.`;
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
