const GameLibrary = require('../models/gameLibrary');

/**
    Deletes a user's library
**/
module.exports = {
    name: 'removeall',
    description: 'Remove All Games',
    aliases: ['clear'],
    dmOnly: true,
    cooldown: 10,
    async execute(message, args, config, bot, library) {
        // Get library (quality of life to say library is already empty)
        var lib;
        try {
            lib = await GameLibrary.findOne({ userName: message.author }).exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error reading from the database.");
            return;
        }
        if(lib === undefined) {
            message.channel.send(`${message.author}'s Library is already empty.`);
            return;
        }
        // Delete library
        try {
            await GameLibrary.findOneAndDelete({ userName: message.author }).exec();
        } catch(err) {
            console.log(err);
            message.channel.send("There was an error deleting your library.");
            return;
        }
        message.channel.send(`Removed ${message.author}'s entire library.`);
    },
};
