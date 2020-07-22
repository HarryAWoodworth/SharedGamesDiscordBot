/**
	Reloads a command from updated files w/o needing a bot restart
	Does not work on brand new commands
	DOESNT WORK RN BECAUSE OF PERMISSIONS VOODOO
**/
module.exports = {
	name: 'reload',
	description: 'Reloads a command',
    cooldown: 3,
	execute(message, args, config, bot, library) {

		//////// v THIS PART DOESNT WORK v
		message.guild.members.fetch();
		if(!message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send('You do not have permission to shut down this bot.');
            return;
        }
		//////// ^ THIS PART DOESNT WORK ^

        // Check that the command is valid
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
        	|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`.`);
        // Delete the command from cache and reload
        delete require.cache[require.resolve(`./${command.name}.js`)];
        try {
        	const newCommand = require(`./${command.name}.js`);
        	message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` was reloaded!`);
        } catch(err) {
        	console.log(err);
        	message.channel.send(`There was an error while reloading a command \`${command.name}\`.`);
        }
    },
};
