const GameLibrary = require('../models/gameLibrary');

/**
    Compare the game libraries of members in the caller's voice channel
**/
module.exports = {
    name: 'compare',
    aliases: ['comp','shared'],
    description: 'Compare games between active members.',
    cooldown: 1,
    async execute(message, args, config, bot, db) {
        // Check that user is in a voice channel
        var voiceChannel = message.member.voice.channel;
        if (voiceChannel === undefined) {
            message.author.send('Please join a voice channel before using this command.');
            return;
        }
        // Fetch all members online
        message.guild.members.fetch().then(async function(members) {
            // Filter by in the caller's voice channel
        	const online = members.filter(member => member.voice.channel === voiceChannel);
            // Check for at least 2 members
            if(online === undefined || online.size < 2) {
                message.channel.send("There needs to be at least 2 people in the voice channel.");
                return;
            }
            // Get the first member's game list to start comparison
            // since online is a map of GuildMember json objects,
            // use online.values().next().value.user to get the
            // first user object for base comparison
            var firstMemberLibrary;
            try {
                firstMemberLibrary = await GameLibrary.findOne({ userName: online.values().next().value.user }, 'gameList').exec();
            } catch(err) {
                console.log(err);
                message.channel.send("There was an error reading from the database.");
                return;
            }
            if(firstMemberLibrary === undefined || firstMemberLibrary === null || firstMemberLibrary.gameList === undefined || firstMemberLibrary.gameList.length === 0) {
                message.channel.send(`${online.values().next().value.user} doesn't have a library! Add games to compare with other members.`);
                return;
            }
            var firstLib = firstMemberLibrary.gameList.split(',');
            // Get the library of each member and compare to the first using filter
            // TODO fix comparing the first library to itself, not super important
            for(const [key, value] of online) {
                if(firstLib.length === 0) {
                    message.channel.send(`You have no similar games... sorry!`);
                    return;
                }
                try {
                    var memberLib = await GameLibrary.findOne({ userName: value.user }, 'gameList').exec();
                } catch(err) {
                    console.log(err);
                    message.channel.send(`There was an error reading ${value.user}\'s library from the database.`);
                    return;
                }
                if(memberLib === undefined || memberLib === null || memberLib.gameList.length === 0) {
                    message.channel.send(`${value.user} doesn't have a library! Add games to compare with other members.`);
                    return;
                }
                var lib = memberLib.gameList.split(',');
                firstLib = firstLib.filter(game => lib.includes(game));
            }
            if(firstLib.length === 0) {
                message.channel.send(`You have no similar games... sorry!`);
                return;
            }
            // Send to channel with Discord code markdown
            var sharedGames = firstLib.map(gameStr => { return `\"${gameStr}\"`; }).join('\n');
            message.channel.send(`\`\`\`css\n[SHARED GAMES:]\`\`\`\`\`\`bash\n${sharedGames}\`\`\``);
        });
    },
};
