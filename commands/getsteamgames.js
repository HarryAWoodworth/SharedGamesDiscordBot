const GameLibrary = require('../models/gameLibrary');
const axios = require('axios');

function lookupVanityKey(vanityKey, apiKey) {
	return new Promise (resolve => {
		var url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${vanityKey}`;
		
        axios.get(url).then((response) => {
            if(response.data.success) {
                resolve(response.data.steamid)
            } else {
                console.log(response.data.error);
			resolve(vanityKey);
            }
        });
	});
}

/**
    Add Steam library to your shared games library
**/
module.exports = {
    name: 'getsteamgames',
    aliases: ['addsteam'],
    description: 'Add Steam library to shared games library',
    args: true,
    dmOnly: true,
    cooldown: 5,
    usage: '<steam_id>',
    async execute(message, args, config, bot, db) {
        console.log("Getting steam games...");
        // Get the steam id
        var steamID = args[0];
        if(isNaN(steamID)) {
            //lookup vanity key
            steamID = await lookupVanityKey(steamID, config.steamWebAPIKey);
            if(isNaN(steamID)) {
                console.log(steamID);
                        message.channel.send("Steam ID needs to be a number or valid vanity key.");
                        return;
            }
        }
        if(steamID.length !== 17) {
            message.channel.send("Steam ID needs to be 17 digits.");
            return;
        }
        var libraryUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${config.steamWebAPIKey}&steamid=${steamID}&include_appinfo=true&include_played_free_games=true&format=json`;

        axios.get(libraryUrl, (response) => {
            // Get the games array
            const gameArr = response.data.response.games; //valve has response in their JSON, makes this look a little funny especially since everything is inside that response object
            var games = [];
            gameArr.forEach(game => {
                games.push(game.name.toLowerCase());
            });
            const gamesStr = games.join(", ").toLowerCase();
            // Get library
            var lib;
            try {
                lib = GameLibrary.findOne({ userName: message.author }, 'gameList').exec();
            } catch(err) {
                console.log(err);
                message.channel.send("There was an error reading from the database.");
                return;
            }
            var userLib;
            // If library is empty, make a new one with the games
            if(lib === undefined || lib === null) {
                console.log("No library yet, making new library...");
                userLib = games.join('|');
                const newEntry = new GameLibrary({userName: message.author, gameList: userLib});
                try {
                    newEntry.save();
                } catch(err) {
                    console.log(err);
                    message.channel.send("There was an error creating a new database entry.");
                    return;
                }
            } else { // If not empty, add games to the library
                userLib = lib.gameList;
                const checkList = userLib.split('|');
                // Prevent duplicates
                for(let i = 0; i < games.length; i++) {
                    if(!checkList.includes(games[i])) {
                        userLib = userLib.concat(`|${games[i]}`);
                    }
                }
                // console.log(`New userLib: ${userLib}`);
                try {
                    GameLibrary.findOneAndUpdate({ userName: message.author }, { gameList: userLib }).exec();
                } catch(err) {
                    console.log(err);
                    message.channel.send("There was an error updating the database.");
                    return;
                }
            }
            var str = `Added \`${gamesStr}\` to your multiplayer library.`;
            if(str.length <= 2000) {
                message.channel.send(str);
            } else {
                message.channel.send(`Added A TON OF GAMES to your multiplayer library!`);
            }
        });
    },
};
