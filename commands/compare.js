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
            var firstLib = firstMemberLibrary.gameList.split('|');
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
                var lib = memberLib.gameList.split('|');
                firstLib = firstLib.filter(game => lib.includes(game));
            }
            if(firstLib.length === 0) {
                message.channel.send(`You have no similar games... sorry!`);
                return;
            }
            // Check if the compare is adding shared guild games
            if(args.length > 0 && args[0].localeCompare("g") === 0) {
                console.log(`Comparing with shared guild games...`);
                // Get guild name
                const guildName = message.channel.guild.name;
                // get guild lib
                var guildLib;
                try {
                    guildLib = await GameLibrary.findOne({ userName: guildName }, 'gameList').exec();
                } catch(err) {
                    console.log(err);
                    message.channel.send("There was an error reading from the database to get guild shared games.");
                    return;
                }
                // If games were retrieved, add to firstLib
                if(guildLib !== undefined && guildLib !== null && guildLib.gameList !== undefined  && guildLib.gameList !== null) {
                    console.log(`Adding guild games...`);
                    guildLib.gameList.split('|').forEach(guildGame => firstLib.push(guildGame));
                }
            }
            // Send to channel with Discord code markdown
            var sharedGames = firstLib.map(gameStr => { return `\"${gameStr}\"`; }).sort().join('\n');
            const messageStr = `\`\`\`css\n[SHARED GAMES:]\`\`\`\`\`\`bash\n${sharedGames}\`\`\``;
            if(messageStr.length <= 2000) {
                message.channel.send(messageStr);
            } else {
                var cutArr = messageStr.match(/(.|[\r\n]){1,2000}/g);
                for(var index = 0; index < cutArr.length; index++) {
                    message.channel.send(cutArr[index]);
                }
            }
        });
    },
};
