const GameLibrary = require('../models/gameLibrary');

/**
    Remove a game at an index from a user's library
**/
module.exports = {
    name: 'remove',
    aliases: ['-','delete'],
    description: 'Remove Game',
    args: true,
    dmOnly: true,
    cooldown: 3,
    usage: '<index>,...,<index>',
    async execute(message, args, config, bot, db) {
        // Get the index and parse
        const indiciesSet = new Set(args[0].split(','));
        const indiciesStr = [...indiciesSet];
        indiciesStr.forEach(index => {
            if(isNaN(index)) {
                message.channel.send(`Index needs to be a number: ${index}`);
                return;
            }
        });
        console.log(`Removing str indicies: ${indiciesStr}`);
        const indicies = indiciesStr.map(index => parseInt(index,10) );
        console.log(`Removing indicies: ${indicies}`);
        // Get the library
        var lib;
        try {
            lib = await GameLibrary.findOne({ userName: message.author }, 'gameList').exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error reading from the database.");
            return;
        }
        var userLib = lib.gameList;
        //console.log(`Userlib: ${userLib}`);
        if(userLib === undefined) {
            message.channel.send(`${message.author}'s Library is empty.`);
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
            await GameLibrary.findOneAndUpdate({ userName: message.author }, { gameList: newLibStr }).exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error updating the database.");
            return;
        }
        message.channel.send(`Removed ${removedStr} from your library.`);
    },
};
