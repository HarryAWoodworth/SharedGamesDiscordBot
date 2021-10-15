/**
    Skip current song
**/
module.exports = {
    name: 'skip',
    description: 'Skip current song',
    cooldown: 3,
    distube: true,
    async execute(message, args, config, bot, db, distube) {
      try {
        distube.skip(message);
      } catch (error) {
        console.log("\nERROR WITH SKIP COMMAND:\n");
        console.error(error);
      }
    },
};
