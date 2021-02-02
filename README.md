SHARED GAMES DISCORD BOT

Type `>help` to see commands.

Built using Discord.js and MongoDB Atlas Cloud.

![help command](https://i.imgur.com/i0wao98.png)

![add command](https://i.imgur.com/QWVYo4J.png)

![library command](https://i.imgur.com/OOcyKg0.png)

![compare command](https://i.imgur.com/AFYNTGy.png)


#Config

Create a config.json file in the root directory for the bot like below

{
	"prefix": ">",
	"token": "XXXXXXXXXXXXXXXXXXXXXXXX.XXXXXX.XXXXXXXXXXXXXXXXX-XXXX-XXXX",
	"mongoDbURI": "mongodb+srv://dbUser:yourusernameyoullfigurethisoutwhenyousetuponmongo",
	"steamWebAPIKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	"dmOnly": false
}

prefix determines what users use to denote a command is for this bot, and can be any character

token is a discord bot user token and can be found after setting up a bot [at the Discord Developer Portal](https://discord.com/developers/applications)

mongoDbURI likewise should be a link to mongoDb you set up

steamWebAPIKey is required for users to automatically add their steam library. It can be created [on steam (account required)](https://steamcommunity.com/dev/apikey)

dmOnly is a boolean config for whether or not certain commands will work only direct messaging the bot
