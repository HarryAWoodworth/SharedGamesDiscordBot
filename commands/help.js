/**
    Display a help message with Discord markdown
**/
module.exports = {
    name: 'help',
    description: 'Help Message',
    cooldown: 3,
    execute(message, args, config, bot, db) {
        message.channel.send(`\`\`\`ini
            \n[Command Prefix]: ${config.prefix}\`\`\`\n\`\`\`bash
            \n\"help\": Display help message.
            \n\"library\", (alias -> lib , games): List your game library.
            \n\"add <game name> | ... | <game name>\", (alias -> +): Add game to your library.
            \n\"remove <index>\", (alias -> - , delete): Remove game from your library.
            \n\"removeall\": Remove your entire library.
            \n\"compare\", (alias -> comp): Compare libraries of users connected to the same voice channel.
        \`\`\``);
    },
};
