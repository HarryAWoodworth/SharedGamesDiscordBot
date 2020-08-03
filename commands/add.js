const GameLibrary = require('../models/gameLibrary');

/**
    Add games to the user's library. ALlows addition of multiple games at once.
**/
module.exports = {
    name: 'add',
    aliases: ['+'],
    description: 'Add Game',
    args: true,
    dmOnly: true,
    cooldown: 2,
    usage: '<game name> | ... | <game name>',
    async execute(message, args, config, bot, db) {
        // Split args, remove duplicates
        const fullGameStr = args.join(' ').toLowerCase();
        const uniqueSet = new Set(fullGameStr.split(" | "));
        const games = [...uniqueSet];
        const gamesStr = games.join(",").toLowerCase();
        console.log(`Adding ${gamesStr} to library...`);
        // Get library
        var lib;
        try {
            lib = await GameLibrary.findOne({ userName: message.author }, 'gameList').exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error reading from the database.");
            return;
        }
        var userLib;
        // If library is empty, make a new one with the games
        if(lib === undefined || lib === null) {
            console.log("No library yet, making new library...");
            userLib = games.join('|');
            const newEntry = new GameLibrary({userName: message.author, gameList: userLib});
            try {
                await newEntry.save();
            } catch(err) {
                console.log(err);
                message.channel.send("There was an error creating a new database entry.");
                return;
            }
        } else {
        // If not empty, add games to the library
            userLib = lib.gameList;
            const checkList = userLib.split('|');
            // Prevent duplicates
            for(let i = 0; i < games.length; i++) {
                if(!checkList.includes(games[i])) {
                    userLib = userLib.concat(`|${games[i]}`);
                }
            }
            // console.log(`New userLib: ${userLib}`);
            try {
                await GameLibrary.findOneAndUpdate({ userName: message.author }, { gameList: userLib }).exec();
            } catch(err) {
                console.log(err);
                message.channel.send("There was an error updating the database.");
                return;
            }
        }
        message.channel.send(`Added \`${gamesStr}\` to your multiplayer library.`);
    },
};
