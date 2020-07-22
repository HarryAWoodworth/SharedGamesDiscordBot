const GameLibrary = require('../models/gameLibrary');

module.exports = {
    name: 'test',
    description: 'Test',
    cooldown: 300,
    async execute(message, args, config, bot, db) {
        // ...
        message.channel.send(`Woah! You found an easter egg.`);
    },
};
