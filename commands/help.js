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
            \n\"add <game name> | ... | <game name>\", (alias -> +): Add game(s) to your library.
            \n\"getsteamgames <steam_id>\", (alias -> addsteam): Add all steam games to your library.
            \n\"remove <index>,...,<index>\", (alias -> - , delete): Remove game(s) from your library.
            \n\"removeall\", (alias -> clear): Remove your entire library.
            \n\"compare\", (alias -> comp , shared): Compare libraries of users connected to the same voice channel.
        \`\`\``);
    },
};
