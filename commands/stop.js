/**
    Stop the music bot
**/
module.exports = {
    name: 'stop',
    aliases: ['fuckoff'],
    description: 'Stop the bot playing music, disconnect it',
    cooldown: 3,
    args: true,
    distube: true,
    async execute(message, args, config, bot, db, distube) {
        distube.stop(message);
        message.channel.send("Stopped the bot.");
    },
};
