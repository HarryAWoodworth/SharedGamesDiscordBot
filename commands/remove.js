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
    usage: '<index>',
    async execute(message, args, config, bot, db) {
        // Get the index and parse
        const index = args[0];
        if(isNaN(index)) {
            message.channel.send(`Index needs to be a number.`);
            return;
        }
        const indexToRemove = parseInt(index, 10);
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
        console.log(`Userlib: ${userLib}`);
        if(userLib === undefined) {
            message.channel.send(`${message.author}'s Library is empty.`);
            return;
        }
        let games = userLib.split(',');
        // Check index is valid
        if(indexToRemove > games.length || indexToRemove < 0) {
            message.channel.send(`Index is not valid`);
            return;
        }
        let gameToRemove = games[indexToRemove-1];
        // Remove library if going to be empty
        if(games.length === 1) {
            try {
                await GameLibrary.findOneAndDelete({ userName: message.author }).exec();
            } catch(err) {
                console.log(err);
                message.channel.send("There was an error updating the database.");
                return;
            }
            message.channel.send(`Removed \`${gameToRemove}\` from your library.`);
            return;
        }
        // Remove game
        /// Works thanks to Connor R.
        games.splice(indexToRemove-1, 1);
        games = games.join(',');
        try {
            await GameLibrary.findOneAndUpdate({ userName: message.author }, { gameList: games }).exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error updating the database.");
            return;
        }
        message.channel.send(`Removed \`${gameToRemove}\` from your library.`);
    },
};
