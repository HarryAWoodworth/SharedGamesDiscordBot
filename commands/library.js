const GameLibrary = require('../models/gameLibrary');

/**
    Display the user's library
**/
module.exports = {
    name: 'library',
    aliases: ['lib','games'],
    description: 'List Library',
    dmOnly: true,
    cooldown: 3,
    async execute(message, args, config, bot, db) {
        // Get library
        var lib;
        try {
            lib = await GameLibrary.findOne({ userName: message.author }, 'gameList').exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error reading from the database.");
            return;
        }
        if(lib === undefined || lib === null) {
            message.channel.send(`You do not currently have a library! Try \`${config.prefix}help\' for more information.`);
            return;
        }
        var userLib = lib.gameList;
        console.log(`Userlib: ${userLib}`);
        // Display games with indicies
        userLib = userLib.split(',');
        for(i = 0; i < userLib.length; i++) {
            userLib[i] = `${i+1}\t${userLib[i]}`;
        }
        userLib = userLib.join('\n');
        message.channel.send(`${message.author}'s Library:\n${userLib}`);
    },
};
