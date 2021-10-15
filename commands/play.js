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
      try{
        distube.play(message, args.join(' '));
      } catch (error) {
        console.log("\nERROR WITH PLAY COMMAND:\n");
        console.error(error);
      }
    },
};
