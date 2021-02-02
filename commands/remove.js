const GameLibrary = require('../models/gameLibrary');

/**
    Remove game(s) at an index(es) from a user's library
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
        var indicies = new Array()
	args.forEach(index => {
	    index = index.split(',')[0];
	    index = index.trim();
	    console.log(index);
            if(!isNaN(index)) {
		console.log('We got a number! ' + index);
                indicies.push(parseInt(index.trim(),10));
            }
        });
	indicies.sort();

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
        for(index = games.length-1; index >= 0; index--) {
	    if(!removedGameNames.includes(games[index])) {
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
        var str = `Removed ${removedStr} from your library.`;
        if(str.length <= 2000) {
            message.channel.send(str);
        } else {
            var cutArr = str.match(/(.|[\r\n]){1,2000}/g);
            for(var index = 0; index < cutArr.length; index++) {
                message.channel.send(cutArr[index]);
            }
        }
    }
}
