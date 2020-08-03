const GameLibrary = require('../models/gameLibrary');

/**
    Display the user's library
**/
module.exports = {
    name: 'library',
    aliases: ['lib','games','list'],
    description: 'List Library',
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
        //console.log(`Userlib: ${userLib}`);
        // Display games with indicies
        userLib = userLib.split('|').sort();
        for(i = 0; i < userLib.length; i++) {
            userLib[i] = `${i+1}\t${userLib[i]}`;
        }
        userLib = userLib.join('\n');
        var str = `${message.author}'s Library:\n${userLib}`;
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
