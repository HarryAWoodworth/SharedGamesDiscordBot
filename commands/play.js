/**
    Play the requested song
**/
module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Play a song',
    cooldown: 3,
    args: true,
    distube: true,
    async execute(message, args, config, bot, db, distube) {
      console.log("PLaying a song")
      distube.play(message, args.join(' '));
    },
};
