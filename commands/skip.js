/**
    Skip current song
**/
module.exports = {
    name: 'skip',
    description: 'Skip current song',
    cooldown: 3,
    args: true,
    distube: true,
    async execute(message, args, config, bot, db, distube) {
        distube.skip(message);
    },
};
